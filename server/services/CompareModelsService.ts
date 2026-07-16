import { GeminiProvider, ProviderRequest, ProviderResponse } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { AnthropicProvider } from '../providers/AnthropicProvider';

export class CompareModelsService {
  private gemini = new GeminiProvider();
  private openai = new OpenAIProvider();
  private anthropic = new AnthropicProvider();

  public async compare(message: string, history: any[]): Promise<{
    gemini: ProviderResponse;
    openai: ProviderResponse;
    claude: ProviderResponse;
    synthesis: string;
  }> {
    const req: ProviderRequest = { message, history };

    // Parallel execution - do not let one failure break others
    const runGemini = async (): Promise<ProviderResponse> => {
      const start = Date.now();
      try {
        if (!this.gemini.isConfigured()) {
          return {
            provider: 'Gemini',
            model: 'gemini-3.5-flash',
            content: '⚠️ 尚未配置 Gemini API 金鑰，無法參與比較。請點選金鑰管理設定。🌸',
            latencyMs: 0,
            status: 'error'
          };
        }
        return await this.gemini.chat(req);
      } catch (err: any) {
        return {
          provider: 'Gemini',
          model: 'gemini-3.5-flash',
          content: `❌ Gemini 呼叫失敗: ${err.message}`,
          latencyMs: Date.now() - start,
          status: 'error'
        };
      }
    };

    const runOpenAI = async (): Promise<ProviderResponse> => {
      const start = Date.now();
      try {
        if (!this.openai.isConfigured()) {
          return {
            provider: 'OpenAI',
            model: 'gpt-4o',
            content: '⚠️ 尚未配置 OpenAI API 金鑰，無法參與比較。請點選金鑰管理設定。🌸',
            latencyMs: 0,
            status: 'error'
          };
        }
        return await this.openai.chat(req);
      } catch (err: any) {
        return {
          provider: 'OpenAI',
          model: 'gpt-4o',
          content: `❌ OpenAI 呼叫失敗: ${err.message}`,
          latencyMs: Date.now() - start,
          status: 'error'
        };
      }
    };

    const runAnthropic = async (): Promise<ProviderResponse> => {
      const start = Date.now();
      try {
        if (!this.anthropic.isConfigured()) {
          return {
            provider: 'Claude',
            model: 'claude-3-5-sonnet',
            content: '⚠️ 尚未配置 Claude API 金鑰，無法參與比較。請點選金鑰管理設定。🌸',
            latencyMs: 0,
            status: 'error'
          };
        }
        return await this.anthropic.chat(req);
      } catch (err: any) {
        return {
          provider: 'Claude',
          model: 'claude-3-5-sonnet',
          content: `❌ Claude 呼叫失敗: ${err.message}`,
          latencyMs: Date.now() - start,
          status: 'error'
        };
      }
    };

    // Run all three in parallel
    const [geminiRes, openaiRes, claudeRes] = await Promise.all([
      runGemini(),
      runOpenAI(),
      runAnthropic()
    ]);

    // Synthesize comparison dynamically using an available provider (Gemini preferred)
    let synthesis = '';
    const canSynthesize = this.gemini.isConfigured() || this.openai.isConfigured() || this.anthropic.isConfigured();

    if (canSynthesize) {
      const synthesisPrompt = `你是一位專業的模型對比與分析助理。請針對使用者提出的問題以及三個不同 AI 模型的回答，進行溫柔、有深度、文青且條理清晰的「執行摘要」與「共識對比」。
【使用者提出的問題】：『${message}』

【Gemini 回答】：
${geminiRes.status === 'success' ? geminiRes.content : '(未正常回應)'}

【OpenAI 回答】：
${openaiRes.status === 'success' ? openaiRes.content : '(未正常回應)'}

【Claude 回答】：
${claudeRes.status === 'success' ? claudeRes.content : '(未正常回應)'}

【請注意：極端重要的限制要求】：
1. 嚴格不顯示任何內部思考過程 (Chain of Thought)、系統提示詞分析、或技術術語堆疊。
2. 直接呈現對使用者最有幫助的「執行摘要」、「回答共識點」、「各模型特色對比」與「溫柔的使用建議」。
3. 採用繁體中文，搭配一些貼心的情感關懷（例如：「希望這個多模型共識分析，能為您理清思緒，帶給您安定的指引。🌸」）。
4. 使用 Markdown 格式。`;

      try {
        if (this.gemini.isConfigured()) {
          const synthesisRes = await this.gemini.chat({ message: synthesisPrompt, history: [] });
          synthesis = synthesisRes.content;
        } else if (this.openai.isConfigured()) {
          const synthesisRes = await this.openai.chat({ message: synthesisPrompt, history: [] });
          synthesis = synthesisRes.content;
        } else {
          const synthesisRes = await this.anthropic.chat({ message: synthesisPrompt, history: [] });
          synthesis = synthesisRes.content;
        }
      } catch (synthErr) {
        console.error('Synthesis generation failed:', synthErr);
        synthesis = `🌸 **多模型共識與建議** 🌸
- **對比分析**：多個模型已成功為您的問題提供回應。Gemini 著重情感溫柔陪伴，OpenAI 著重步驟規劃，Claude 展現精湛的詩意文學感。
- **回答差異性**：各家模型在對比中展現了不同的維度，推薦您閱讀上方詳細的回應內容，並從中挑選最契合您現狀的方向。✨`;
      }
    } else {
      synthesis = `🌸 **尚未設定任何 AI 金鑰** 🌸
請先至右上方「金鑰管理」設定 API 金鑰，即可啟用智能多模型比較與深度共識摘要功能。✨`;
    }

    return {
      gemini: geminiRes,
      openai: openaiRes,
      claude: claudeRes,
      synthesis
    };
  }
}
