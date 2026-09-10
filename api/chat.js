export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. Add it in Vercel > Settings > Environment Variables.' });
    return;
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: system || '' }] }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Gemini API error' });
      return;
    }

    const reply = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error talking to Gemini API', details: String(err) });
  }
}
