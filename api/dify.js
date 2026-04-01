export default async function handler(req, res) {
    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inputs } = req.body;
    if (!inputs) {
        return res.status(400).json({ error: 'Missing inputs' });
    }

    const DIFY_API_KEY = process.env.DIFY_API_KEY;
    if (!DIFY_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const DIFY_API_URL = 'https://api.dify.ai/v1/workflows/run';

    try {
        const response = await fetch(DIFY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: inputs,
                user: 'anonymous'  // 添加固定 user 字段
            }),
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}