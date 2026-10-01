document.addEventListener('DOMContentLoaded', () => {
    // PDF.js Worker setup
    if (window['pdfjs-dist/build/pdf']) {
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
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });
    }

    function handleFile(file) {
        dropzone.style.display = 'none';
        importLoading.style.display = 'block';
        
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
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            
            let fullText = "";
            let maxPagesToRead = Math.min(15, pdf.numPages);
            
            for (let i = 1; i <= maxPagesToRead; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += ` [PAGE ${i}] ` + pageText;
            }

            if (fullText.replace(/\[PAGE \d+\]/g, '').trim().length < 50) {
                alert('O PDF parece não conter texto extraível. Caso seja um documento escaneado como imagem, a extração automática não é suportada (Falta OCR).');
                resetImportUI();
                return;
            }

            processExtractedText(fullText, pdf.numPages);
        } catch (error) {
            console.error('Erro ao ler PDF:', error);
            alert('Falha ao processar o arquivo PDF. Certifique-se de que ele não está corrompido ou protegido por senha.');
            resetImportUI();
        }
    }

    async function extractFromDocx(file) {
        if (typeof mammoth === 'undefined') {
            alert('Biblioteca Mammoth não carregada.');
            resetImportUI();
            return;
        }
        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
            let fullText = result.value;
            processExtractedText(fullText, null);
        } catch (error) {
            console.error('Erro ao ler DOCX:', error);
            alert('Falha ao processar o arquivo DOCX.');
            resetImportUI();
        }
    }

    function processExtractedText(text, totalPages) {
        extractedData = {};
        const cleanText = text.replace(/\s+/g, ' '); 
        
        // 1. Pages
        if (totalPages) {
            extractedData.pages = { val: totalPages.toString(), source: "Metadados do PDF (Desconte pré-textuais)" };
        }

        // 2. Orientador
        let advisorMatch = cleanText.match(/Orientador[a]?:?\s*([^.0-9]*?)(?:Co-?orientador|Aprovado|Belo Horizonte|\d{4}|Trabalho|Dissertação|Tese)/i);
        if (advisorMatch && advisorMatch[1].trim().length > 0) {
            extractedData.advisor = { val: advisorMatch[1].trim().substring(0, 100), source: advisorMatch[0].substring(0, 150) };
        }

        // 3. Coorientador
        let coadvisorMatch = cleanText.match(/Co-?orientador[a]?:?\s*([^.0-9]*?)(?:Aprovado|Belo Horizonte|\d{4}|Trabalho|Dissertação|Tese)/i);
        if (coadvisorMatch && coadvisorMatch[1].trim().length > 0) {
            extractedData.coadvisor = { val: coadvisorMatch[1].trim().substring(0, 100), source: coadvisorMatch[0].substring(0, 150) };
        }

        // 4. Ano
        let yearMatch = cleanText.match(/\b(202[0-9]|201[0-9])\b/);
        if (yearMatch) {
            extractedData.year = { val: yearMatch[1], source: `Encontrado ano ${yearMatch[1]}` };
        }

        // 5. Tipo de Trabalho
        if (cleanText.toLowerCase().includes('dissertação')) {
            extractedData.workType = { val: 'Dissertação', source: 'Detectada a palavra "Dissertação"' };
        } else if (cleanText.toLowerCase().includes('tese')) {
            extractedData.workType = { val: 'Tese', source: 'Detectada a palavra "Tese"' };
        } else if (cleanText.toLowerCase().includes('monografia')) {
            extractedData.workType = { val: 'Monografia', source: 'Detectada a palavra "Monografia"' };
        } else {
            extractedData.workType = { val: 'Trabalho de Conclusão de Curso', source: 'Padrão assumido' };
        }

        // 6. Curso
        let courseMatch = cleanText.match(/(?:Mestrado|Doutorado|Bacharelado|Especialização|Curso)\s+em\s+([^,.-]{5,50})/i);
        if (courseMatch) {
            extractedData.course = { val: courseMatch[1].trim(), source: courseMatch[0] };
        }

        // 7. Palavras-chave
        let kwMatch = cleanText.match(/Palavras[- ]chave:?\s*(.*?)(?:\.|Abstract|Introdução|1\.)/i);
        if (kwMatch) {
            let kwsRaw = kwMatch[1].trim();
            let kws = kwsRaw.split(/[;.,]/).map(k => k.trim()).filter(k => k.length > 2);
            extractedData.kws = { val: kws, source: kwMatch[0].substring(0, 200) };
        }

        // 8. Título Candidato
        let titleMatch = cleanText.match(/(?:Dom Helder|Superior|Universidade|Centro Universitário).*?\[PAGE \d+\]\s*(.*?)(?:Trabalho|Dissertação|Tese)/i);
        if (titleMatch && titleMatch[1].length > 10) {
            let candidate = titleMatch[1].trim().substring(0, 200);
            extractedData.titleCandidate = { val: candidate, source: 'Trecho inicial / Rosto' };
        }

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
                    <th width="40%">Trecho Original</th>
                </tr>
            </thead>
            <tbody>`;

        const fieldsToMap = [
            { id: 'advisor', name: 'Orientador', inputId: 'advisor' },
            { id: 'coadvisor', name: 'Coorientador', inputId: 'coadvisor' },
            { id: 'year', name: 'Ano', inputId: 'year' },
            { id: 'pages', name: 'Nº Folhas Totais', inputId: 'pages' },
            { id: 'workType', name: 'Tipo de Trabalho', inputId: 'workType' },
            { id: 'course', name: 'Curso', inputId: 'course' },
            { id: 'titleCandidate', name: 'Título e Autor (Revisar manualmente)', inputId: 'title' }
        ];

        fieldsToMap.forEach(f => {
            const data = extractedData[f.id];
            const currentVal = document.getElementById(f.inputId)?.value || '';
            
            let statusBadge = '';
            let valHtml = '';
            let isChecked = '';
            
            if (data && data.val) {
                if (currentVal && currentVal !== data.val && currentVal !== 'Belo Horizonte' && currentVal !== 'Trabalho de Conclusão de Curso') {
                    statusBadge = '<span class="status-badge status-review">Conflito</span>';
                    valHtml = `<span class="diff-old">Atual: ${currentVal}</span><span class="diff-new">Novo: ${data.val}</span>`;
                    isChecked = ''; 
                } else {
                    statusBadge = '<span class="status-badge status-ok">Encontrado</span>';
                    valHtml = `<span>${data.val}</span>`;
                    isChecked = 'checked';
                }
                
                html += `
                <tr>
                    <td><input type="checkbox" class="apply-check" data-target="${f.inputId}" data-val="${data.val.replace(/"/g, '&quot;')}" ${isChecked}></td>
                    <td><strong>${f.name}</strong><br>${statusBadge}</td>
                    <td>${valHtml}</td>
                    <td><div class="source-snippet">${data.source}</div></td>
                </tr>`;
            } else {
                html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>${f.name}</strong><br><span class="status-badge status-notfound">Não Encontrado</span></td>
                    <td>-</td>
                    <td><div class="source-snippet">Preencha manualmente</div></td>
                </tr>`;
            }
        });

        if (extractedData.kws && extractedData.kws.val && extractedData.kws.val.length > 0) {
            html += `
                <tr>
                    <td><input type="checkbox" class="apply-check-kw" data-kws="${extractedData.kws.val.join('|').replace(/"/g, '&quot;')}" checked></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-ok">Encontrado</span></td>
                    <td>${extractedData.kws.val.join(', ')}</td>
                    <td><div class="source-snippet">${extractedData.kws.source}</div></td>
                </tr>
            `;
        } else {
            html += `
                <tr>
                    <td><input type="checkbox" disabled></td>
                    <td><strong>Palavras-chave</strong><br><span class="status-badge status-notfound">Não Encontrado</span></td>
                    <td>-</td>
                    <td><div class="source-snippet">Preencha manualmente</div></td>
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
        successDiv.innerHTML = '<i class="fa-solid fa-check"></i> Dados importados! Confira as informações na ficha e complete/revise o que for necessário.';
        
        const fichaForm = document.getElementById('fichaForm');
        if(fichaForm) fichaForm.parentNode.insertBefore(successDiv, fichaForm);
        
        setTimeout(() => { if(successDiv) successDiv.remove(); }, 8000);
    });

});
