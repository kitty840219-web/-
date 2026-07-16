import { ProviderRequest, ProviderResponse } from './GeminiProvider';

export class AnthropicProvider {
  public isConfigured(): boolean {
    const key = process.env.ANTHROPIC_API_KEY;
    return !!key && key.trim() !== '' && key !== 'MY_ANTHROPIC_API_KEY';
  }

  public async chat(req: ProviderRequest, timeoutMs: number = 10000): Promise<ProviderResponse> {
    const startTime = Date.now();
    if (!this.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const systemPrompt = `你現在是「艾飛樂 AI 助理 (Claude 詩意解析)」。
請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
即使解答專業的技術或文件問題，也請展現深具溫度的文學感。
善用溫暖的句式，適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次。`;

      const messages = req.history.map(h => ({
        role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.content
      }));
      messages.push({ role: 'user' as const, content: req.message });

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2048,
          system: systemPrompt,
          messages,
          temperature: 0.7
        }),
        signal: controller.signal
      });

      clearTimeout(id);

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API 伺服器回應錯誤: ${errText}`);
      }

      const data = await res.json();
      const responseText = data.content?.[0]?.text || '';

      return {
        provider: 'Claude',
        model: 'claude-3-5-sonnet',
        content: responseText,
        latencyMs: Date.now() - startTime,
        status: 'success',
        usage: {
          inputTokens: data.usage?.input_tokens || Math.floor(req.message.length * 0.8),
          outputTokens: data.usage?.output_tokens || Math.floor(responseText.length * 1.1)
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

    const systemPrompt = `你現在是「艾飛樂 AI 助理 (Claude 詩意解析)」。
請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
即使解答專業的技術或文件問題，也請展現深具溫度的文學感。
善用溫暖的句式，適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次。`;

    const messages = req.history.map(h => ({
      role: h.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: h.content
    }));
    messages.push({ role: 'user' as const, content: req.message });

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: systemPrompt,
        messages,
        temperature: 0.7,
        stream: true
      }),
      signal: controller.signal
    });

    clearTimeout(id);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API 伺服器回應錯誤: ${errText}`);
    }

    const reader = res.body;
    if (!reader) {
      throw new Error('無法讀取 Claude 串流回應。');
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
          try {
            const parsed = JSON.parse(rawData);
            if (parsed.type === 'content_block_delta') {
              const delta = parsed.delta?.text || '';
              if (delta) {
                yield { type: 'content', delta };
              }
            }
          } catch {}
        }
      }
    }
  }
}
