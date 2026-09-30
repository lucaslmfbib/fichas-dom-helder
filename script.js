document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const authorName = document.getElementById('authorName');
    const authorSurname = document.getElementById('authorSurname');
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const city = document.getElementById('city');
    const year = document.getElementById('year');
    const pages = document.getElementById('pages');
    const workType = document.getElementById('workType');
    const course = document.getElementById('course');
    const advisor = document.getElementById('advisor');
    const coadvisor = document.getElementById('coadvisor');
    const cutter = document.getElementById('cutter');
    const cdu = document.getElementById('cdu');
    
    const kw1 = document.getElementById('kw1');
    const kw2 = document.getElementById('kw2');
    const kw3 = document.getElementById('kw3');
    const kw4 = document.getElementById('kw4');
    const kw5 = document.getElementById('kw5');

    // Outputs
    const outCutter = document.getElementById('outCutter');
    const outAuthorFull = document.getElementById('outAuthorFull');
    const outTitle = document.getElementById('outTitle');
    const outSubtitle = document.getElementById('outSubtitle');
    const outAuthorNormal = document.getElementById('outAuthorNormal');
    const outYear = document.getElementById('outYear');
    const outPages = document.getElementById('outPages');
    const outAdvisor = document.getElementById('outAdvisor');
    const outCoadvisorBlock = document.getElementById('outCoadvisorBlock');
    const outCoadvisor = document.getElementById('outCoadvisor');
    const outWorkType = document.getElementById('outWorkType');
    const outCourse = document.getElementById('outCourse');
    const outCity = document.getElementById('outCity');
    const outKeywordsBlock = document.getElementById('outKeywordsBlock');
    const outCdu = document.getElementById('outCdu');

    // Mapeamento básico CDU
    const cduMap = {
        "constitucional": "342",
        "penal": "343",
        "civil": "347",
        "trabalho": "349.2",
        "tributario": "343.359",
        "tributário": "343.359",
        "internacional": "341",
        "administrativo": "35",
        "direito": "34",
        "engenharia": "62",
        "computacao": "004",
        "computação": "004",
        "software": "004.4",
        "meio ambiente": "502",
        "ambiental": "502",
        "educacao": "37",
        "educação": "37",
        "filosofia": "1",
        "sociologia": "316",
        "economia": "33"
    };

    let userEditedCutter = false;
    let userEditedCdu = false;

    cutter.addEventListener('input', () => {
        userEditedCutter = (cutter.value.trim() !== '');
    });
    cdu.addEventListener('input', () => {
        userEditedCdu = (cdu.value.trim() !== '');
    });

    function toTitleCase(str) {
        return str.split(' ').map((w, i) => {
            const lowers = ['da', 'de', 'do', 'das', 'dos', 'e'];
            if (lowers.includes(w.toLowerCase()) && i > 0) return w.toLowerCase();
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }).join(' ');
    }

    function formatBibliographicName(name, surname) {
        let n = toTitleCase(name.trim());
        let s = toTitleCase(surname.trim());
        if (!n && !s) return 'Sobrenome, Nome';
        if (!s) return n;
        if (!n) return s;
        return `${s}, ${n}`;
    }

    function getSurname(fullName) {
        if (!fullName) return '';
        
        let cleanName = fullName.replace(/^(Prof\.|Profa\.|Prof\s|Profa\s|Dr\.|Dra\.|Dr\s|Dra\s|Me\.|Ma\.|Me\s|Ma\s|MSc\.|Esp\.)\s*/gi, '').trim();
        cleanName = cleanName.replace(/^(Prof\.|Profa\.|Prof\s|Profa\s|Dr\.|Dra\.|Dr\s|Dra\s|Me\.|Ma\.|Me\s|Ma\s|MSc\.|Esp\.)\s*/gi, '').trim();
        
        const parts = cleanName.split(' ');
        if (parts.length === 1) return toTitleCase(parts[0]);
        
        let last = parts.pop();
        const suffixes = ['junior', 'júnior', 'filho', 'neto', 'sobrinho'];
        if (suffixes.includes(last.toLowerCase()) && parts.length > 0) {
            last = parts.pop() + ' ' + last;
        }
        
        return `${toTitleCase(last)}, ${parts.map(p => toTitleCase(p)).join(' ')}`;
    }

    function generateCutter(surname, title) {
        if(!surname) return '';
        
        // Remove acentos
        const cleanSurname = surname.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        const cleanTitle = (title || 'a').trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        if(!cleanSurname) return '';

        // Ignorar artigos iniciais no título
        let words = cleanTitle.split(' ').filter(w => w.length > 0);
        let firstTitleWord = words[0] || 'a';
        if (['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas'].includes(firstTitleWord) && words.length > 1) {
            firstTitleWord = words[1];
        }
        
        let firstLetter = cleanSurname.charAt(0);
        let titleLetter = firstTitleWord.charAt(0);
        
        // Tabela simplificada de sobrenomes comuns no Brasil
        const commonMap = {
            'SILVA': 586, 'SOUZA': 729, 'COSTA': 837, 'SANTOS': 237, 'OLIVEIRA': 48, 
            'PEREIRA': 436, 'RODRIGUES': 696, 'ALMEIDA': 447, 'NASCIMENTO': 244, 
            'LIMA': 732, 'ARAUJO': 663, 'FERNANDES': 363, 'CARVALHO': 331, 
            'GOMES': 633, 'MARTINS': 386, 'ROCHA': 672, 'RIBEIRO': 484, 
            'ALVES': 474, 'MONTEIRO': 775, 'MENDES': 538, 'BARROS': 277, 
            'FREITAS': 866, 'BARBOSA': 238, 'PINTO': 659, 'MOURA': 929, 
            'CAVALCANTE': 376, 'DIAS': 541, 'CASTRO': 355, 'CAMPOS': 198, 'CARDOSO': 268
        };
        
        let num = null;
        for(let key in commonMap) {
            if(cleanSurname.startsWith(key)) {
                num = commonMap[key];
                break;
            }
        }
        
        // Pseudo-cálculo para sobrenomes que não estão na lista
        if (num === null) {
            let hash = 0;
            for(let i = 1; i < cleanSurname.length && i < 4; i++) {
                hash += cleanSurname.charCodeAt(i) * Math.pow(10, 3-i);
            }
            num = (hash % 899) + 100;
        }
        
        return `${firstLetter}${num}${titleLetter}`;
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
        return "34"; // Default fallback to Law (Direito) for Dom Helder
    }

    function updatePreview() {
        const n = authorName.value || 'Nome';
        const s = authorSurname.value || 'Sobrenome';
        
        outAuthorFull.textContent = formatBibliographicName(n, s);
        outAuthorNormal.textContent = `${n} ${s}`.trim() || 'Nome Sobrenome';
        
        outTitle.textContent = title.value || 'Título do Trabalho';
        
        if (subtitle.value.trim() !== '') {
            outSubtitle.textContent = `: ${subtitle.value}`;
            outSubtitle.style.display = 'inline';
        } else {
            outSubtitle.textContent = '';
            outSubtitle.style.display = 'none';
        }

        outYear.textContent = year.value || 'Ano';
        
        outPages.textContent = pages.value || '00';
        
        outWorkType.textContent = workType.options[workType.selectedIndex]?.text || 'Trabalho de Conclusão de Curso';
        outCourse.textContent = course.value || 'Curso';
        outCity.textContent = city.value || 'Belo Horizonte';
        
        outAdvisor.textContent = advisor.value || 'Nome do Orientador';
        
        if (coadvisor.value.trim() !== '') {
            outCoadvisor.textContent = coadvisor.value;
            outCoadvisorBlock.style.display = 'block';
        } else {
            outCoadvisorBlock.style.display = 'none';
        }

        // Keywords formatting and CDU extraction
        let kwString = '';
        let kwCount = 1;
        const kwValues = [];
        const kws = [kw1, kw2, kw3, kw4, kw5];
        
        kws.forEach(kw => {
            if (kw.value.trim() !== '') {
                kwValues.push(kw.value);
                let val = kw.value.trim();
                val = val.charAt(0).toUpperCase() + val.slice(1);
                kwString += `${kwCount}. ${val}. `;
                kwCount++;
            }
        });
        
        if (kwString === '') {
            kwString = '1. Assunto principal. ';
        }
        
        let romanCount = 1;
        const romans = ['I', 'II', 'III', 'IV', 'V'];
        let romanStr = `${romans[romanCount-1]}. ${getSurname(advisor.value || 'Nome do Orientador')}. `;
        romanCount++;
        
        if (coadvisor.value.trim() !== '') {
            romanStr += `${romans[romanCount-1]}. ${getSurname(coadvisor.value)}. `;
            romanCount++;
        }
        
        romanStr += `${romans[romanCount-1]}. Centro Universitário Dom Helder. ${romans[romanCount]}. Título.`;
        
        if (outKeywordsBlock) {
            outKeywordsBlock.innerHTML = `<span>${kwString.trim()}</span> ${romanStr}`;
        }

        // Autogerar Cutter
        if (!userEditedCutter && authorSurname.value) {
            const genCutter = generateCutter(authorSurname.value, title.value);
            cutter.value = genCutter;
        }

        // Autogerar CDU baseado em palavras-chave ou curso
        if (!userEditedCdu) {
            const searchTerms = [...kwValues];
            if (course.value) searchTerms.push(course.value);
            
            const genCdu = determineCdu(searchTerms);
            cdu.value = genCdu;
        }

        outCutter.textContent = cutter.value || '';
        outCdu.textContent = cdu.value || '';
        
        outCutter.textContent = cutter.value || '';
        outCdu.textContent = cdu.value || '';
    }

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
                    body {
                        font-family: 'Times New Roman', Times, serif;
                    }
                    .ficha-box {
                        width: 12.5cm;
                        height: 7.5cm;
                        border: 1px solid black;
                        padding: 0.8cm 1cm 0.5cm 1cm;
                        font-size: 12pt;
                        line-height: 1;
                    }
                    .ficha-cutter {
                        float: left;
                        width: 1.5cm;
                        margin-top: 1.2em;
                    }
                    .ficha-body {
                        margin-left: 1.5cm;
                        text-align: justify;
                    }
                    .ficha-author {
                        margin-bottom: 0.3cm;
                    }
                    .indent {
                        margin-left: 1.5cm;
                        text-indent: -1.5cm;
                        margin-bottom: 0.15cm;
                    }
                    .indent-normal {
                        margin-left: 1.5cm;
                        margin-bottom: 0.15cm;
                    }
                    .ficha-footer {
                        text-align: right;
                        margin-top: 1cm;
                    }
                    .librarian-info {
                        text-align: center;
                        font-size: 9pt;
                        margin-top: 1cm;
                    }
                </style>
            </head>
            <body>
                <div class="ficha-box">
                    <div class="ficha-cutter">
                        ${outCutter.textContent}
                    </div>
                    <div class="ficha-body">
                        <div class="ficha-author">${outAuthorFull.textContent}</div>
                        
                        <div class="indent">
                            ${outTitle.textContent}${outSubtitle.textContent} / ${outAuthorNormal.textContent}. – ${outCity.textContent} : Centro Universitário Dom Helder, ${outYear.textContent}.
                        </div>
                        
                        <div class="indent-normal">
                            ${outPages.textContent} f. : il.
                        </div>
                        
                        <div class="indent-normal">
                            Orientador(a): ${outAdvisor.textContent}.
                        </div>
                        ${outCoadvisorBlock.style.display !== 'none' ? `
                        <div class="indent-normal">
                            Coorientador(a): ${outCoadvisor.textContent}.
                        </div>` : ''}
                        
                        <div class="indent-normal">
                            ${outWorkType.textContent} em ${outCourse.textContent}.
                        </div>
                        
                        <div class="indent-normal" style="margin-top: 0.2cm;">
                            ${outKeywordsBlock ? outKeywordsBlock.innerHTML : ''}
                        </div>
                    </div>
                    
                    <div class="ficha-footer">
                        CDU: ${outCdu.textContent}
                    </div>
                </div>
                <div class="librarian-info">
                    Bibliotecário Responsável: Lucas Martins de Freitas Junior - CRB 6-3621
                </div>
            </body>
            </html>
            `;

            const blob = new Blob(['\ufeff', content], {
                type: 'application/msword'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Ficha_Catalografica.doc';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Copiar para Área de Transferência
    const btnCopy = document.getElementById('btnCopy');
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const fichaBox = document.getElementById('fichaBox');
            if (!fichaBox) return;
            
            try {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(fichaBox);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                selection.removeAllRanges();
                
                const originalHTML = btnCopy.innerHTML;
                btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
                setTimeout(() => {
                    btnCopy.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar', err);
                alert('Não foi possível copiar automaticamente. Selecione a ficha e copie manualmente (Ctrl+C).');
            }
        });
    }

    // Attach event listeners
    const formElements = document.querySelectorAll('#fichaForm input, #fichaForm select');
    formElements.forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    // Initialize preview
    updatePreview();
});
