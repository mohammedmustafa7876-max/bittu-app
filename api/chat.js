// This runs on the SERVER (Vercel), never in the user's browser.
// The API key stays secret here — this is the key difference between
// the demo (which ran inside Claude) and a real, publicly shippable app.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Add it in Vercel > Settings > Environment Variables.' });
    return;
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: system || '',
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: data?.error?.message || 'Anthropic API error' });
      return;
    }

    const reply = (data.content || []).map(c => c.text || '').join('').trim();
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Server error talking to Anthropic API', details: String(err) });
  }
}
