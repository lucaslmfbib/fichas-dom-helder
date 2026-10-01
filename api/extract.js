export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, totalPages, materialType } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Nenhum texto fornecido para análise.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Configuração ausente', 
            details: 'A chave de API (GEMINI_API_KEY) não está configurada no Vercel.' 
        });
    }

    try {
        let prompt = '';
        
        if (materialType === 'academic') {
            prompt = `Analise o texto extraído de um trabalho acadêmico (contendo capa, folha de rosto, etc).
Sua tarefa é extrair os dados bibliográficos de forma precisa e lidar com divergências.

Retorne APENAS um JSON válido. Para cada campo, você deve retornar um objeto: { "val": "valor", "source": "trecho exato" }

Regras específicas:
- autor_nome: Nome completo do autor, EXCLUINDO o último sobrenome. 
- autor_sobrenome: Apenas o ÚLTIMO sobrenome.
- titulo: Título principal.
- subtitulo: Identifique o subtítulo se houver.
- palavras_chave: Array de strings no 'val', string original no 'source'.
- paginas: Número total de páginas (ou use ${totalPages || 'null'}).

Estrutura JSON:
{
  "autor_nome": { "val": "", "source": "" },
  "autor_sobrenome": { "val": "", "source": "" },
  "titulo": { "val": "", "source": "" },
  "subtitulo": { "val": null, "source": "" },
  "instituicao": { "val": "", "source": "" },
  "curso": { "val": "", "source": "" },
  "tipo_trabalho": { "val": "", "source": "" },
  "orientador": { "val": "", "source": "" },
  "coorientador": { "val": null, "source": "" },
  "cidade": { "val": "", "source": "" },
  "ano": { "val": "", "source": "" },
  "palavras_chave": { "val": [], "source": "" },
  "paginas": { "val": "", "source": "" }
}`;
        } else {
            prompt = `Analise o texto extraído de um Livro (contendo folha de rosto, ficha catalográfica original ou colofão).
Sua tarefa é extrair os dados bibliográficos de forma precisa.

Retorne APENAS um JSON válido. Para cada campo, você deve retornar um objeto: { "val": "valor", "source": "trecho exato" }

Regras específicas:
- autor_nome: Nome completo do autor principal, EXCLUINDO o último sobrenome. (se não houver autor, null)
- autor_sobrenome: Apenas o ÚLTIMO sobrenome do autor principal.
- titulo: Título principal.
- subtitulo: Subtítulo, se houver.
- editora: Nome da editora.
- edicao: Informação sobre a edição (ex: 2. ed.).
- cidade: Local de publicação.
- ano: Ano de publicação.
- isbn: Código ISBN.
- palavras_chave: Array de strings no 'val'.

Estrutura JSON:
{
  "autor_nome": { "val": null, "source": "" },
  "autor_sobrenome": { "val": null, "source": "" },
  "titulo": { "val": "", "source": "" },
  "subtitulo": { "val": null, "source": "" },
  "editora": { "val": "", "source": "" },
  "edicao": { "val": null, "source": "" },
  "cidade": { "val": "", "source": "" },
  "ano": { "val": "", "source": "" },
  "isbn": { "val": null, "source": "" },
  "palavras_chave": { "val": [], "source": "" }
}`;
        }

        prompt += `\n\nNão preencha se não encontrar. Use null em 'val' caso falte.\n\nTexto a ser analisado:\n"""\n${text.substring(0, 20000)}\n"""`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || 'Erro na API do Gemini');
        }

        let jsonText = data.candidates[0].content.parts[0].text;
        // Limpar possíveis blocos de markdown ```json ... ```
        jsonText = jsonText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
        
        const parsed = JSON.parse(jsonText);
        
        return res.status(200).json(parsed);

    } catch (error) {
        console.error('Extract error:', error);
        return res.status(500).json({ error: 'Falha na Inteligência Artificial', details: error.message });
    }
}
