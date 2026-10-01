document.addEventListener('DOMContentLoaded', () => {
    const pdfjsLib = window['pdfjs-dist/build/pdf'] || window.pdfjsLib;
    if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const importLoading = document.getElementById('importLoading');
    const reviewModal = document.getElementById('reviewModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelReview = document.getElementById('btnCancelReview');
    const btnApplyReview = document.getElementById('btnApplyReview');
    const reviewTableContainer = document.getElementById('reviewTableContainer');

    let extractedData = {};

    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover') );
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault(); dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
        });
    }

    function handleFile(file) {
        dropzone.style.display = 'none';
        importLoading.style.display = 'block';
        importLoading.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Lendo e estruturando arquivo...';
        
        const ext = file.name.split('.').pop().toLowerCase();
        
        if (ext === 'pdf') {
            extractFromPdf(file);
        } else if (ext === 'docx') {
            extractFromDocx(file);
        } else {
            alert('Formato não suportado. Envie um arquivo .pdf ou .docx');
            resetImportUI();
        }
    }

    function resetImportUI() {
        dropzone.style.display = 'block';
        importLoading.style.display = 'none';
        fileInput.value = '';
    }

    async function extractFromPdf(file) {
        if (!pdfjsLib) {
            alert('A biblioteca de leitura de PDF não foi carregada corretamente. Verifique sua conexão.');
            resetImportUI();
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            
            let fullText = "";
            let maxPagesToRead = Math.min(15, pdf.numPages); 
            
            for (let i = 1; i <= maxPagesToRead; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                
                // Ordenação visual precisa baseada nas coordenadas PDF para manter a estrutura original (Títulos multilinha)
                const items = textContent.items;
                items.sort((a, b) => {
                    const yDiff = b.transform[5] - a.transform[5];
                    if (Math.abs(yDiff) > 6) return yDiff; // Ordena Vertical (Top down)
                    return a.transform[4] - b.transform[4]; // Ordena Horizontal (Left right)
                });

                const pageText = items.map(item => item.str).join(' ');
                fullText += `--- INÍCIO DA PÁGINA ${i} ---\n${pageText}\n\n`;
            }

            if (fullText.replace(/\s/g, '').length < 50) {
                alert('Documento aparentemente escaneado como imagem. O processamento automático requer um arquivo com texto pesquisável.');
                resetImportUI();
                return;
            }

            sendToAPI(fullText, pdf.numPages);
        } catch (error) {
            console.error('Erro ao ler PDF:', error);
            alert('Falha na leitura do arquivo PDF. Ele pode estar corrompido ou protegido.');
            resetImportUI();
        }
    }

    async function extractFromDocx(file) {
        if (typeof mammoth === 'undefined') {
            alert('Biblioteca Mammoth (DOCX) não carregada.');
            resetImportUI();
            return;
        }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
            const fullText = result.value;
            sendToAPI(fullText, null);
        } catch (error) {
            console.error('Erro ao ler DOCX:', error);
            alert('Falha ao processar o DOCX.');
            resetImportUI();
        }
    }

    async function sendToAPI(text, totalPages) {
        importLoading.innerHTML = '<i class="fa-solid fa-microchip fa-fade"></i> Inteligência Artificial Extraindo e Conciliando Dados...';
        
        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, totalPages })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'Configuração ausente') {
                    alert(`Não foi possível realizar a extração:\n\n${data.details}`);
                } else {
                    alert(`Erro na extração: ${data.error} - ${data.details || ''}`);
                }
                resetImportUI();
                return;
            }

            importLoading.innerHTML = '<i class="fa-solid fa-check"></i> Pronto para revisão';
            processExtractedData(data);

        } catch (error) {
            console.error('Erro de requisição para API:', error);
            alert('Erro de conexão com o servidor de Inteligência.');
            resetImportUI();
        }
    }

    function processExtractedData(data) {
        extractedData = {
            authorName: data.autor_nome || { val: null, source: '' },
            authorSurname: data.autor_sobrenome || { val: null, source: '' },
            title: data.titulo || { val: null, source: '' },
            subtitle: data.subtitulo || { val: null, source: '' },
            city: data.cidade || { val: null, source: '' },
            year: data.ano || { val: null, source: '' },
            pages: data.paginas || { val: null, source: '' },
            workType: data.tipo_trabalho || { val: null, source: '' },
            course: data.curso || { val: null, source: '' },
            advisor: data.orientador || { val: null, source: '' },
            coadvisor: data.coorientador || { val: null, source: '' },
            kws: data.palavras_chave || { val: null, source: '' }
        };

        buildReviewModal();
    }

    function buildReviewModal() {
        const tableContainer = document.getElementById('reviewTableContainer');
        
        let html = `
        <table class="review-table">
            <thead>
                <tr>
                    <th width="5%">Inc.</th>
                    <th width="20%">Campo</th>
                    <th width="35%">Valor Encontrado</th>
                    <th width="40%">Trecho Original Localizado</th>
                </tr>
            </thead>
            <tbody>`;

        const fieldsToMap = [
            { id: 'authorName', name: 'Nome do Autor', inputId: 'authorName' },
            { id: 'authorSurname', name: 'Último Sobrenome', inputId: 'authorSurname' },
            { id: 'title', name: 'Título Principal', inputId: 'title' },
            { id: 'subtitle', name: 'Subtítulo', inputId: 'subtitle' },
            { id: 'city', name: 'Cidade', inputId: 'city' },
            { id: 'year', name: 'Ano de Defesa', inputId: 'year' },
            { id: 'pages', name: 'Nº de Folhas', inputId: 'pages' },
            { id: 'workType', name: 'Tipo de Trabalho', inputId: 'workType' },
            { id: 'course', name: 'Curso / Programa', inputId: 'course' },
            { id: 'advisor', name: 'Orientador', inputId: 'advisor' },
            { id: 'coadvisor', name: 'Coorientador', inputId: 'coadvisor' }
        ];

        fieldsToMap.forEach(f => {
            const data = extractedData[f.id];
            const currentVal = document.getElementById(f.inputId)?.value || '';
            
            let statusBadge = '';
            let valHtml = '';
            let isChecked = '';
            let sourceHtml = data.source ? `<div class="source-snippet">${data.source}</div>` : '';
            
            if (data && data.val && String(data.val).trim() !== 'null' && String(data.val).trim() !== '') {
                const fetchedVal = String(data.val).trim();
                if (currentVal && currentVal !== fetchedVal && currentVal !== 'Belo Horizonte' && currentVal !== 'Trabalho de Conclusão de Curso') {
                    statusBadge = '<span class="status-badge status-review">Conflito</span>';
                    valHtml = `<span class="diff-old">Atual: ${currentVal}</span><span class="diff-new">Novo: ${fetchedVal}</span>`;
                    isChecked = ''; 
                } else {
                    statusBadge = '<span class="status-badge status-ok">Localizado</span>';
                    valHtml = `<span>${fetchedVal}</span>`;
                    isChecked = 'checked';
                }
                
                html += `
                <tr>
                    <td><input type="checkbox" class="apply-check" data-target="${f.inputId}" data-val="${fetchedVal.replace(/"/g, '&quot;')}" ${isChecked}></td>
                    <td><strong>${f.name}</strong><br>${statusBadge}</td>
                    <td>${valHtml}</td>
                    <td>${sourceHtml}</td>
                </tr>`;
            } else {
                html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>${f.name}</strong><br><span class="status-badge status-notfound">Revisar Ausência</span></td>
                    <td>-</td>
                    <td><div class="source-snippet" style="color:#94a3b8">Não identificado com precisão</div></td>
                </tr>`;
            }
        });

        // Keywords mapping
        const kwData = extractedData.kws;
        if (kwData && kwData.val && Array.isArray(kwData.val) && kwData.val.length > 0) {
            let sourceHtml = kwData.source ? `<div class="source-snippet">${kwData.source}</div>` : '';
            html += `
                <tr>
                    <td><input type="checkbox" class="apply-check-kw" data-kws="${kwData.val.join('|').replace(/"/g, '&quot;')}" checked></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-ok">Localizado</span></td>
                    <td>${kwData.val.join(', ')}</td>
                    <td>${sourceHtml}</td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-notfound">Revisar Ausência</span></td>
                    <td>-</td>
                    <td><div class="source-snippet" style="color:#94a3b8">Não identificado com precisão</div></td>
                </tr>`;
        }

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
        
        resetImportUI();
        reviewModal.style.display = 'flex';
    }

    if(btnCloseModal) btnCloseModal.addEventListener('click', () => reviewModal.style.display = 'none');
    if(btnCancelReview) btnCancelReview.addEventListener('click', () => reviewModal.style.display = 'none');

    if(btnApplyReview) btnApplyReview.addEventListener('click', () => {
        const checks = document.querySelectorAll('.apply-check:checked');
        checks.forEach(check => {
            const targetId = check.getAttribute('data-target');
            const val = check.getAttribute('data-val');
            const input = document.getElementById(targetId);
            if (input) {
                input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        const kwCheck = document.querySelector('.apply-check-kw:checked');
        if (kwCheck) {
            const kws = kwCheck.getAttribute('data-kws').split('|');
            for(let i = 0; i < 5; i++) {
                const kwInput = document.getElementById('kw' + (i+1));
                if (kwInput) {
                    kwInput.value = kws[i] || '';
                    kwInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        }

        reviewModal.style.display = 'none';
        
        const existingAlert = document.getElementById('successAlert');
        if(existingAlert) existingAlert.remove();
        
        const successDiv = document.createElement('div');
        successDiv.id = 'successAlert';
        successDiv.style = "background-color: #dcfce7; border-left: 4px solid #166534; color: #166534; padding: 10px; margin-bottom: 15px; font-size: 0.85rem; border-radius: 4px;";
        successDiv.innerHTML = '<i class="fa-solid fa-check"></i> Dados extraídos aplicados na ficha! Faça os ajustes finos se necessário.';
        
        const fichaForm = document.getElementById('fichaForm');
        if(fichaForm) fichaForm.parentNode.insertBefore(successDiv, fichaForm);
        
        setTimeout(() => { if(successDiv) successDiv.remove(); }, 8000);
    });

});
