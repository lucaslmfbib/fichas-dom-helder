document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos do DOM
    const form = document.getElementById('fichaForm');
    
    // Tipo de Material
    const radioMaterialTypes = document.getElementsByName('materialType');
    const lblAcademic = document.getElementById('lblAcademic');
    const lblBook = document.getElementById('lblBook');

    // Seções
    const fsAuthorAcademic = document.getElementById('fsAuthorAcademic');
    const fsAuthorBook = document.getElementById('fsAuthorBook');
    const fsAcademicData = document.getElementById('fsAcademicData');
    const fsBookData = document.getElementById('fsBookData');
    
    // Campos Acadêmicos
    const authorName = document.getElementById('authorName');
    const authorSurname = document.getElementById('authorSurname');
    const pagesAcademic = document.getElementById('pagesAcademic');
    const workType = document.getElementById('workType');
    const course = document.getElementById('course');
    const advisor = document.getElementById('advisor');
    const coadvisor = document.getElementById('coadvisor');

    // Campos Livro
    const bookAuthorsContainer = document.getElementById('bookAuthorsContainer');
    const btnAddBookAuthor = document.getElementById('btnAddBookAuthor');
    const bookRespContainer = document.getElementById('bookRespContainer');
    const btnAddBookResp = document.getElementById('btnAddBookResp');
    
    const bookEdition = document.getElementById('bookEdition');
    const bookPublisher = document.getElementById('bookPublisher');
    const bookPages = document.getElementById('bookPages');
    const bookPhysical = document.getElementById('bookPhysical');
    const bookDimensions = document.getElementById('bookDimensions');
    const bookSeries = document.getElementById('bookSeries');
    const bookSupport = document.getElementById('bookSupport');
    
    const bookIsbnContainer = document.getElementById('bookIsbnContainer');
    const btnAddIsbn = document.getElementById('btnAddIsbn');
    const bookNotes = document.getElementById('bookNotes');

    // Campos Comuns
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const city = document.getElementById('city');
    const year = document.getElementById('year');
    
    // Classificação
    const mainEntry = document.getElementById('mainEntry');
    const cutter = document.getElementById('cutter');
    const cdu = document.getElementById('cdu');
    const cdd = document.getElementById('cdd');
    const cddGroup = document.getElementById('cddGroup');
    
    const kws = [
        document.getElementById('kw1'),
        document.getElementById('kw2'),
        document.getElementById('kw3'),
        document.getElementById('kw4'),
        document.getElementById('kw5')
    ];

    // Saída Ficha
    const fichaBody = document.querySelector('.ficha-body');
    const outCutter = document.getElementById('outCutter');
    const outCdu = document.getElementById('outCdu');

    let userEditedCutter = false;
    let userEditedCdu = false;
    let currentCutterBase = '';

    // 2. Mapas Auxiliares (CDU Simples para Dom Helder)
    const cduMap = {
        'constitucional': '342.4', 'penal': '343', 'civil': '347', 
        'trabalho': '349.2', 'tributario': '34:336.2', 'internacional': '341', 
        'filosofia': '1', 'sociologia': '316', 'historia': '94', 
        'ambiental': '34:502', 'humanos': '342.7', 'digital': '34:004', 
        'processo': '347.9', 'familia': '347.6'
    };

    // 3. Funções de Layout e Interação
    function toggleMaterialType() {
        const type = document.querySelector('input[name="materialType"]:checked').value;
        if (type === 'academic') {
            lblAcademic.style.borderColor = 'var(--primary)';
            lblAcademic.style.backgroundColor = '#f0fdf4';
            lblBook.style.borderColor = '#e2e8f0';
            lblBook.style.backgroundColor = 'transparent';
            lblBook.querySelector('span').style.color = '#64748b';
            lblBook.querySelector('i').style.color = '#64748b';
            
            fsAuthorAcademic.style.display = 'block';
            fsAcademicData.style.display = 'block';
            fsAuthorBook.style.display = 'none';
            fsBookData.style.display = 'none';
            cddGroup.style.display = 'none';
            
            mainEntry.value = 'author';
        } else {
            lblBook.style.borderColor = 'var(--primary)';
            lblBook.style.backgroundColor = '#f0fdf4';
            lblBook.querySelector('span').style.color = '#0f172a';
            lblBook.querySelector('i').style.color = 'var(--primary)';
            lblAcademic.style.borderColor = '#e2e8f0';
            lblAcademic.style.backgroundColor = 'transparent';
            
            fsAuthorAcademic.style.display = 'none';
            fsAcademicData.style.display = 'none';
            fsAuthorBook.style.display = 'block';
            fsBookData.style.display = 'block';
            cddGroup.style.display = 'block';
            
            if(bookAuthorsContainer.children.length === 0) {
                addBookAuthor();
            }
        }
        updatePreview();
    }

    radioMaterialTypes.forEach(r => r.addEventListener('change', toggleMaterialType));

    // Dynamic Lists (Books)
    function createRemoveBtn(row) {
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btn.className = 'btn-secondary btn-small';
        btn.style.color = '#ef4444';
        btn.style.marginTop = '28px';
        btn.onclick = () => { row.remove(); updatePreview(); };
        return btn;
    }

    function addBookAuthor(name='', surname='') {
        const row = document.createElement('div');
        row.className = 'form-row author-row';
        row.innerHTML = `
            <div class="form-group"><label>Nome</label><input type="text" class="bk-author-name" placeholder="Ex: João Batista" value="${name}"></div>
            <div class="form-group"><label>Último Sobrenome</label><input type="text" class="bk-author-surname" placeholder="Ex: da Silva" value="${surname}"></div>
        `;
        if(bookAuthorsContainer.children.length > 0) row.appendChild(createRemoveBtn(row));
        row.querySelectorAll('input').forEach(i => i.addEventListener('input', updatePreview));
        bookAuthorsContainer.appendChild(row);
        updatePreview();
    }

    function addBookResp() {
        const row = document.createElement('div');
        row.className = 'form-row resp-row';
        row.innerHTML = `
            <div class="form-group"><label>Função</label><select class="bk-resp-role">
                <option value="organizador">Organizador(a)</option>
                <option value="coordenador">Coordenador(a)</option>
                <option value="editor">Editor(a) Intelectual</option>
                <option value="tradutor">Tradutor(a)</option>
                <option value="ilustrador">Ilustrador(a)</option>
            </select></div>
            <div class="form-group"><label>Nome Completo (na ordem direta)</label><input type="text" class="bk-resp-name" placeholder="Ex: Ana Maria Machado"></div>
        `;
        row.appendChild(createRemoveBtn(row));
        row.querySelectorAll('input, select').forEach(i => i.addEventListener('input', updatePreview));
        bookRespContainer.appendChild(row);
        updatePreview();
    }

    function addBookIsbn() {
        const row = document.createElement('div');
        row.className = 'form-row isbn-row';
        row.innerHTML = `
            <div class="form-group"><label>ISBN</label><input type="text" class="bk-isbn-val" placeholder="Ex: 978-85-xxx"></div>
            <div class="form-group"><label>Formato (Opcional)</label><input type="text" class="bk-isbn-fmt" placeholder="Ex: e-book, impresso"></div>
        `;
        row.appendChild(createRemoveBtn(row));
        row.querySelectorAll('input').forEach(i => i.addEventListener('input', updatePreview));
        bookIsbnContainer.appendChild(row);
        updatePreview();
    }

    btnAddBookAuthor.addEventListener('click', () => addBookAuthor());
    btnAddBookResp.addEventListener('click', () => addBookResp());
    btnAddIsbn.addEventListener('click', () => addBookIsbn());

    // 4. Utilitários de String
    function toTitleCase(str) {
        if(!str) return '';
        return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }

    function getSurname(fullName) {
        if (!fullName) return '';
        const parts = fullName.trim().split(' ');
        let last = parts.pop();
        if (['junior', 'júnior', 'filho', 'neto', 'sobrinho'].includes(last.toLowerCase()) && parts.length > 0) {
            last = parts.pop() + ' ' + last;
        }
        return last;
    }

    function determineCdu(kws) {
        for (let kw of kws) {
            const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
            for (let key in cduMap) {
                if (cleanKw.includes(key)) {
                    return cduMap[key];
                }
            }
        }
        return "34";
    }

    // 5. Motor Principal de Renderização e Cutter
    function getFormValues() {
        const type = document.querySelector('input[name="materialType"]:checked').value;
        const vals = {
            type,
            title: title.value.trim() || 'Título',
            subtitle: subtitle.value.trim(),
            city: city.value.trim() || 'Local',
            year: year.value.trim() || 'Ano',
            kws: kws.map(k => k.value.trim()).filter(k => k !== '')
        };

        if (type === 'academic') {
            vals.authorName = authorName.value.trim() || 'Nome';
            vals.authorSurname = authorSurname.value.trim() || 'Sobrenome';
            vals.pages = pagesAcademic.value.trim() || '00';
            vals.workType = workType.options[workType.selectedIndex]?.text || '';
            vals.course = course.value.trim() || 'Curso';
            vals.advisor = advisor.value.trim() || 'Nome do Orientador';
            vals.coadvisor = coadvisor.value.trim();
        } else {
            vals.authors = Array.from(document.querySelectorAll('.author-row')).map(r => ({
                name: r.querySelector('.bk-author-name').value.trim(),
                surname: r.querySelector('.bk-author-surname').value.trim()
            })).filter(a => a.name || a.surname);
            
            vals.resps = Array.from(document.querySelectorAll('.resp-row')).map(r => ({
                role: r.querySelector('.bk-resp-role').value,
                name: r.querySelector('.bk-resp-name').value.trim()
            })).filter(r => r.name);
            
            vals.edition = bookEdition.value.trim();
            vals.publisher = bookPublisher.value.trim() || 'Editora';
            vals.pages = bookPages.value.trim() || '200 p.';
            vals.physical = bookPhysical.value.trim();
            vals.dimensions = bookDimensions.value.trim();
            vals.series = bookSeries.value.trim();
            
            vals.isbns = Array.from(document.querySelectorAll('.isbn-row')).map(r => ({
                val: r.querySelector('.bk-isbn-val').value.trim(),
                fmt: r.querySelector('.bk-isbn-fmt').value.trim()
            })).filter(i => i.val);
            
            vals.notes = bookNotes.value.trim();
        }
        return vals;
    }

    function updateCutterLogic(vals) {
        // Decide a entrada principal se o bibliotecário não forçou
        let recommendedEntry = 'author';
        let baseText = '';

        if (vals.type === 'academic') {
            recommendedEntry = 'author';
            baseText = (vals.authorSurname !== 'Sobrenome' && vals.authorSurname !== '') ? vals.authorSurname : '';
        } else {
            if (vals.authors.length === 0 && vals.resps.length > 0) {
                // Obra sem autor, mas com organizadores/coordenadores -> Entrada por Título
                recommendedEntry = 'title';
                baseText = vals.title;
            } else {
                recommendedEntry = 'author';
                if (vals.authors.length > 0 && vals.authors[0].surname !== '') {
                    baseText = vals.authors[0].surname;
                }
            }
        }

        // Atualiza o select de Entrada Principal
        if (mainEntry.value !== recommendedEntry && !userEditedCutter) {
            mainEntry.value = recommendedEntry;
        }

        // Calcula Cutter real
        let selectedEntry = mainEntry.value;
        let cText = selectedEntry === 'author' ? baseText : vals.title;
        
        let genCutter = '';
        if (window.calculateCutter && cText && cText !== 'Título') {
            genCutter = window.calculateCutter(cText, selectedEntry, vals.title);
        }

        if (genCutter && genCutter !== currentCutterBase) {
            if (userEditedCutter) {
                if (confirm(`A autoria ou o título mudaram. Deseja atualizar o código Cutter manualmente editado para a nova sugestão (${genCutter})?`)) {
                    cutter.value = genCutter;
                    userEditedCutter = false;
                }
            } else {
                cutter.value = genCutter;
            }
            currentCutterBase = genCutter;
        }
        
        outCutter.textContent = cutter.value || '';
    }

    function buildAcademicFicha(vals) {
        let html = '';
        
        // Autor Cabeçalho
        const authorHeading = `${toTitleCase(vals.authorSurname)}, ${toTitleCase(vals.authorName)}`;
        html += `<p class="ficha-author" style="margin-bottom:0.3cm; font-weight:bold;">${authorHeading}</p>`;
        
        // Título e Publicação
        const subtitleStr = vals.subtitle ? `: ${vals.subtitle}` : '';
        const authorNormal = `${vals.authorName} ${vals.authorSurname}`.trim();
        html += `<p class="ficha-title-block indent">` +
                `<span>${vals.title}</span><span>${subtitleStr}</span> / <span>${authorNormal}</span>. – ` +
                `<span>${vals.city}</span> : Centro Universitário Dom Helder, <span>${vals.year}</span>.</p>`;
        
        // Paginação
        html += `<p class="ficha-pages indent">${vals.pages} f. : il.</p>`;
        
        // Notas
        html += `<p class="ficha-advisor indent">Orientador(a): ${vals.advisor}.</p>`;
        if (vals.coadvisor) {
            html += `<p class="ficha-coadvisor indent">Coorientador(a): ${vals.coadvisor}.</p>`;
        }
        html += `<p class="ficha-worktype indent">${vals.workType} em ${vals.course}.</p>`;
        
        // Assuntos e Trilha
        let kwStr = vals.kws.map((k, i) => `${i+1}. ${k.charAt(0).toUpperCase() + k.slice(1)}.`).join(' ');
        if (!kwStr) kwStr = '1. Assunto principal.';
        
        const romans = ['I', 'II', 'III', 'IV', 'V'];
        let romanCount = 0;
        let trilha = `${romans[romanCount++]}. ${getSurname(vals.advisor)}. `;
        if (vals.coadvisor) trilha += `${romans[romanCount++]}. ${getSurname(vals.coadvisor)}. `;
        trilha += `${romans[romanCount++]}. Centro Universitário Dom Helder. ${romans[romanCount]}. Título.`;
        
        html += `<p class="ficha-keywords indent" style="margin-top:0.2cm;"><span>${kwStr}</span> ${trilha}</p>`;
        
        return html;
    }

    function buildBookFicha(vals) {
        let html = '';
        
        // Entrada Principal (Cabeçalho)
        if (mainEntry.value === 'author' && vals.authors.length > 0) {
            const primary = vals.authors[0];
            const authorHeading = `${toTitleCase(primary.surname)}, ${toTitleCase(primary.name)}`;
            html += `<p class="ficha-author" style="margin-bottom:0.3cm; font-weight:bold;">${authorHeading}</p>`;
        }

        // Título e Autoria (Bloco Principal)
        const subtitleStr = vals.subtitle ? ` : ${vals.subtitle}` : '';
        let authBlock = [];
        
        if (vals.authors.length > 0) {
            let aStr = vals.authors.map(a => `${a.name} ${a.surname}`.trim()).join(', ');
            authBlock.push(aStr);
        }
        if (vals.resps.length > 0) {
            // Agrupar por função
            let orgs = vals.resps.filter(r => r.role === 'organizador').map(r => r.name).join(', ');
            if (orgs) authBlock.push(`${orgs} (org.)`);
            
            let coords = vals.resps.filter(r => r.role === 'coordenador').map(r => r.name).join(', ');
            if (coords) authBlock.push(`${coords} (coord.)`);
            
            let trads = vals.resps.filter(r => r.role === 'tradutor').map(r => r.name).join(', ');
            if (trads) authBlock.push(`tradução de ${trads}`);
            
            let ilus = vals.resps.filter(r => r.role === 'ilustrador').map(r => r.name).join(', ');
            if (ilus) authBlock.push(`ilustração de ${ilus}`);
            
            let eds = vals.resps.filter(r => r.role === 'editor').map(r => r.name).join(', ');
            if (eds) authBlock.push(`edição de ${eds}`);
        }
        
        let slashBlock = authBlock.length > 0 ? ` / ${authBlock.join(' ; ')}` : '';
        
        let titleBlock = `<span>${vals.title}</span><span>${subtitleStr}</span>${slashBlock}.`;
        
        if (vals.edition) {
            titleBlock += ` – <span>${vals.edition}</span>.`;
        }
        titleBlock += ` – <span>${vals.city}</span> : <span>${vals.publisher}</span>, <span>${vals.year}</span>.`;
        
        html += `<p class="ficha-title-block indent">${titleBlock}</p>`;
        
        // Descrição Física
        let phys = vals.pages;
        if (vals.physical) phys += ` : ${vals.physical}`;
        if (vals.dimensions) phys += ` ; ${vals.dimensions}.`;
        else phys += `.`;
        
        html += `<p class="ficha-pages indent">${phys}</p>`;
        
        // Série
        if (vals.series) {
            html += `<p class="ficha-series indent">${vals.series}</p>`;
        }
        
        // Notas
        if (vals.notes) {
            html += `<p class="ficha-notes indent">${vals.notes}</p>`;
        }
        
        // ISBNs
        vals.isbns.forEach(i => {
            let str = `ISBN ${i.val}`;
            if (i.fmt) str += ` (${i.fmt})`;
            html += `<p class="ficha-isbn indent">${str}</p>`;
        });
        
        // Assuntos e Trilha
        let kwStr = vals.kws.map((k, i) => `${i+1}. ${k.charAt(0).toUpperCase() + k.slice(1)}.`).join(' ');
        if (!kwStr) kwStr = '1. Assunto principal.';
        
        const romans = ['I', 'II', 'III', 'IV', 'V'];
        let romanCount = 0;
        let trilha = '';
        
        // Entradas adicionais (outros autores/orgs)
        if (vals.authors.length > 1) {
            for(let i=1; i<vals.authors.length; i++) {
                trilha += `${romans[romanCount++]}. ${getSurname(vals.authors[i].surname)}. `;
            }
        }
        vals.resps.forEach(r => {
            trilha += `${romans[romanCount++]}. ${getSurname(r.name)}. `;
        });
        
        if (mainEntry.value === 'author') {
            trilha += `${romans[romanCount]}. Título.`;
        }
        
        html += `<p class="ficha-keywords indent" style="margin-top:0.2cm;"><span>${kwStr}</span> ${trilha.trim()}</p>`;
        
        return html;
    }

    function updatePreview() {
        const vals = getFormValues();

        updateCutterLogic(vals);

        if (!userEditedCdu) {
            const searchTerms = [...vals.kws];
            if (vals.course) searchTerms.push(vals.course);
            cdu.value = determineCdu(searchTerms);
        }
        outCdu.textContent = cdu.value || '';

        // Se tiver CDD digitado, colocar ao lado
        let cddStr = '';
        if (vals.type === 'book' && cdd.value.trim() !== '') {
            cddStr = ` &nbsp;|&nbsp; CDD: ${cdd.value.trim()}`;
        }
        outCdu.innerHTML = (cdu.value || '') + cddStr;

        // Renderizar corpo
        if (vals.type === 'academic') {
            fichaBody.innerHTML = buildAcademicFicha(vals);
        } else {
            fichaBody.innerHTML = buildBookFicha(vals);
        }

        // Overflow check
        setTimeout(() => {
            const fBox = document.getElementById('fichaBox');
            const alertBox = document.getElementById('overflowAlert');
            if (fBox && alertBox) {
                if (fBox.scrollHeight > fBox.clientHeight) {
                    alertBox.style.display = 'block';
                } else {
                    alertBox.style.display = 'none';
                }
            }
        }, 100);
    }

    // Event Listeners base
    form.addEventListener('input', updatePreview);
    mainEntry.addEventListener('change', () => { userEditedCutter = false; updatePreview(); });
    
    cutter.addEventListener('input', () => { userEditedCutter = (cutter.value.trim() !== ''); });
    cdu.addEventListener('input', () => { userEditedCdu = (cdu.value.trim() !== ''); });

    // Gerar Word
    const btnWord = document.getElementById('btnWord');
    if (btnWord) {
        btnWord.addEventListener('click', () => {
            const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Ficha Catalográfica</title>
                <style>
                    body { font-family: 'Times New Roman', Times, serif; }
                    .ficha-table {
                        width: 12.5cm;
                        height: 7.5cm;
                        border: 1px solid black;
                        border-collapse: collapse;
                        font-size: 12pt;
                    }
                    .ficha-table td {
                        padding: 0.5cm 0.8cm;
                        vertical-align: top;
                    }
                    .col-cutter {
                        width: 1.5cm;
                        padding-right: 0;
                    }
                    .col-body {
                        text-align: left;
                    }
                    .indent {
                        text-indent: 1.5cm;
                        margin: 0;
                        margin-bottom: 0.15cm;
                    }
                    .footer-table {
                        width: 100%;
                        margin-top: 0.5cm;
                        font-size: 9pt;
                    }
                </style>
            </head>
            <body>
                <div style="text-align: center; width: 12.5cm; font-size: 10pt; font-weight: bold; margin-bottom: 0.2cm;">
                    Dados Internacionais de Catalogação na Publicação (CIP)
                </div>
                <table class="ficha-table">
                    <tr>
                        <td class="col-cutter">
                            <div style="margin-top: 1em;">${outCutter.textContent}</div>
                        </td>
                        <td class="col-body">
                            ${fichaBody.innerHTML}
                            <table class="footer-table">
                                <tr>
                                    <td>Bibliotecário: Lucas Martins de Freitas Junior - CRB 6-3621</td>
                                    <td style="text-align: right; white-space: nowrap;">CDU: ${outCdu.textContent}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>`;
            
            const blob = new Blob(['\ufeff', content], {type: 'application/msword'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Ficha_Catalografica.doc';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    // Gerar PNG
    const btnPng = document.getElementById('btnPng');
    if (btnPng) {
        btnPng.addEventListener('click', () => {
            const target = document.getElementById('fichaBox');
            html2canvas(target, { scale: 2 }).then(canvas => {
                const a = document.createElement('a');
                a.href = canvas.toDataURL("image/png");
                a.download = "Ficha_Catalografica.png";
                a.click();
            });
        });
    }

    // Copiar Texto
    const btnCopy = document.getElementById('btnCopy');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            let text = "Dados Internacionais de Catalogação na Publicação (CIP)\n\n";
            text += outCutter.textContent + "\n";
            
            // Transformar parágrafos em texto limpo com indentação onde tem .indent
            const ps = fichaBody.querySelectorAll('p');
            ps.forEach(p => {
                if(p.classList.contains('indent')) {
                    text += "      " + p.textContent + "\n";
                } else {
                    text += p.textContent + "\n";
                }
            });

            text += "\nBibliotecário: Lucas Martins de Freitas Junior - CRB 6-3621\n";
            text += "CDU: " + outCdu.textContent;

            navigator.clipboard.writeText(text).then(() => {
                const originalText = btnCopy.innerHTML;
                btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
                setTimeout(() => { btnCopy.innerHTML = originalText; }, 2000);
            });
        });
    }

    // Init
    toggleMaterialType();
});
