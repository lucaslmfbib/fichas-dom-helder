document.addEventListener('DOMContentLoaded', () => {
    // PDF.js worker setup - lidando com a possível ausência global
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
        importLoading.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Lendo arquivo...';
        
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
            alert('A biblioteca de leitura de PDF não foi carregada corretamente. Verifique sua conexão com a internet.');
            resetImportUI();
            return;
        }

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            
            let fullText = "";
            let maxPagesToRead = Math.min(15, pdf.numPages); // Ler no máximo 15 páginas para não sobrecarregar
            
            for (let i = 1; i <= maxPagesToRead; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + "\n";
            }

            if (fullText.replace(/\s/g, '').length < 50) {
                alert('O PDF selecionado parece não conter texto extraível. Se for um documento digitalizado, a extração automática falhará porque exige um PDF com texto selecionável (sem OCR ativo nativamente).');
                resetImportUI();
                return;
            }

            sendToAPI(fullText, pdf.numPages);
        } catch (error) {
            console.error('Erro ao ler PDF:', error);
            alert('Falha ao processar a leitura do arquivo PDF. Ele pode estar corrompido ou protegido por senha.');
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
            alert('Falha ao processar a leitura do arquivo DOCX.');
            resetImportUI();
        }
    }

    async function sendToAPI(text, totalPages) {
        importLoading.innerHTML = '<i class="fa-solid fa-microchip fa-fade"></i> Extraindo dados...';
        
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
            alert('Erro de conexão com o servidor de Inteligência. Se você está testando localmente, garanta que a rota /api/extract está sendo servida (ex: Vercel Dev).');
            resetImportUI();
        }
    }

    function processExtractedData(data) {
        // Mapeia o JSON para a estrutura interna
        extractedData = {
            authorName: { val: data.autor_nome },
            authorSurname: { val: data.autor_sobrenome },
            title: { val: data.titulo },
            subtitle: { val: data.subtitulo },
            city: { val: data.cidade },
            year: { val: data.ano },
            pages: { val: data.paginas },
            workType: { val: data.tipo_trabalho },
            course: { val: data.curso },
            advisor: { val: data.orientador },
            coadvisor: { val: data.coorientador },
            kws: { val: data.palavras_chave }
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
                    <th width="25%">Campo</th>
                    <th width="70%">Valor Encontrado</th>
                </tr>
            </thead>
            <tbody>`;

        const fieldsToMap = [
            { id: 'authorName', name: 'Nome do Autor', inputId: 'authorName' },
            { id: 'authorSurname', name: 'Último Nome', inputId: 'authorSurname' },
            { id: 'title', name: 'Título do Trabalho', inputId: 'title' },
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
            
            if (data && data.val && String(data.val).trim() !== 'null' && String(data.val).trim() !== '') {
                const fetchedVal = String(data.val).trim();
                if (currentVal && currentVal !== fetchedVal && currentVal !== 'Belo Horizonte' && currentVal !== 'Trabalho de Conclusão de Curso') {
                    statusBadge = '<span class="status-badge status-review">Conflito</span>';
                    valHtml = `<span class="diff-old">Atual: ${currentVal}</span><span class="diff-new">Novo: ${fetchedVal}</span>`;
                    isChecked = ''; 
                } else {
                    statusBadge = '<span class="status-badge status-ok">Encontrado</span>';
                    valHtml = `<span>${fetchedVal}</span>`;
                    isChecked = 'checked';
                }
                
                html += `
                <tr>
                    <td><input type="checkbox" class="apply-check" data-target="${f.inputId}" data-val="${fetchedVal.replace(/"/g, '&quot;')}" ${isChecked}></td>
                    <td><strong>${f.name}</strong><br>${statusBadge}</td>
                    <td>${valHtml}</td>
                </tr>`;
            } else {
                html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>${f.name}</strong><br><span class="status-badge status-notfound">Revisar (Vazio)</span></td>
                    <td>-</td>
                </tr>`;
            }
        });

        // Keywords mapping
        if (extractedData.kws && Array.isArray(extractedData.kws.val) && extractedData.kws.val.length > 0) {
            html += `
                <tr>
                    <td><input type="checkbox" class="apply-check-kw" data-kws="${extractedData.kws.val.join('|').replace(/"/g, '&quot;')}" checked></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-ok">Encontrado</span></td>
                    <td>${extractedData.kws.val.join(', ')}</td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-notfound">Revisar (Vazio)</span></td>
                    <td>-</td>
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
        successDiv.innerHTML = '<i class="fa-solid fa-check"></i> Dados aplicados com sucesso! Revise o resultado na ficha.';
        
        const fichaForm = document.getElementById('fichaForm');
        if(fichaForm) fichaForm.parentNode.insertBefore(successDiv, fichaForm);
        
        setTimeout(() => { if(successDiv) successDiv.remove(); }, 8000);
    });

});
