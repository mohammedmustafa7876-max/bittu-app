export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing GROQ_API_KEY. Add it in Vercel > Settings > Environment Variables.' });
    return;
  }

  const { system, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  const chatMessages = [
    { role: 'system', content: system || '' },
    ...messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
  ];

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: chatMessages,
        stream: true
      })
    });

    if (!upstream.ok || !upstream.body) {
      let errMsg = 'Groq API error';
      try { const errData = await upstream.json(); errMsg = errData?.error?.message || errMsg; } catch(e) {}
      res.status(upstream.status || 500).json({ error: errMsg });
      return;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sepIndex;
      while ((sepIndex = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);
        const line = rawEvent.trim();
        if (!line.startsWith('data:')) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const textPiece = parsed.choices?.[0]?.delta?.content || '';
          if (textPiece) res.write(textPiece);
        } catch (e) { /* ignore malformed partial chunk */ }
      }
    }
    res.end();
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error talking to Groq API', details: String(err) });
    } else {
      res.end();
    }
  }
}
