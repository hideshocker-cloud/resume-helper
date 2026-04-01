// 这是 Vercel Serverless Function，用于转发请求到 Dify 并隐藏 API 密钥
export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inputs } = req.body;
    if (!inputs) {
        return res.status(400).json({ error: 'Missing inputs' });
    }

    // 从环境变量读取 Dify API 密钥
    const DIFY_API_KEY = process.env.DIFY_API_KEY;
    if (!DIFY_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Dify API 端点（你的工作流 API）
    const DIFY_API_URL = 'https://api.dify.ai/v1/workflows/run';

    try {
        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs }),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}