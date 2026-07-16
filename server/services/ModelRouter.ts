import { GeminiProvider, ProviderRequest, ProviderResponse } from '../providers/GeminiProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { AnthropicProvider } from '../providers/AnthropicProvider';
import { ProviderHealthService } from './ProviderHealthService';

export class ModelRouter {
  private gemini = new GeminiProvider();
  private openai = new OpenAIProvider();
  private anthropic = new AnthropicProvider();
  private health = new ProviderHealthService();

  public async route(req: ProviderRequest & { model: string }): Promise<ProviderResponse> {
    const startTime = Date.now();
    let selectedProvider = 'Gemini';
    let targetModel = 'gemini-3.5-flash';

    // 1. Determine primary route
    if (req.model === 'auto') {
      if (req.capability === 'CODE_GENERATION' || req.capability === 'CODE_DEBUG') {
        if (this.openai.isConfigured()) {
          selectedProvider = 'OpenAI';
          targetModel = 'gpt-4o';
        } else if (this.gemini.isConfigured()) {
          selectedProvider = 'Gemini';
          targetModel = 'gemini-3.5-flash';
        }
      } else if (req.capability === 'DOCUMENT_ANALYSIS') {
        if (this.anthropic.isConfigured()) {
          selectedProvider = 'Claude';
          targetModel = 'claude-3-5-sonnet';
        } else if (this.gemini.isConfigured()) {
          selectedProvider = 'Gemini';
          targetModel = 'gemini-3.5-flash';
        }
      } else {
        selectedProvider = 'Gemini';
        targetModel = 'gemini-3.5-flash';
      }
    } else if (req.model === 'openai') {
      selectedProvider = 'OpenAI';
      targetModel = 'gpt-4o';
    } else if (req.model === 'claude') {
      selectedProvider = 'Claude';
      targetModel = 'claude-3-5-sonnet';
    } else {
      selectedProvider = 'Gemini';
      targetModel = 'gemini-3.5-flash';
    }

    // 2. Check configuration (Rule 5)
    if (selectedProvider === 'Gemini' && !this.gemini.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED_GEMINI');
    }
    if (selectedProvider === 'OpenAI' && !this.openai.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED_OPENAI');
    }
    if (selectedProvider === 'Claude' && !this.anthropic.isConfigured()) {
      throw new Error('PROVIDER_NOT_CONFIGURED_CLAUDE');
    }

    // 3. Try execution with timeout and backup fallback (Rule 6)
    try {
      if (selectedProvider === 'Gemini') {
        return await this.gemini.chat(req);
      } else if (selectedProvider === 'OpenAI') {
        return await this.openai.chat(req, 10000); // 10s timeout
      } else {
        return await this.anthropic.chat(req, 10000); // 10s timeout
      }
    } catch (err: any) {
      console.warn(`Primary model ${selectedProvider} failed or timed out. Attempting backup.`, err.message);

      // Handle fallback if it's a timeout or general API failure
      if (err.message === 'TIMEOUT' || err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('500') || err.message.includes('API')) {
        // Find next best configured provider as backup
        let backupProvider = 'Gemini';
        if (this.gemini.isConfigured()) {
          backupProvider = 'Gemini';
        } else if (this.openai.isConfigured()) {
          backupProvider = 'OpenAI';
        } else if (this.anthropic.isConfigured()) {
          backupProvider = 'Claude';
        } else {
          // If absolutely nothing is configured
          throw err;
        }

        if (backupProvider === selectedProvider) {
          // Can't fallback to self
          throw err;
        }

        console.log(`Fallback triggered: falling back from ${selectedProvider} to ${backupProvider}`);
        
        let fallbackRes: ProviderResponse;
        if (backupProvider === 'Gemini') {
          fallbackRes = await this.gemini.chat(req);
        } else if (backupProvider === 'OpenAI') {
          fallbackRes = await this.openai.chat(req);
        } else {
          fallbackRes = await this.anthropic.chat(req);
        }

        // Inform user in response text and status
        const notification = `⚠️ 【系統訊息：已啟用備援機制】\n偵測到您選擇的模型 **${selectedProvider}** 回應逾時或無法連線。為了不中斷您的心靈體驗，小艾已為您自動切換至備援模型 **${backupProvider}**，繼續為您提供溫柔陪伴。🌸\n\n`;
        
        return {
          ...fallbackRes,
          content: notification + fallbackRes.content,
          status: 'fallback',
          fallbackReason: `原模型 ${selectedProvider} 回應超時或發生連線錯誤，已自動切換至備援模型 ${backupProvider}。`
        };
      }

      // Re-throw other critical errors (like PROVIDER_NOT_CONFIGURED)
      throw err;
    }
  }
}
