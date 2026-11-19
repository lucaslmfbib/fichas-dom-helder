# Gerador de Ficha Catalográfica (Dom Helder)

Site do Sistema Integrado de Bibliotecas do Centro Universitário Dom Helder que gera fichas catalográficas a partir do arquivo do trabalho (PDF ou Word). O texto é extraído no navegador, uma função serverless usa o Gemini para identificar os dados bibliográficos e o site monta a ficha com a notação Cutter-Sanborn.

## Estrutura
- `index.html`, `style.css`, `script.js`: interface e fluxo principal (upload, formulário, pré-visualização e exportação da ficha). Bibliotecas por CDN: PDF.js, Mammoth (Word) e html2canvas.
- `extractor.js`: extração de texto dos arquivos no navegador.
- `cutter.js`: tabela Cutter-Sanborn de 3 algarismos e cálculo da notação de autor.
- `api/extract.js`: função serverless da Vercel (`POST /api/extract`) que envia o texto ao Gemini (`gemini-2.5-flash`) e devolve os dados extraídos. Prompts diferentes por tipo de material (`materialType`, ex.: `academic`).
- `make_colab.py`: gera `gerador_ficha.ipynb` juntando `index.html`, `style.css` e `script.js` num notebook para o Colab. Rodar de novo depois de mudar esses arquivos.
- `test.html`: página de teste avulsa.

## Como rodar
- Interface: `python3 -m http.server 8080` e abrir http://localhost:8080 (sem a rota `/api/extract`).
- Completo, com a função: `npx vercel dev`, com `GEMINI_API_KEY` definida.
- Deploy: Vercel, com `GEMINI_API_KEY` nas variáveis de ambiente do projeto.

## Convenções
- A chave do Gemini só existe no servidor (Vercel). Nunca colocar no front-end nem commitar.
- O CSS é versionado na URL (`style.css?v=N`); aumentar o número ao mudar o CSS para evitar cache.
- Mudanças no formato da ficha devem respeitar as regras de catalogação usadas pela biblioteca; conferir com a equipe antes.
- Não há testes automatizados.
