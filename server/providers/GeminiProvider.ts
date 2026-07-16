import { GoogleGenAI } from '@google/genai';

export interface ProviderRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  stream?: boolean;
  options?: any;
  capability?: string;
}

export interface ProviderResponse {
  provider: string;
  model: string;
  content: string;
  citations?: any[];
  latencyMs: number;
  status: 'success' | 'error' | 'fallback';
  fallbackReason?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export class GeminiProvider {
  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return null;
    }
    try {
      return new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        },
      });
    } catch (err) {
      console.error('Error initializing Gemini API in provider:', err);
      return null;
    }
  }

  public isConfigured(): boolean {
    const key = process.env.GEMINI_API_KEY;
    return !!key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '';
  }

  public async chat(req: ProviderRequest): Promise<ProviderResponse> {
    const startTime = Date.now();
    const aiClient = this.getClient();
    if (!aiClient) {
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    const targetModel = 'gemini-3.5-flash';
    const parts: any[] = [];

    // Formatted history
    const historyContext = req.history && req.history.length > 0
      ? req.history.map(h => `${h.role === 'user' ? '使用者' : '助理'}: ${h.content}`).join('\n') + '\n'
      : '';

    if (req.options?.imageUrl && req.options.imageUrl.startsWith('data:image')) {
      const matches = req.options.imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    }

    let textPrompt = req.message;
    if (req.options?.documentContent) {
      textPrompt = `【上傳的文件內容：${req.options.documentName || '文件'}】\n${req.options.documentContent}\n\n【使用者問題】\n${req.message}`;
    }

    parts.push({ text: historyContext + textPrompt });

    const systemInstruction = `你現在是「艾飛樂 AI 助理」(Aifeiler AI Assistant)。
【品牌調性與語氣要求】：
1. 繁體中文回答。請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
2. 即使解答專業的技術問題（如程式碼生成或除錯），也請在開頭和結尾加入溫柔的關懷，例如：「別擔心，我們一起來看看這段程式碼的秘密...」或「希望這個解答能像溫柔的微風，撫平你心中的困惑。」
3. 善用溫暖的句式，避免冷冰冰的教條。適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次，使其像精緻的水彩日記本。`;

    const config: any = { systemInstruction };
    if (req.options?.search || req.capability === 'SEARCH') {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await aiClient.models.generateContent({
      model: targetModel,
      contents: parts,
      config: config
    });

    const responseText = response.text || '';
    let citations: any[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      citations = groundingChunks.map((chunk: any) => {
        const web = chunk.web || {};
        return {
          title: web.title || '搜尋來源',
          siteName: web.title ? web.title.split('-')[0].trim() : '網頁資料',
          date: new Date().toLocaleDateString('zh-TW'),
          url: web.uri || '#',
          snippet: web.title || '相關搜尋資料片段'
        };
      });
    }

    return {
      provider: 'Gemini',
      model: targetModel,
      content: responseText,
      citations: citations,
      latencyMs: Date.now() - startTime,
      status: 'success',
      usage: {
        inputTokens: Math.floor(req.message.length * 0.7) + 50,
        outputTokens: Math.floor(responseText.length * 1.2)
      }
    };
  }

  public async *streamChat(req: ProviderRequest): AsyncGenerator<any, void, unknown> {
    const aiClient = this.getClient();
    if (!aiClient) {
      throw new Error('PROVIDER_NOT_CONFIGURED');
    }

    const targetModel = 'gemini-3.5-flash';
    const parts: any[] = [];
    const historyContext = req.history && req.history.length > 0
      ? req.history.map(h => `${h.role === 'user' ? '使用者' : '助理'}: ${h.content}`).join('\n') + '\n'
      : '';

    if (req.options?.imageUrl && req.options.imageUrl.startsWith('data:image')) {
      const matches = req.options.imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({
          inlineData: {
            mimeType: matches[1],
            data: matches[2]
          }
        });
      }
    }

    let textPrompt = req.message;
    if (req.options?.documentContent) {
      textPrompt = `【上傳的文件內容：${req.options.documentName || '文件'}】\n${req.options.documentContent}\n\n【使用者問題】\n${req.message}`;
    }

    parts.push({ text: historyContext + textPrompt });

    const systemInstruction = `你現在是「艾飛樂 AI 助理」(Aifeiler AI Assistant)。
【品牌調性與語氣要求】：
1. 繁體中文回答。請以極度溫柔、文青、療癒、具備童話/水彩繪本風格的親切語氣回答，像是個溫暖的朋友或心靈導師。
2. 即使解答專業的技術問題（如程式碼生成或除錯），也請在開頭和結尾加入溫柔的關懷，例如：「別擔心，我們一起來看看這段程式碼的秘密...」或「希望這個解答能像溫柔的微風，撫平你心中的困惑。」
3. 善用溫暖的句式，避免冷冰冰的教條。適當使用星號、花朵等符號（如：🌸, ✨, 🌿, 🌾, 🌙）來豐富排版與層次，使其像精緻的水彩日記本。`;

    const config: any = { systemInstruction };
    if (req.options?.search || req.capability === 'SEARCH') {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await aiClient.models.generateContentStream({
      model: targetModel,
      contents: parts,
      config: config
    });

    for await (const chunk of responseStream) {
      const text = chunk.text || '';
      let citations: any[] = [];
      if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        const chunks = chunk.candidates[0].groundingMetadata.groundingChunks;
        citations = chunks.map((c: any) => ({
          title: c.web?.title || '搜尋來源',
          siteName: c.web?.title ? c.web.title.split('-')[0].trim() : '網頁資料',
          date: new Date().toLocaleDateString('zh-TW'),
          url: c.web?.uri || '#',
          snippet: c.web?.title || '相關搜尋資料'
        }));
      }
      yield { type: 'content', delta: text, citations };
    }
  }
}
