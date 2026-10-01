export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, totalPages } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Nenhum texto fornecido para análise.' });
    }

    // Verifica a chave da API (GEMINI_API_KEY)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ 
            error: 'Configuração ausente', 
            details: 'A chave de API de Inteligência Artificial (GEMINI_API_KEY) não está configurada no servidor Vercel. Adicione-a nas variáveis de ambiente do projeto para habilitar a extração automatizada.' 
        });
    }

    try {
        const prompt = `Extraia as seguintes informações do texto acadêmico fornecido (normalmente composto de capa, folha de rosto, aprovação e resumo). Retorne APENAS um JSON estrito válido com as seguintes chaves (use null se a informação não for encontrada de forma clara, não invente):
- autor_nome (Primeiro nome e nomes do meio do autor)
- autor_sobrenome (Último sobrenome do autor)
- titulo (Título principal do trabalho)
- subtitulo (Subtítulo do trabalho, se houver)
- instituicao (Nome da instituição de ensino)
- curso (Curso ou programa acadêmico, ex: Direito, Engenharia)
- tipo_trabalho (Ex: Trabalho de Conclusão de Curso, Dissertação, Tese, Monografia)
- orientador (Nome completo do orientador com titulação)
- coorientador (Nome completo do coorientador com titulação)
- cidade (Cidade onde foi defendido/publicado)
- ano (Ano da defesa ou publicação, 4 dígitos)
- palavras_chave (Array de strings com as palavras-chave ou assuntos)
- paginas (Inteiro, número total de folhas estimadas se encontrado no texto, caso contrário retorne ${totalPages || 'null'})

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
            throw new Error(data.error?.message || 'Erro de resposta da API do Gemini');
        }

        const jsonText = data.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(jsonText);
        
        return res.status(200).json(parsed);

    } catch (error) {
        console.error('Extract error:', error);
        return res.status(500).json({ error: 'Falha ao processar os dados com IA', details: error.message });
    }
}
