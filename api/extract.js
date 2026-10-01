export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, totalPages } = req.body;
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
        const prompt = `Analise o texto extraído de um trabalho acadêmico (contendo capa, folha de rosto, etc).
Sua tarefa é extrair os dados bibliográficos de forma precisa e lidar com divergências (ex: título na capa vs título na folha de rosto).

Retorne APENAS um JSON válido. Para cada campo, você deve retornar um objeto com o formato:
{ "val": "o valor extraído formatado", "source": "o trecho exato e literal do texto de onde você tirou essa informação (para o usuário conferir)" }

Regras específicas:
- autor_nome: Nome completo do autor, EXCLUINDO o último sobrenome. 
- autor_sobrenome: Apenas o ÚLTIMO sobrenome (ou composto, ex: "da Silva").
- titulo: Título principal. Reconheça títulos que estão em várias linhas, unindo com espaço. Se o título na capa for diferente da folha de rosto, escolha o mais completo e avise no 'source'.
- subtitulo: Identifique o subtítulo (geralmente após dois-pontos ou separado visualmente). Não confunda quebra de linha com subtítulo. Se não houver, retorne val como nulo.
- palavras_chave: Deve ser um array de strings no 'val', e a string original inteira no 'source'.
- paginas: Número total de páginas/folhas (descontando se puder inferir, ou use ${totalPages || 'null'}).

Estrutura JSON Esperada:
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
}

Não preencha se não encontrar. Use null em 'val' caso falte.

Texto a ser analisado:
"""
${text.substring(0, 20000)}
"""`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

        const jsonText = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(jsonText);
        
        return res.status(200).json(parsed);

    } catch (error) {
        console.error('Extract error:', error);
        return res.status(500).json({ error: 'Falha na Inteligência Artificial', details: error.message });
    }
}
