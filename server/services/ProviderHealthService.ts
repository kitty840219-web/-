import { GeminiProvider } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { AnthropicProvider } from '../providers/AnthropicProvider';

export class ProviderHealthService {
  private gemini = new GeminiProvider();
  private openai = new OpenAIProvider();
  private anthropic = new AnthropicProvider();

  public getHealthStatus() {
    const isGeminiOk = this.gemini.isConfigured();
    const isOpenAiOk = this.openai.isConfigured();
    const isClaudeOk = this.anthropic.isConfigured();

    return {
      gemini: {
        healthy: isGeminiOk,
        status: isGeminiOk ? 'OK' : 'PROVIDER_NOT_CONFIGURED',
        message: isGeminiOk ? '金鑰已正確配置，服務運作中。' : '尚未在伺服器端設定 GEMINI_API_KEY。'
      },
      openai: {
        healthy: isOpenAiOk,
        status: isOpenAiOk ? 'OK' : 'PROVIDER_NOT_CONFIGURED',
        message: isOpenAiOk ? '金鑰已正確配置，服務運作中。' : '尚未在伺服器端設定 OPENAI_API_KEY。'
      },
      claude: {
        healthy: isClaudeOk,
        status: isClaudeOk ? 'OK' : 'PROVIDER_NOT_CONFIGURED',
        message: isClaudeOk ? '金鑰已正確配置，服務運作中。' : '尚未在伺服器端設定 ANTHROPIC_API_KEY。'
      }
    };
  }

  // Fast check if any key exists to help with fallbacks
  public getAnyAvailableProvider(): 'Gemini' | 'OpenAI' | 'Claude' | null {
    if (this.gemini.isConfigured()) return 'Gemini';
    if (this.openai.isConfigured()) return 'OpenAI';
    if (this.anthropic.isConfigured()) return 'Claude';
    return null;
  }
}
