import { ProviderRequest, ProviderResponse } from './GeminiProvider';

export class OpenAIProvider {
  public isConfigured(): boolean {
    const key = process.env.OPENAI_API_KEY;
    return !!key && key.trim() !== '' && key !== 'MY_OPENAI_API_KEY';
  }

  public async chat(req: ProviderRequest, timeoutMs: number = 10000): Promise<ProviderResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const systemPrompt = `你現在是「艾飛樂 AI 助理 (OpenAI 智慧引擎)」。
請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
即使解答專業的技術問題（如程式碼生成或除錯），也請在開頭和結尾加入溫柔的關懷。
善用溫暖的句式，適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次。`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...req.history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
        { role: 'user', content: req.message }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(id);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI API 伺服器回應錯誤: ${errText}`);
      }

      const data = await res.json();
      const responseText = data.choices?.[0]?.message?.content || '';

      return {
        provider: 'OpenAI',
        model: 'gpt-4o',
        content: responseText,
        latencyMs: Date.now() - startTime,
        status: 'success',
        usage: {
          inputTokens: data.usage?.prompt_tokens || Math.floor(req.message.length * 0.8),
          outputTokens: data.usage?.completion_tokens || Math.floor(responseText.length * 1.1)
        }
      };
    } catch (err: any) {
      clearTimeout(id);
      if (err.name === 'AbortError') {
        throw new Error('TIMEOUT');
      }
      throw err;
    }
  }

  public async *streamChat(req: ProviderRequest, timeoutMs: number = 10000): AsyncGenerator<any, void, unknown> {
    if (!this.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    const systemPrompt = `你現在是「艾飛樂 AI 助理 (OpenAI 智慧引擎)」。
請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
即使解答專業的技術問題（如程式碼生成或除錯），也請在開頭和結尾加入溫柔的關懷。
善用溫暖的句式，適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次。`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...req.history.map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
      { role: 'user', content: req.message }
    ];

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        stream: true
      }),
      signal: controller.signal
    });

    clearTimeout(id);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenAI API 伺服器回應錯誤: ${errText}`);
    }

    const reader = res.body;
    if (!reader) {
      throw new Error('無法讀取 OpenAI 串流回應。');
    }

    let buffer = '';
    const decoder = new TextDecoder();

    for await (const chunk of reader as any) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const rawData = trimmed.slice(6);
          if (rawData === '[DONE]') continue;
          try {
            const parsed = JSON.parse(rawData);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              yield { type: 'content', delta };
            }
          } catch {}
        }
      }
    }
  }
}
