export type ModelType = 'auto' | 'gemini' | 'openai' | 'claude' | 'compare';

export type SubTabType = 
  | 'chat' 
  | 'history' 
  | 'favorites' 
  | 'images' 
  | 'search' 
  | 'code' 
  | 'agents' 
  | 'compare' 
  | 'characters' 
  | 'settings';

export type Capability = 
  | 'CHAT' 
  | 'SEARCH' 
  | 'IMAGE_GENERATION' 
  | 'IMAGE_ANALYSIS' 
  | 'CODE_GENERATION' 
  | 'CODE_DEBUG' 
  | 'DOCUMENT_ANALYSIS' 
  | 'AGENT_TASK' 
  | 'CREATIVE_WRITING' 
  | 'EMOTIONAL_SUPPORT' 
  | 'TAROT_CONTENT' 
  | 'BRAND_CONTENT';

export interface ChatRequest {
  message: string;
  history: { role: 'user' | 'assistant'; content: string }[];
  model: ModelType;
  capability: Capability;
  options?: {
    search?: boolean;
    agent?: boolean;
    imageUrl?: string;
    documentContent?: string;
    documentName?: string;
    negativePrompt?: string;
    imageRatio?: string;
    imageStyle?: string;
    numImages?: number;
  };
}

export interface Citation {
  title: string;
  siteName: string;
  date?: string;
  url: string;
  snippet: string;
}

export interface ToolCall {
  name: string;
  args: Record<string, any>;
  result?: any;
}

export interface ChatResponse {
  provider: string;
  model: string;
  content: string;
  citations?: Citation[];
  toolCalls?: ToolCall[];
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  latencyMs: number;
  status: 'success' | 'error';
}

export interface ChatChunk {
  text: string;
  done: boolean;
}

export interface ImageResult {
  url: string;
  revisedPrompt?: string;
}

export interface AIProvider {
  chat(request: ChatRequest): Promise<ChatResponse>;
  streamChat?(request: ChatRequest): AsyncIterable<ChatChunk>;
  analyzeImage?(request: ChatRequest, base64Image: string, mimeType: string): Promise<ChatResponse>;
  generateImage?(prompt: string, options?: any): Promise<ImageResult>;
  supports(capability: Capability): boolean;
}

export interface AgentStep {
  title: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  detail?: string;
  timestamp: string;
  durationMs?: number;
  source?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
  latencyMs?: number;
  status?: 'success' | 'error';
  citations?: Citation[];
  toolCalls?: ToolCall[];
  isAgent?: boolean;
  agentSteps?: AgentStep[];
  favorite?: boolean;
  compareResults?: {
    gemini?: ChatResponse;
    openai?: ChatResponse;
    claude?: ChatResponse;
    synthesis?: string;
  };
  imageUrls?: string[];
  docInfo?: {
    name: string;
    size: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
  activeCharacter: string;
}

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

export interface ImageGenRecord {
  id: string;
  prompt: string;
  negativePrompt?: string;
  url: string;
  ratio: string;
  style: string;
  timestamp: string;
  favorite: boolean;
}
