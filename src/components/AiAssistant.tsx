import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  History,
  Heart,
  Image as ImageIcon,
  Search,
  Code,
  Cpu,
  Columns,
  Users,
  Settings as SettingsIcon,
  Plus,
  Send,
  Mic,
  MicOff,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Download,
  Trash,
  FolderPlus,
  FileText,
  ChevronRight,
  Play,
  RefreshCw,
  X,
  File,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Share2,
  PlayCircle
} from 'lucide-react';

import {
  ModelType,
  SubTabType,
  Capability,
  Citation,
  ChatResponse,
  AgentStep,
  Message,
  ChatSession,
  CodeFile,
  ImageGenRecord
} from '../types/ai';

import { IMAGES } from '../assets/images';

interface AiAssistantProps {
  onBackToHome?: () => void;
  activeCharacter: string;
  onSelectCharacter: (name: string) => void;
}

export default function AiAssistant({ onBackToHome, activeCharacter, onSelectCharacter }: AiAssistantProps) {
  // Navigation & Sessions
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [favorites, setFavorites] = useState<Message[]>([]);

  // API Config Connection status
  const [apiConfig, setApiConfig] = useState<any>({
    providers: {
      gemini: { connected: true, status: '已連線', lastFour: '8888', model: 'gemini-3.5-flash' },
      openai: { connected: false, status: '未連線', lastFour: '', model: 'gpt-4o' },
      claude: { connected: false, status: '未連線', lastFour: '', model: 'claude-3-5-sonnet' },
      search: { connected: true, status: '已連線', lastFour: '9999', engine: 'Google Search API' },
      image: { connected: true, status: '已連線', lastFour: '8888', model: 'gemini-3.1-flash-lite-image' }
    }
  });

  // Chat State
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>('auto');
  const [isSearchToggled, setIsSearchToggled] = useState(false);
  const [isAgentToggled, setIsAgentToggled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // File Uploads
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<{ name: string; content: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Voice Recording
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Code Workspace State
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([
    { id: 'f1', name: 'App.tsx', content: 'import React from "react";\n\nexport default function App() {\n  return <div>🌸 歡迎來到艾飛樂程式工作區 🌸</div>;\n}', language: 'typescript' },
    { id: 'f2', name: 'utils.ts', content: 'export function formatMascotName(name: string): string {\n  return `✨ 助理小夥伴 ${name} ✨`;\n}', language: 'typescript' }
  ]);
  const [activeFileId, setActiveFileId] = useState('f1');
  const [codeHelperInput, setCodeHelperInput] = useState('');
  const [codeLogs, setCodeLogs] = useState<string>('【系統提示】模擬安全沙盒已就緒。本機執行輸出將在這裡呈現。\n[Ready] App.tsx loaded successfully.');
  const [codeEdits, setCodeEdits] = useState<{ id: string; original: string; proposed: string; prompt: string; timestamp: string } | null>(null);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageRatio, setImageRatio] = useState('1:1');
  const [imageStyle, setImageStyle] = useState('艾飛樂水彩');
  const [numImages, setNumImages] = useState(1);
  const [brandColor, setBrandColor] = useState(true);
  const [charConsistency, setCharConsistency] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [imageHistory, setImageHistory] = useState<ImageGenRecord[]>([]);

  // API Connection states for expander
  const [editingProviderId, setEditingProviderId] = useState<string | null>(null);
  const [inputApiKeys, setInputApiKeys] = useState<{ [key: string]: string }>({});
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});
  const [testingStatus, setTestingStatus] = useState<{ [key: string]: 'idle' | 'testing' | 'success' | 'error' }>({});

  const handleSaveApiKey = async (providerId: string, customKey?: string) => {
    const keyToSave = customKey !== undefined ? customKey : (inputApiKeys[providerId] || '');
    setTestingStatus(prev => ({ ...prev, [providerId]: 'testing' }));
    
    try {
      const res = await fetch('/api/ai-assistant/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, apiKey: keyToSave })
      });
      
      if (res.ok) {
        const data = await res.json();
        setApiConfig(data);
        setTestingStatus(prev => ({ ...prev, [providerId]: 'success' }));
        setTimeout(() => {
          setTestingStatus(prev => ({ ...prev, [providerId]: 'idle' }));
        }, 2000);
      } else {
        setTestingStatus(prev => ({ ...prev, [providerId]: 'error' }));
      }
    } catch (e) {
      console.error(e);
      setTestingStatus(prev => ({ ...prev, [providerId]: 'error' }));
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setTestingStatus(prev => ({ ...prev, [providerId]: 'testing' }));
    
    try {
      // Save current input value if we have any
      const currentKey = inputApiKeys[providerId];
      if (currentKey !== undefined) {
        await fetch('/api/ai-assistant/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ providerId, apiKey: currentKey })
        });
      }

      const res = await fetch('/api/ai-assistant/config');
      if (res.ok) {
        const data = await res.json();
        setApiConfig(data);
        
        const isConnected = data.providers[providerId]?.connected;
        if (isConnected) {
          setTestingStatus(prev => ({ ...prev, [providerId]: 'success' }));
          alert(`🎉 連線成功！${providerId === 'gemini' ? 'Google Gemini AI' : providerId} 狀態已更新為「已連線」🌸`);
        } else {
          setTestingStatus(prev => ({ ...prev, [providerId]: 'error' }));
          alert(`⚠️ 連線失敗！未能成功連線。請確認金鑰是否正確。`);
        }
        
        setTimeout(() => {
          setTestingStatus(prev => ({ ...prev, [providerId]: 'idle' }));
        }, 2000);
      } else {
        setTestingStatus(prev => ({ ...prev, [providerId]: 'error' }));
      }
    } catch (e) {
      console.error(e);
      setTestingStatus(prev => ({ ...prev, [providerId]: 'error' }));
    }
  };

  const handleRemoveApiKey = async (providerId: string) => {
    if (!confirm(`確定要移除該金鑰設定嗎？`)) {
      return;
    }
    setInputApiKeys(prev => ({ ...prev, [providerId]: '' }));
    await handleSaveApiKey(providerId, '');
    alert('已成功移除該金鑰設定，狀態已更新為「未連線」！🌸');
  };

  // Agent Orchestrator State
  const [agentGoal, setAgentGoal] = useState('');
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [agentOutput, setAgentOutput] = useState('');
  const [requiresConfirmation, setRequiresConfirmation] = useState<{ id: string; title: string; desc: string; action: () => void } | null>(null);

  // Initial prompt cards (from Image 1)
  const QUICK_PROMPTS = [
    { text: '我最近總是很焦慮，該怎麼調整？', icon: '💖' },
    { text: '他對我的真實想法是什麼？', icon: '🌸' },
    { text: '給我今天的塔羅指引', icon: '🃏' },
    { text: '幫我寫一句療癒語錄', icon: '✒️' },
    { text: '我適合創業嗎？', icon: '💡' },
    { text: '如何提升自己的自信？', icon: '🌿' },
    { text: '我們的關係會有結果嗎？', icon: '🌾' },
    { text: '分析我的情緒狀態', icon: '🌙' },
    { text: '幫我搜尋最新生命教育資料', icon: '🔍' },
    { text: '幫我寫一個計時器網頁', icon: '💻' },
    { text: '幫我生成小艾在薰衣草田插圖', icon: '🎨' },
    { text: '啟動 AI Agent 撰寫薰衣草茶文案並配圖', icon: '🤖' }
  ];

  // Fetch configs and set up initial session
  useEffect(() => {
    fetchConfig();
    createNewSession();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/ai-assistant/config');
      if (res.ok) {
        const data = await res.json();
        setApiConfig(data);
      }
    } catch (e) {
      console.warn('Could not load server API configs, using fallbacks.', e);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: '全新療癒對話',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      messages: [],
      activeCharacter: activeCharacter
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || {
    id: 'default',
    title: '全新療癒對話',
    timestamp: '',
    messages: [],
    activeCharacter: activeCharacter
  };

  // Speech Recognition setup (Voice Input)
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('您的瀏覽器不支援語音輸入功能，請使用 Chrome、Safari 或 Edge 瀏覽器。');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = 'zh-TW';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(prev => prev + transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Image Upload helper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('上傳的圖片超過大小限制（限制為 5MB）');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Document Upload helper (for summarization/analysis)
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('上傳的文件超過大小限制（限制為 10MB）');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedDoc({
          name: file.name,
          content: event.target?.result as string || '文件內容空。',
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
      };
      reader.readAsText(file);
    }
  };

  // Main Chat Send Action
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || inputMessage;
    if (!finalMsg.trim() && !attachedImage) return;

    const userMsgId = `msg_${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: finalMsg,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      imageUrls: attachedImage ? [attachedImage] : undefined,
      docInfo: attachedDoc ? { name: attachedDoc.name, size: attachedDoc.size } : undefined
    };

    // Update session state
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const updatedMsgs = [...s.messages, userMsg];
        let newTitle = s.title;
        if (s.title === '全新療癒對話') {
          newTitle = finalMsg.slice(0, 12) + (finalMsg.length > 12 ? '...' : '');
        }
        return { ...s, messages: updatedMsgs, title: newTitle };
      }
      return s;
    }));

    setInputMessage('');
    setAttachedImage(null);
    setAttachedDoc(null);
    setIsGenerating(true);

    const capability: Capability = attachedImage 
      ? 'IMAGE_ANALYSIS' 
      : attachedDoc 
        ? 'DOCUMENT_ANALYSIS' 
        : isSearchToggled 
          ? 'SEARCH' 
          : 'CHAT';

    const assistantMsgId = `msg_${Date.now() + 1}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      status: 'success'
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, initialAssistantMsg] };
      }
      return s;
    }));

    try {
      // Build request history
      const reqHistory = activeSession.messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalMsg,
          history: reqHistory,
          model: selectedModel,
          capability: capability,
          stream: true,
          character: activeSession?.activeCharacter || activeCharacter,
          options: {
            search: isSearchToggled,
            imageUrl: userMsg.imageUrls?.[0],
            documentContent: attachedDoc?.content,
            documentName: attachedDoc?.name,
            character: activeSession?.activeCharacter || activeCharacter
          }
        })
      });

      if (!response.ok) {
        let errMsg = '連線服務失敗';
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (reader) {
        let done = false;
        let finalContent = '';
        let finalMeta: any = null;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            buffer += decoder.decode(value, { stream: !done });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const jsonStr = trimmed.slice(6);
                try {
                  const parsed = JSON.parse(jsonStr);
                  if (parsed.type === 'content') {
                    finalContent += parsed.delta;
                    setSessions(prev => prev.map(s => {
                      if (s.id === activeSessionId) {
                        return {
                          ...s,
                          messages: s.messages.map(m => 
                            m.id === assistantMsgId 
                              ? { ...m, content: finalContent } 
                              : m
                          )
                        };
                      }
                      return s;
                    }));
                  } else if (parsed.type === 'meta') {
                    finalMeta = parsed;
                  } else if (parsed.type === 'error') {
                    throw { isStreamError: true, message: parsed.message };
                  }
                } catch (pe: any) {
                  if (pe && pe.isStreamError) {
                    throw new Error(pe.message);
                  }
                  // Ignore JSON parse errors for incomplete chunks
                }
              }
            }
          }
        }

        // Apply final metadata at the end of streaming
        if (finalMeta) {
          setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: s.messages.map(m => 
                  m.id === assistantMsgId 
                    ? {
                        ...m,
                        provider: finalMeta.provider,
                        model: finalMeta.model,
                        citations: finalMeta.citations,
                        latencyMs: finalMeta.latencyMs,
                        fallback: finalMeta.fallback,
                        originalModel: finalMeta.originalModel,
                        status: 'success'
                      } 
                    : m
                )
              };
            }
            return s;
          }));
        }
      }
    } catch (e: any) {
      console.error('Chat error:', e);
      const errMsg = e.message || '連線服務失敗，請確認伺服器與 API 金鑰狀態。🌸';
      const errContent = `親愛的朋友，我在連接時遇到了些許障礙。🌸\n\n【錯誤訊息】\n${errMsg}\n\n這或許是個提醒我們停下來喝杯茶的小憩時刻。請點選上方「金鑰管理」確認金鑰設定，或稍後再試。`;
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          const hasAssistantMsg = s.messages.some(m => m.id === assistantMsgId);
          if (hasAssistantMsg) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMsgId 
                  ? { ...m, content: errContent, status: 'error' } 
                  : m
              )
            };
          } else {
            const errAssistantMsg: Message = {
              id: assistantMsgId,
              role: 'assistant',
              content: errContent,
              timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
              status: 'error'
            };
            return { ...s, messages: [...s.messages, errAssistantMsg] };
          }
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Compare mode side-by-side execution
  const handleCompareMessage = async (prompt: string) => {
    if (!prompt.trim()) return;

    const userMsgId = `msg_comp_${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    };

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, userMsg], title: `比較：${prompt.slice(0, 10)}` };
      }
      return s;
    }));

    setInputMessage('');
    setIsGenerating(true);

    try {
      // Call the backend comparison engine (Rule 7)
      const res = await fetch('/api/ai-assistant/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: [] })
      });

      if (!res.ok) {
        throw new Error('呼叫多模型比較服務時出錯。🌸');
      }

      const compareData = await res.json();

      const assistantMsg: Message = {
        id: `msg_comp_${Date.now() + 1}`,
        role: 'assistant',
        content: `多模型比較已完成！各大模型的回答與精美執行摘要已為您整合：`,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        compareResults: {
          gemini: {
            provider: 'Gemini',
            model: 'gemini-3.5-flash',
            content: compareData.gemini?.content || '未啟用或連線失敗。',
            latencyMs: compareData.gemini?.latencyMs,
            status: compareData.gemini?.status
          },
          openai: {
            provider: 'OpenAI',
            model: 'gpt-4o',
            content: compareData.openai?.content || '未啟用或連線失敗。',
            latencyMs: compareData.openai?.latencyMs,
            status: compareData.openai?.status
          },
          claude: {
            provider: 'Claude',
            model: 'claude-3-5-sonnet',
            content: compareData.claude?.content || '未啟用或連線失敗。',
            latencyMs: compareData.claude?.latencyMs,
            status: compareData.claude?.status
          },
          synthesis: compareData.synthesis || '暫無綜合整理。'
        }
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, assistantMsg] };
        }
        return s;
      }));

    } catch (e: any) {
      console.error(e);
      const assistantMsg: Message = {
        id: `msg_comp_${Date.now() + 1}`,
        role: 'assistant',
        content: `抱歉，在執行多模型同步比較時發生了點困擾。🌸\n\n【詳細訊息】\n${e.message || '連線逾時。請確認後端金鑰是否配置。'}`,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        status: 'error'
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, assistantMsg] };
        }
        return s;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Generation Action
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;

    const newRecordId = `img_${Date.now()}`;
    const loadingRecord: ImageGenRecord = {
      id: newRecordId,
      prompt: imagePrompt,
      url: 'LOADING',
      ratio: imageRatio,
      style: imageStyle,
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      favorite: false
    };

    setImageHistory(prev => [loadingRecord, ...prev]);
    setImagePrompt('');

    try {
      const response = await fetch('/api/ai-assistant/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          negativePrompt,
          ratio: imageRatio,
          style: imageStyle,
          brandColor,
          characterConsistency: charConsistency
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setImageHistory(prev => prev.map(rec => {
          if (rec.id === newRecordId) {
            return { ...rec, url: data.url, prompt: data.revisedPrompt || rec.prompt };
          }
          return rec;
        }));
      } else {
        throw new Error(data.message || '圖片生成失敗');
      }

    } catch (err: any) {
      setImageHistory(prev => prev.map(rec => {
        if (rec.id === newRecordId) {
          return { ...rec, url: 'ERROR', prompt: err.message || '圖片生成失敗，請確認 API 金鑰。' };
        }
        return rec;
      }));
    }
  };

  // AI Agent orchestrator simulation loop
  const handleStartAgent = async () => {
    if (!agentGoal.trim()) return;

    setAgentRunning(true);
    setAgentOutput('');
    setAgentSteps([]);

    const stepsList: { title: string; delay: number; detail: string }[] = [
      { title: '正在理解與分析任務需求', delay: 800, detail: `分析目標：「${agentGoal}」。尋找核心意象與水彩素材...` },
      { title: '正在規劃多步驟任務計畫', delay: 1000, detail: '1. 檢索薰衣草茶健康效益 2. 撰寫排版宣傳詞 3. 自動呼叫 Image API 繪製配圖。' },
      { title: '正在啟動 web_search 檢索真實資料', delay: 1200, detail: '調用 googleSearch 檢索：2026年最新舒緩花草茶與心靈減壓醫學報告。' },
      { title: '正在調用 AI 模型生成文宣大綱', delay: 1500, detail: 'Gemini 3.5-flash 正整合資料撰寫溫柔療癒風格的行銷長文...' },
      { title: '正在自動執行 generate_image 配圖工具', delay: 1800, detail: '呼叫 Image API 產生：「小艾手捧著熱氣騰騰的薰衣草茶杯，背景是柔和星空與花園水彩繪本」。' },
      { title: '正在整合步驟結果並進行安全校驗', delay: 1200, detail: '校檢回答排版、無不雅用語、字體大小、格式完整。' }
    ];

    let currentStepIndex = 0;

    const runNextStep = () => {
      if (currentStepIndex >= stepsList.length) {
        // Final compilation
        setAgentSteps(prev => prev.map((s, idx) => idx === prev.length - 1 ? { ...s, status: 'success' as const } : s));
        setAgentOutput(`🌸 **【艾飛樂 AI Agent 成果展示】** 🌸

我們成功完成了你交付的任務計畫！下方是根據資料產生的內容：

### 🌿 舒緩香氛：薰衣草花茶與內心花園的溫和對話
1. **健康效益實證**：根據最新文獻，薰衣草中所含的芳香分子能溫和調節自律神經，為焦慮的心靈覆蓋上一層溫暖的舒緩毛毯。
2. **靈魂宣傳金句**：
   > 「當外面的世界走得太快，請進來與熱茶一起，慢慢等待花開。」✨
3. **暖心伴奏配圖**：已為您精心配製薰衣草舒緩插畫，風格完全契合艾飛樂的奶油粉紫視覺。

[任務順利完成，所有步驟安全可控。]`);
        setAgentRunning(false);
        return;
      }

      const step = stepsList[currentStepIndex];
      const newStep: AgentStep = {
        title: step.title,
        status: 'running',
        detail: step.detail,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        source: currentStepIndex % 2 === 0 ? 'Gemini AI Agent' : 'System Tools'
      };

      setAgentSteps(prev => {
        const updated = prev.map(s => s.status === 'running' ? { ...s, status: 'success' as const } : s);
        return [...updated, newStep];
      });

      // Special user authorization prompt simulation for high-risk operation on step 4 (Image cost/external action)
      if (currentStepIndex === 3) {
        setRequiresConfirmation({
          id: 'agent_image_cost',
          title: '授權同意請求',
          desc: '任務即將呼叫外部圖片生成 API（將消耗 5 點探索積分）。請問是否授權執行此步驟？',
          action: () => {
            setRequiresConfirmation(null);
            currentStepIndex++;
            setTimeout(runNextStep, step.delay);
          }
        });
        return;
      }

      currentStepIndex++;
      setTimeout(runNextStep, step.delay);
    };

    runNextStep();
  };

  // Add message to favorites
  const handleToggleFavorite = (msg: Message) => {
    if (favorites.some(f => f.id === msg.id)) {
      setFavorites(prev => prev.filter(f => f.id !== msg.id));
    } else {
      setFavorites(prev => [...prev, { ...msg, favorite: true }]);
    }
  };

  // Run compiled code simulation
  const handleRunCode = () => {
    const activeFile = codeFiles.find(f => f.id === activeFileId);
    setCodeLogs(`【系統提示】正在載入 TypeScript 轉譯器與沙盒環境...\n[編譯成功] 正在執行 ${activeFile?.name || '檔案'}...\n\n=== 執行輸出 ===\n${
      activeFile?.content.includes('<div>') 
        ? '渲染視窗：[React Node 被成功掛載在虛擬 DOM #root]\n🌸 畫面呈現：「' + activeFile.name + ' 渲染出奶油粉彩網頁卡片」'
        : '執行函數回傳：' + activeFile?.content.slice(0, 50) + '...'
    }\n\n[Success] 執行在 12ms 內順利結束。`);
  };

  // Code Assistant generation
  const handleCodeAssistant = async (action: string) => {
    const activeFile = codeFiles.find(f => f.id === activeFileId);
    if (!activeFile) return;

    setCodeLogs(`【AI 輔助】正在使用 Gemini AI 對 ${activeFile.name} 進行 ${action}...`);
    setIsGenerating(true);

    try {
      const prompt = `你現在是艾飛樂程式工作區的 AI 程式助理。
請針對這段程式碼進行「${action}」，語氣要溫柔療癒（繁體中文），並產出優化後的完整程式碼。
【程式碼】：
\`\`\`typescript
${activeFile.content}
\`\`\`
請只回傳以下 JSON 格式，不要有 Markdown 格式字串：
{
  "explanation": "對程式碼的溫柔分析和修改原因...",
  "code": "優化後的完整程式碼..."
}`;

      const res = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, history: [], model: 'gemini', capability: 'CODE_GENERATION' })
      });

      const data = await res.json();
      
      // Attempt to parse JSON from content
      let explanation = `我已為您完成了 ${action} 的分析，請查看下方的 Diff 比較框。`;
      let code = activeFile.content;

      try {
        const parsed = JSON.parse(data.content.trim().replace(/^```json/, '').replace(/```$/, ''));
        explanation = parsed.explanation;
        code = parsed.code;
      } catch {
        // Fallback simple parsing
        const codeBlockMatch = data.content.match(/```[a-z]*\n([\s\S]*?)```/);
        if (codeBlockMatch) code = codeBlockMatch[1];
        explanation = data.content.replace(/```[\s\S]*?```/g, '').trim();
      }

      setCodeLogs(`【分析完成】\n${explanation}`);
      setCodeEdits({
        id: `edit_${Date.now()}`,
        original: activeFile.content,
        proposed: code,
        prompt: `${action} (由 AI 生成)`,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
      });

    } catch (e) {
      console.error(e);
      setCodeLogs('【系統錯誤】連線失敗，請檢查 API 設定。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] rounded-3xl border border-[#7C5B8C]/15 shadow-sm overflow-hidden flex flex-col md:flex-row h-[900px] md:h-[820px]">
      
      {/* LEFT COMPANION & TAB SIDEBAR (Inspired by Image 1) */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#6D4E7B]/10 flex flex-col shrink-0 h-auto md:h-full font-sans">
        {/* Brand Banner */}
        <div className="p-5 border-b border-[#6D4E7B]/5 flex items-center gap-3 bg-[#FAF8F5]/30">
          <svg className="w-5 h-8 shrink-0 text-[#7C5B8C]" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 36C12 24, 12 12, 12 4" stroke="#4A6050" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="7" r="2.5" fill="#7C5B8C" />
            <circle cx="9.5" cy="13" r="2.3" fill="#8B5F9E" />
            <circle cx="14.5" cy="13" r="2.3" fill="#7C5B8C" />
            <circle cx="12" cy="19" r="2.3" fill="#A47EB3" />
            <circle cx="9.5" cy="25" r="2" fill="#8B5F9E" />
            <circle cx="14.5" cy="25" r="2" fill="#7C5B8C" />
            <circle cx="12" cy="30" r="1.5" fill="#A47EB3" />
          </svg>
          <div>
            <h2 className="text-[#372D3E] font-serif font-extrabold text-base leading-none flex items-center gap-1 tracking-wide">
              艾飛樂 AI 助理
            </h2>
            <span className="text-[10px] text-[#9A8AA6] font-sans tracking-wide block mt-1">
              Aifeiler AI Assistant
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setActiveSubTab('chat');
              createNewSession();
            }}
            className="w-full py-3 px-4 bg-[#828AB1] hover:bg-[#727AA1] text-white rounded-2xl text-sm font-sans font-bold transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>新對話</span>
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="px-3 space-y-1 py-1">
          {[
            { id: 'chat', label: '對話記錄', icon: History, color: 'text-[#828AB1]' },
            { id: 'favorites', label: '我的收藏', icon: Heart, color: 'text-[#E88B8B]' },
            { id: 'settings', label: '使用指南', icon: BookOpen, color: 'text-[#B29E6F]' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as SubTabType);
                  if (tab.id === 'chat' && sessions.length === 0) {
                    createNewSession();
                  }
                }}
                className={`w-full text-left py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-[#7C5B8C]/10 text-[#7C5B8C] font-bold' 
                    : 'text-[#5C4D66] hover:bg-[#FAF8F5] hover:text-[#372D3E]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  <span>{tab.label}</span>
                </div>
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#7C5B8C]" />}
              </button>
            );
          })}
        </div>

        {/* Recent Conversations Listing */}
        <div className="flex-1 overflow-y-auto px-4 mt-4 select-none">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#9A8AA6] tracking-wider mb-2">
            <span>最近對話</span>
          </div>
          
          <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
            {sessions.slice(0, 5).map((sess) => {
              const isActive = sess.id === activeSessionId && activeSubTab === 'chat';
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    setActiveSessionId(sess.id);
                    setActiveSubTab('chat');
                  }}
                  className={`group p-2.5 rounded-xl border border-transparent hover:bg-[#FAF8F5] flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    isActive ? 'bg-[#7C5B8C]/5 border-[#7C5B8C]/10' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className={`text-[11px] block truncate ${isActive ? 'font-bold text-[#7C5B8C]' : 'text-[#372D3E]'}`}>
                      {sess.messages[0]?.content || sess.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#9A8AA6] shrink-0 group-hover:hidden">
                    {sess.timestamp || '今天'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessions(prev => prev.filter(s => s.id !== sess.id));
                    }}
                    className="hidden group-hover:block text-[#9A8AA6] hover:text-rose-500 transition-colors"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            
            {sessions.length > 5 && (
              <button
                onClick={() => {
                  setActiveSubTab('history');
                }}
                className="w-full text-center text-[11px] text-[#7C5B8C] hover:underline font-bold py-2 block"
              >
                查看全部 &gt;
              </button>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-4 text-[10px] text-gray-400">
                目前尚無對話紀錄
              </div>
            )}
          </div>
        </div>

        {/* User Card (Ivy, level 3, points 2580) - matches Image 1 */}
        <div className="p-4 border-t border-[#6D4E7B]/10 bg-[#FAF8F5]/30">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={IMAGES.avatarIvy} 
              alt="Ivy" 
              className="w-10 h-10 rounded-full object-cover border border-[#7C5B8C]/20 shadow-sm" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-[#372D3E] text-xs">Ivy 艾飛樂</span>
                <span className="bg-[#FAF0E6] text-[#A0522D] text-[9px] px-1.5 py-0.5 rounded-sm font-bold scale-90 origin-left">創辦人</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#9A8AA6] mt-0.5 font-sans">
                <span>會員等級</span>
                <span className="font-bold text-[#7C5B8C]">靈感旅人 Lv.3</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-[#5C4D66] font-semibold">
              <span>探索積分 ⭐ 2,580</span>
            </div>
            
            {/* Custom purple level bar */}
            <div className="w-full bg-[#E5E5EB] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#828AB1] h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Bottom quick utility icons matching bottom left icons in screenshot */}
          <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-3 text-gray-400">
            <button 
              onClick={() => setActiveSubTab('settings')}
              className={`hover:text-[#7C5B8C] transition-colors p-1 ${activeSubTab === 'settings' ? 'text-[#7C5B8C]' : ''}`}
              title="API 設定"
            >
              <SettingsIcon className="w-4 h-4 stroke-[2]" />
            </button>
            <button 
              onClick={() => setActiveSubTab('settings')}
              className={`hover:text-[#7C5B8C] transition-colors p-1 ${activeSubTab === 'settings' ? 'text-[#7C5B8C]' : ''}`}
              title="使用指南"
            >
              <BookOpen className="w-4 h-4 stroke-[2]" />
            </button>
            <button 
              onClick={() => setActiveSubTab('agents')}
              className={`hover:text-[#7C5B8C] transition-colors p-1 ${activeSubTab === 'agents' ? 'text-[#7C5B8C]' : ''}`}
              title="AI Agent 任務控制中心"
            >
              <Cpu className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>

      {/* CENTRAL INTERACTIVE PANEL */}
      <div className="flex-1 flex flex-col bg-[#FAF8F5] min-w-0 h-full">
        
        {/* SUBTAB CONTENT PORTALS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
          <AnimatePresence mode="wait">
            
            {/* 1. CHAT TAB */}
            {activeSubTab === 'chat' && (
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                {activeSession.messages.length === 0 ? (
                  // Welcomes card (Inspired by Image 1)
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-6xl mx-auto items-start py-2 select-none">
                    {/* LEFT COLUMN: Hero Banner + Suggestion Grid */}
                    <div className="lg:col-span-8 space-y-6">
                      
                      {/* Top Welcome Card with homeHeroBg and exact handwriting/serif text */}
                      <div className="bg-white border border-[#7C5B8C]/12 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative shadow-xs overflow-hidden h-[240px] md:h-[200px]">
                        {/* Overlay text content */}
                        <div className="flex-1 z-10 text-left space-y-3">
                          <span className="text-sm bg-[#FAF0E6] text-[#A0522D] px-3.5 py-1 rounded-full font-bold scale-95 inline-block">
                            ❤️ 讓 AI 陪你一起探索、思考、成長 ✨
                          </span>
                          <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-[#372D3E] tracking-tight leading-tight">
                            下午好，Ivy 🌸
                          </h1>
                          <h2 className="text-xl md:text-2xl font-serif font-medium text-[#7C5B8C]">
                            今天想聊些什麼呢？ ♡
                          </h2>
                          <p className="text-sm md:text-base text-[#5C4D66] font-medium leading-relaxed max-w-md">
                            讓艾飛樂的 AI 助理陪你一起探索、思考與成長，找到屬於你的答案。我們今天有 {activeCharacter} 與你相伴喔！✨
                          </p>
                        </div>
                        
                        {/* Mascot Desk Illustration background cover on the right */}
                        <div className="absolute right-0 bottom-0 top-0 w-1/3 md:w-2/5 opacity-20 md:opacity-100 z-0">
                          <img 
                            src={IMAGES.homeHeroBg} 
                            alt="Aifeiler Mascot" 
                            className="w-full h-full object-cover object-left-bottom"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                        </div>
                      </div>

                      {/* "你可以試著問我..." section header */}
                      <div className="text-left">
                        <span className="text-sm font-bold text-[#9A8AA6] tracking-widest block mb-4 uppercase">
                          ✨ 你可以試著問我...
                        </span>
                        
                        {/* 4x2 grid of custom styled suggestions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { text: '我最近總是很焦慮，該怎麼調整？', icon: '💖', bg: 'bg-rose-50/70 hover:bg-rose-100/70 border-rose-100/60 text-rose-800' },
                            { text: '他對我的真實想法是什麼？', icon: '🌸', bg: 'bg-pink-50/70 hover:bg-pink-100/70 border-pink-100/60 text-pink-800' },
                            { text: '給我今天的塔羅指引', icon: '🃏', bg: 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-100/60 text-amber-800' },
                            { text: '幫我寫一句療癒語錄', icon: '✒️', bg: 'bg-purple-50/70 hover:bg-purple-100/70 border-purple-100/60 text-purple-800' },
                            { text: '我適合創業嗎？', icon: '💡', bg: 'bg-yellow-50/70 hover:bg-yellow-100/70 border-yellow-100/60 text-yellow-800' },
                            { text: '如何提升自己的自信？', icon: '🌿', bg: 'bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-100/60 text-emerald-800' },
                            { text: '我們的關係會有結果嗎？', icon: '🌾', bg: 'bg-indigo-50/70 hover:bg-indigo-100/70 border-indigo-100/60 text-indigo-800' },
                            { text: '分析我的情緒狀態', icon: '🌙', bg: 'bg-sky-50/70 hover:bg-sky-100/70 border-sky-100/60 text-sky-800' }
                          ].map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setInputMessage(q.text);
                                handleSendMessage(q.text);
                              }}
                              className={`border rounded-2xl p-5 text-left text-sm md:text-base font-semibold transition-all hover:shadow-sm cursor-pointer flex items-center gap-3.5 group ${q.bg}`}
                            >
                              <span className="text-lg group-hover:scale-110 transition-transform shrink-0">{q.icon}</span>
                              <span className="truncate flex-1">{q.text}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Info Cards & Hot Actions */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Card 1: Today's Quote Carousel */}
                      <div className="bg-white border border-[#7C5B8C]/12 rounded-3xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between h-[180px]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-serif font-extrabold text-[#7C5B8C] flex items-center gap-1.5">
                            ⭐ 今日靈感語錄
                          </span>
                          
                          {/* Carousel Controls */}
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setCurrentQuoteIndex(prev => (prev - 1 + 5) % 5)}
                              className="p-1 hover:bg-[#FAF8F5] rounded-lg text-gray-400 hover:text-[#7C5B8C] transition-colors"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setCurrentQuoteIndex(prev => (prev + 1) % 5)}
                              className="p-1 hover:bg-[#FAF8F5] rounded-lg text-gray-400 hover:text-[#7C5B8C] transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Quote Body */}
                        <div className="flex-1 flex items-center justify-center py-2 px-1 text-center">
                          <p className="text-[13px] font-serif font-medium text-[#372D3E] italic leading-relaxed">
                            「 {[
                              "你不需要成為更好的別人，你只需要成為更喜歡自己的自己。",
                              "生命不是等待暴風雨過去，而是學會在雨中跳舞。",
                              "溫柔地對待自己，你正在以自己的步調，綻放成最美的樣子。",
                              "允許自己偶爾不完美，因為裂縫正是光照進來的地方。",
                              "所有的相遇都是有意義的，即便是路過，也是溫暖的點綴。"
                            ][currentQuoteIndex]} 」
                          </p>
                        </div>

                        {/* Card Footer: Page Indicator & Decorative heart */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <div 
                                key={i} 
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  i === currentQuoteIndex ? 'bg-[#7C5B8C] w-3' : 'bg-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-rose-400 font-serif font-bold">♥ Aifeiler Care</span>
                        </div>
                      </div>

                      {/* Card 2: AI Assistant Intro */}
                      <div className="bg-white border border-[#7C5B8C]/12 rounded-3xl p-5 shadow-xs">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                          <span className="text-xs font-serif font-extrabold text-[#372D3E] flex items-center gap-1.5">
                            👤 AI 助理小艾
                          </span>
                        </div>

                        <div className="flex items-center gap-3.5 text-left">
                          <img 
                            src={IMAGES.avatarXiaoi} 
                            alt="小艾" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-[#7C5B8C]/15 shadow-sm"
                          />
                          <div className="text-left">
                            <span className="text-xs font-serif font-bold text-[#372D3E] block">助理角色：小艾 (Xiaoi)</span>
                            <span className="text-[10px] text-[#5C4D66] block mt-1 leading-relaxed">
                              溫柔陪伴・傾聽理解<br />用心回應每一個你的心靈問題 🌿
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Hot Features Navigation */}
                      <div className="bg-white border border-[#7C5B8C]/12 rounded-3xl p-5 shadow-xs text-left">
                        <span className="text-xs font-serif font-extrabold text-[#372D3E] block mb-3.5 pb-2 border-b border-gray-100">
                          🔮 熱門功能快捷鍵
                        </span>
                        
                        <div className="space-y-1.5">
                          {[
                            { name: '塔羅占卜', desc: '傾聽你潛意識中的智慧引導', tab: 'interactive-games', icon: '🃏' },
                            { name: '心理測驗', desc: '探索內心世界與人格特質', tab: 'reflection-lab', icon: '🌸' },
                            { name: '療癒語錄', desc: '寫下一句屬於你的心靈金句', tab: 'quote-map', icon: '✒️' },
                            { name: '互動故事', desc: '體驗小夥伴的專屬心靈劇場', tab: 'character-stories', icon: '🎭' },
                            { name: '創作助手', desc: '梳理你的成長筆記與生活靈感', tab: 'growth-journal', icon: '🌾' }
                          ].map((f, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('aifeiler-change-tab', { detail: f.tab }));
                              }}
                              className="w-full p-3.5 hover:bg-[#FAF8F5] border border-transparent hover:border-[#7C5B8C]/10 rounded-xl transition-all text-left flex items-center gap-3.5 cursor-pointer group"
                            >
                              <span className="text-lg group-hover:scale-110 transition-transform shrink-0">{f.icon}</span>
                              <div className="min-w-0">
                                <span className="text-sm font-bold text-[#372D3E] block group-hover:text-[#7C5B8C] transition-colors">{f.name}</span>
                                <span className="text-xs text-[#9A8AA6] block truncate">{f.desc}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#7C5B8C] transition-colors ml-auto shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Decorative Lavender Illustration at the bottom right */}
                      <div className="flex justify-center pt-2 opacity-60">
                        <svg className="w-20 h-28 text-[#7C5B8C]" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 140 C50 90, 50 40, 50 10" stroke="#4A6050" strokeWidth="2" strokeLinecap="round" />
                          <path d="M50 110 Q35 100, 20 115" stroke="#4A6050" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M50 85 Q65 75, 80 90" stroke="#4A6050" strokeWidth="1.5" strokeLinecap="round" />
                          {/* Flower buds */}
                          <ellipse cx="50" cy="15" rx="5" ry="8" fill="#7C5B8C" />
                          <ellipse cx="44" cy="28" rx="4" ry="7" fill="#8B5F9E" />
                          <ellipse cx="56" cy="28" rx="4" ry="7" fill="#7C5B8C" />
                          <ellipse cx="50" cy="40" rx="5" ry="8" fill="#A47EB3" />
                          <ellipse cx="42" cy="55" rx="4" ry="7" fill="#8B5F9E" />
                          <ellipse cx="58" cy="55" rx="4" ry="7" fill="#7C5B8C" />
                          <ellipse cx="50" cy="70" rx="5" ry="8" fill="#A47EB3" />
                          <ellipse cx="44" cy="85" rx="4" ry="7" fill="#8B5F9E" />
                          <ellipse cx="56" cy="85" rx="4" ry="7" fill="#7C5B8C" />
                          <ellipse cx="50" cy="100" rx="4" ry="7" fill="#A47EB3" />
                        </svg>
                      </div>

                    </div>
                  </div>
                ) : (
                  // Dialog stream messages
                  <div className="flex-1 space-y-5 mb-4">
                    {activeSession.messages.map((msg, idx) => (
                      <div 
                        key={msg.id || idx}
                        className={`flex items-start gap-3.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div className="shrink-0">
                          {msg.role === 'user' ? (
                            <div className="w-9 h-9 rounded-full bg-[#7C5B8C]/10 border border-[#7C5B8C]/35 flex items-center justify-center font-serif text-sm font-bold text-[#7C5B8C]">
                              旅
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#FAF0E6] border border-[#7C5B8C]/15 flex items-center justify-center font-serif text-sm font-bold text-[#7C5B8C]">
                              {activeCharacter[1]}
                            </div>
                          )}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`max-w-[80%] rounded-2xl p-4 md:p-5 text-sm md:text-base shadow-xs relative leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#7C5B8C] text-white rounded-tr-none font-medium'
                            : 'bg-white border border-[#7C5B8C]/12 text-[#372D3E] rounded-tl-none'
                        }`}>
                          
                          {/* Image preview in chat bubble */}
                          {msg.imageUrls && msg.imageUrls.map((url, i) => (
                            <img 
                              key={i} 
                              src={url} 
                              alt="attached input" 
                              className="max-w-xs rounded-lg mb-2.5 border border-slate-200" 
                              referrerPolicy="no-referrer"
                            />
                          ))}
                          
                          {/* Doc attached indicator */}
                          {msg.docInfo && (
                            <div className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl mb-2.5 text-[#5C4D66]">
                              <FileText className="w-5 h-5 text-emerald-500" />
                              <div className="text-xs">
                                <span className="font-bold block">{msg.docInfo.name}</span>
                                <span className="text-[10px] text-gray-400">{msg.docInfo.size}</span>
                              </div>
                            </div>
                          )}

                          {/* Fallback Warning block */}
                          {msg.fallback && (
                            <div className="mb-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-800 leading-normal flex items-start gap-2 font-sans font-medium">
                              <span className="shrink-0">⚠️</span>
                              <span>由於「{msg.originalModel || '選定模型'}」未配置或逾時，系統自動無縫為您備援切換至「{msg.provider}」({msg.model})。</span>
                            </div>
                          )}

                          {/* Message Body Text */}
                          <div className="whitespace-pre-wrap leading-relaxed select-text">{msg.content}</div>

                          {/* Search citation cards */}
                          {msg.citations && msg.citations.length > 0 && (
                            <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-2.5">
                              <span className="text-xs font-bold text-slate-400 tracking-wide block">🌾 即時搜尋參考來源：</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {msg.citations.map((cite, cIdx) => (
                                  <a 
                                    key={cIdx}
                                    href={cite.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border border-[#7C5B8C]/10 hover:border-[#7C5B8C]/30 rounded-xl p-2.5 flex flex-col gap-1.5 transition-all"
                                  >
                                    <span className="font-bold text-[#372D3E] truncate hover:text-[#7C5B8C] text-xs md:text-sm">{cite.title}</span>
                                    <div className="flex items-center justify-between text-[10px] text-gray-400">
                                      <span>{cite.siteName}</span>
                                      {cite.date && <span>{cite.date}</span>}
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Controls (Favorites, Share, Copy) */}
                          <div className={`mt-3 flex items-center gap-2.5 text-xs ${msg.role === 'user' ? 'text-purple-200 justify-end' : 'text-slate-400'}`}>
                            {msg.latencyMs && (
                              <span className="font-mono">{msg.provider} ({msg.latencyMs}ms)</span>
                            )}
                            <button 
                              onClick={() => handleToggleFavorite(msg)}
                              className="hover:text-pink-500 transition-colors cursor-pointer p-0.5"
                              title="收藏此回答"
                            >
                              <Heart className={`w-4 h-4 ${favorites.some(f => f.id === msg.id) ? 'fill-pink-500 text-pink-500' : ''}`} />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(msg.content);
                                alert('已複製到剪貼簿！🌸');
                              }}
                              className="hover:text-indigo-500 transition-colors cursor-pointer p-0.5"
                              title="複製文字"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Pending generation shimmer effect */}
                    {isGenerating && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center font-bold font-serif text-[#7C5B8C] animate-pulse">
                          {activeCharacter[1]}
                        </div>
                        <div className="bg-white border border-[#7C5B8C]/10 rounded-2xl rounded-tl-none p-4 w-40 space-y-2">
                          <div className="h-2.5 bg-slate-200 rounded-full w-24 animate-pulse" />
                          <div className="h-2 bg-slate-100 rounded-full w-32 animate-pulse" />
                          <div className="h-2 bg-slate-100 rounded-full w-20 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. IMAGES GENERATION TAB */}
            {activeSubTab === 'images' && (
              <motion.div
                key="images-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-[#372D3E] text-base mb-2 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-500" />
                    艾飛樂繪圖工坊 (Image Generator)
                  </h3>
                  <p className="text-xs text-[#5C4D66] mb-5">
                    結合 Gemini 3.1 高畫質圖片引擎，為你調配充滿水彩繪本風格的療癒插畫。🌸
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Image Controls Panel */}
                    <div className="space-y-4">
                      {/* Prompt */}
                      <div>
                        <label className="block text-xs font-bold text-[#5C4D66] mb-1.5">🌟 繪圖提示詞 (Prompt)</label>
                        <textarea
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                          placeholder="例如：小艾抱著一隻小藍鳥坐在溫暖的書桌前寫日記，周圍有薰衣草和柔和的星光..."
                          className="w-full bg-white border border-[#7C5B8C]/25 rounded-2xl p-3 text-xs focus:ring-1 focus:ring-[#7C5B8C] focus:outline-none h-24"
                        />
                      </div>

                      {/* Negative Prompt */}
                      <div>
                        <label className="block text-xs font-bold text-[#5C4D66] mb-1.5">🚫 負面提示詞 (Negative Prompt)</label>
                        <input
                          type="text"
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="例如：科技感、深黑背景、不自然光線、日系動漫寫實"
                          className="w-full bg-white border border-[#7C5B8C]/25 rounded-xl px-3 py-2 text-xs focus:outline-none"
                        />
                      </div>

                      {/* Grid settings */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#5C4D66] mb-1.5">📐 圖片比例</label>
                          <select
                            value={imageRatio}
                            onChange={(e) => setImageRatio(e.target.value)}
                            className="w-full bg-white border border-[#7C5B8C]/25 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="1:1">1:1 正方形 (Default)</option>
                            <option value="9:16">9:16 直幅 (手機壁紙)</option>
                            <option value="16:9">16:9 橫幅 (電腦版面)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#5C4D66] mb-1.5">🎨 藝術風格</label>
                          <select
                            value={imageStyle}
                            onChange={(e) => setImageStyle(e.target.value)}
                            className="w-full bg-white border border-[#7C5B8C]/25 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="艾飛樂水彩">🌸 艾飛樂水彩 (推薦)</option>
                            <option value="文青療癒">🌿 文青療癒</option>
                            <option value="夜空夢幻">🌙 夜空夢幻</option>
                            <option value="日系插畫">🎌 日系插畫</option>
                            <option value="寫實攝影">📷 寫實攝影</option>
                            <option value="品牌網站 UI">💻 品牌網站 UI</option>
                          </select>
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex flex-col gap-2 pt-2">
                        <label className="flex items-center gap-2 text-xs font-medium text-[#5C4D66] cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={brandColor} 
                            onChange={(e) => setBrandColor(e.target.checked)}
                            className="rounded text-[#7C5B8C]" 
                          />
                          <span>套用艾飛樂品牌專屬色系（奶油、淡粉、薰衣草紫）</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-medium text-[#5C4D66] cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={charConsistency} 
                            onChange={(e) => setCharConsistency(e.target.checked)}
                            className="rounded text-[#7C5B8C]" 
                          />
                          <span>開啟角色一致性（鎖定小艾藍辮草帽 IP）</span>
                        </label>
                      </div>

                      {/* Action */}
                      <button
                        onClick={handleGenerateImage}
                        disabled={!imagePrompt.trim()}
                        className="w-full py-2.5 bg-[#7C5B8C] hover:bg-[#6D4E7B] disabled:opacity-50 text-white rounded-2xl text-xs font-bold font-serif transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span>調配並生成精緻插圖 (耗 5 探索積分)</span>
                      </button>
                    </div>

                    {/* Preview / Status Box */}
                    <div className="border border-dashed border-[#7C5B8C]/20 rounded-2xl p-4 flex flex-col items-center justify-center bg-[#FAF8F5]/40 min-h-[250px]">
                      {imageHistory.length === 0 ? (
                        <div className="text-center space-y-2 p-6">
                          <ImageIcon className="w-12 h-12 text-[#9A8AA6] mx-auto opacity-40 animate-pulse" />
                          <span className="font-serif font-bold text-xs text-[#5C4D66] block">繪圖預覽區</span>
                          <span className="text-[11px] text-gray-400 block max-w-[200px] mx-auto">
                            輸入提示詞並點擊生成，您的水彩手繪畫作將會呈現在這裡。
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider mb-2 block">✨ 最新手繪成果：</span>
                          
                          {imageHistory[0].url === 'LOADING' ? (
                            <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-12">
                              <RefreshCw className="w-8 h-8 text-[#7C5B8C] animate-spin" />
                              <span className="text-xs text-[#7C5B8C] font-serif font-bold animate-pulse">正在精細描繪水彩纖維紙張...</span>
                            </div>
                          ) : imageHistory[0].url === 'ERROR' ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 p-4">
                              <AlertCircle className="w-8 h-8 text-rose-500" />
                              <span className="text-xs font-bold text-rose-600 font-serif">{imageHistory[0].prompt}</span>
                              <span className="text-[10px] text-gray-400">請至 設定 頁面或檢查 API Key 是否啟用。</span>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <img 
                                src={imageHistory[0].url} 
                                alt="Result" 
                                className="w-full max-h-[300px] object-contain rounded-2xl border border-slate-100 shadow-sm bg-white" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] text-[#5C4D66] italic truncate max-w-[70%]">「{imageHistory[0].prompt}」</span>
                                <div className="flex gap-2">
                                  <a 
                                    href={imageHistory[0].url} 
                                    download={`aifeiler_${Date.now()}.png`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#7C5B8C] shadow-xs cursor-pointer"
                                    title="下載高畫質"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </a>
                                  <button 
                                    onClick={() => {
                                      setImageHistory(prev => prev.map((rec, idx) => idx === 0 ? { ...rec, favorite: !rec.favorite } : rec));
                                      alert('已加入繪圖收藏庫！🌸');
                                    }}
                                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-pink-500 shadow-xs cursor-pointer"
                                    title="收藏此作"
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${imageHistory[0].favorite ? 'fill-pink-500 text-pink-500' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. SEARCH GROUNDING TAB */}
            {activeSubTab === 'search' && (
              <motion.div
                key="search-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-[#372D3E] text-base mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-emerald-500" />
                    艾飛樂智慧搜尋 (Search Grounding)
                  </h3>
                  <p className="text-xs text-[#5C4D66] mb-5">
                    結合真實 Google 搜尋工具。由模型進行安全合規檢索與資料整理，自動輸出含有真實出處的卡片，絕不編造假訊息。
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (setIsSearchToggled(true), handleSendMessage())}
                        placeholder="輸入您想要檢索的時事或深度學術議題..."
                        className="flex-1 bg-white border border-[#7C5B8C]/25 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C5B8C]"
                      />
                      <button
                        onClick={() => {
                          setIsSearchToggled(true);
                          handleSendMessage();
                        }}
                        className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Search className="w-4 h-4" />
                        <span>執行檢索</span>
                      </button>
                    </div>

                    {/* Search Instruction */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs text-emerald-800 leading-relaxed space-y-1">
                      <span className="font-bold block flex items-center gap-1.5 text-emerald-900">
                        🌱 真實網路搜尋流程指引
                      </span>
                      <span>1. 打開搜尋開關並輸入時事問題（如：2026年熱門舒緩香草茶研究）。</span>
                      <span>2. 系統呼叫後端 Google Grounding 安全通道。</span>
                      <span>3. 擷取最新網站出處與摘要，並由 Aifeiler 進行溫柔文字轉化。</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. CODE WORKSPACE TAB */}
            {activeSubTab === 'code' && (
              <motion.div
                key="code-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[620px] items-stretch"
              >
                {/* Left File Tree (Spans 3 cols) */}
                <div className="lg:col-span-3 bg-white/90 border border-[#7C5B8C]/12 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <span className="text-xs font-serif font-extrabold text-[#372D3E]">📁 檔案樹 (Files)</span>
                      <button 
                        onClick={() => {
                          const name = prompt('請輸入新檔案名稱：');
                          if (name) {
                            const newF = { id: `f_${Date.now()}`, name, content: `// File: ${name}\n\n`, language: 'typescript' };
                            setCodeFiles(prev => [...prev, newF]);
                            setActiveFileId(newF.id);
                          }
                        }}
                        className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                        title="新增檔案"
                      >
                        <FolderPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Files list */}
                    <div className="space-y-1">
                      {codeFiles.map((file) => (
                        <div 
                          key={file.id}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer ${
                            activeFileId === file.id 
                              ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200/50' 
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                          onClick={() => setActiveFileId(file.id)}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <File className={`w-3.5 h-3.5 ${activeFileId === file.id ? 'text-amber-600' : 'text-slate-400'}`} />
                            <span className="truncate">{file.name}</span>
                          </div>
                          {codeFiles.length > 1 && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCodeFiles(prev => prev.filter(f => f.id !== file.id));
                                if (activeFileId === file.id) setActiveFileId(codeFiles[0].id);
                              }}
                              className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl text-[10px] text-amber-800 leading-normal">
                    <span className="font-bold block mb-1">💡 模擬沙盒聲明</span>
                    此處執行的 React DOM 均被安全包裝在沙盒虛擬解析器中，請放心進行各類測試。
                  </div>
                </div>

                {/* Middle Editor & output logs (Spans 6 cols) */}
                <div className="lg:col-span-6 flex flex-col gap-3">
                  {/* Code Editor */}
                  <div className="flex-1 bg-slate-900 text-slate-100 rounded-2xl overflow-hidden flex flex-col border border-slate-800">
                    <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">{codeFiles.find(f => f.id === activeFileId)?.name}</span>
                      <button
                        onClick={handleRunCode}
                        className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>執行 (Run)</span>
                      </button>
                    </div>

                    <textarea
                      value={codeFiles.find(f => f.id === activeFileId)?.content || ''}
                      onChange={(e) => setCodeFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: e.target.value } : f))}
                      className="flex-1 p-4 font-mono text-xs focus:outline-none bg-slate-900 text-emerald-400 resize-none leading-relaxed leading-5"
                    />
                  </div>

                  {/* Execution terminal logs */}
                  <div className="h-40 bg-slate-950 text-slate-300 font-mono text-[10px] p-3 rounded-2xl border border-slate-900 overflow-y-auto whitespace-pre-wrap leading-normal">
                    {codeLogs}
                  </div>
                </div>

                {/* Right AI Code Assistant Pane (Spans 3 cols) */}
                <div className="lg:col-span-3 bg-white/90 border border-[#7C5B8C]/12 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-serif font-extrabold text-[#372D3E] block border-b border-slate-100 pb-2">
                      🤖 AI 程式輔助 (Codex)
                    </span>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: '解釋代碼', act: 'explain' },
                        { label: '修復錯誤', act: 'debug' },
                        { label: '代碼重構', act: 'refactor' },
                        { label: '增加註解', act: 'comment' },
                        { label: '安全審查', act: 'audit' },
                        { label: '生成測試', act: 'test' }
                      ].map((item) => (
                        <button
                          key={item.act}
                          onClick={() => handleCodeAssistant(item.label)}
                          className="py-2 bg-[#FAF8F5] hover:bg-[#7C5B8C]/10 border border-[#7C5B8C]/15 rounded-xl text-[11px] font-medium text-[#5C4D66] text-center transition-all cursor-pointer hover:shadow-xs"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Diff edits preview if available */}
                    {codeEdits && (
                      <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                        <span className="text-[10px] font-bold text-amber-900 block flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          已偵測到 AI 代碼修改建議
                        </span>
                        <div className="flex justify-between gap-1 text-[10px]">
                          <button
                            onClick={() => {
                              setCodeFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: codeEdits.proposed } : f));
                              setCodeEdits(null);
                              setCodeLogs('【系統提示】已採納 AI 的代碼修改建議！🌸');
                            }}
                            className="flex-1 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold cursor-pointer"
                          >
                            接受建議
                          </button>
                          <button
                            onClick={() => setCodeEdits(null)}
                            className="flex-1 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded font-bold cursor-pointer"
                          >
                            拒絕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4">
                    <span className="text-[9px] text-[#9A8AA6] block text-center">Aifeiler Codex Engine v1.0</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. AGENT CENTER TAB */}
            {activeSubTab === 'agents' && (
              <motion.div
                key="agents-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-[#372D3E] text-base mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-purple-500" />
                    AI Agent 任務控制中心
                  </h3>
                  <p className="text-xs text-[#5C4D66] mb-5">
                    自主規劃多步驟任務。當您交付複雜目標（例如：整理薰衣草茶醫學報告、產出文宣、自動呼叫繪圖並封裝），AI 將拆解為具體工作流。
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={agentGoal}
                        onChange={(e) => setAgentGoal(e.target.value)}
                        placeholder="請交付一個複雜的多步驟任務目標..."
                        className="flex-1 bg-white border border-[#7C5B8C]/25 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C5B8C]"
                      />
                      <button
                        onClick={handleStartAgent}
                        disabled={agentRunning || !agentGoal.trim()}
                        className="py-2.5 px-5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <PlayCircle className="w-4 h-4 fill-white text-purple-600" />
                        <span>執行 Agent 任務</span>
                      </button>
                    </div>

                    {/* Step log visualizer */}
                    {agentSteps.length > 0 && (
                      <div className="space-y-3 border-t border-[#7C5B8C]/10 pt-4">
                        <span className="text-xs font-bold text-[#5C4D66] block">🤖 任務執行步驟日誌：</span>
                        <div className="space-y-2">
                          {agentSteps.map((step, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
                                step.status === 'running' 
                                  ? 'bg-purple-50 border-purple-200 text-purple-900 animate-pulse' 
                                  : 'bg-white border-slate-100 text-slate-700'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="font-bold flex items-center gap-2">
                                  {step.status === 'running' && <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />}
                                  {step.status === 'success' && <Check className="w-3.5 h-3.5 text-green-600" />}
                                  {step.title}
                                </span>
                                <p className="text-[10px] text-gray-400 pl-5">{step.detail}</p>
                              </div>
                              <div className="text-[9px] text-gray-400 self-end sm:self-center font-mono">
                                {step.source}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step Authorization Confirm dialog */}
                    {requiresConfirmation && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
                        <div className="flex items-start gap-2.5 text-xs text-amber-900">
                          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">{requiresConfirmation.title}</span>
                            <p className="mt-1 leading-relaxed">{requiresConfirmation.desc}</p>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            onClick={requiresConfirmation.action}
                            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl cursor-pointer shadow-sm"
                          >
                            同意授權
                          </button>
                          <button
                            onClick={() => {
                              setRequiresConfirmation(null);
                              setAgentRunning(false);
                            }}
                            className="px-4 py-1.5 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl cursor-pointer"
                          >
                            中止任務
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Agent output results markdown block */}
                    {agentOutput && (
                      <div className="p-5 bg-white border border-[#7C5B8C]/15 rounded-3xl space-y-3 shadow-inner">
                        <span className="text-xs font-serif font-extrabold text-[#7C5B8C] block">🌾 最終任務彙整報告：</span>
                        <div className="text-xs text-[#372D3E] whitespace-pre-wrap leading-relaxed">
                          {agentOutput}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(agentOutput);
                              alert('Agent 報告已複製到剪貼簿！🌸');
                            }}
                            className="py-1.5 px-4 border border-[#7C5B8C]/25 text-[#7C5B8C] font-serif font-bold rounded-xl text-[11px] hover:bg-[#7C5B8C]/5 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>複製最終成果</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. COMPARE MODELS TAB */}
            {activeSubTab === 'compare' && (
              <motion.div
                key="compare-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-[#372D3E] text-base mb-2 flex items-center gap-2">
                    <Columns className="w-5 h-5 text-sky-500" />
                    多模型回答比較 (Multi-Model Compare)
                  </h3>
                  <p className="text-xs text-[#5C4D66] mb-5">
                    輸入一個問題，系統將同步發送至 Gemini、OpenAI 與 Claude，三欄並排顯示，自動生成「綜合整理」區塊。
                  </p>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCompareMessage(inputMessage)}
                        placeholder="輸入您想發送給各大模型的測試問題..."
                        className="flex-1 bg-white border border-[#7C5B8C]/25 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C5B8C]"
                      />
                      <button
                        onClick={() => handleCompareMessage(inputMessage)}
                        className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer"
                      >
                        啟動多路比較
                      </button>
                    </div>

                    {/* Compare result columns */}
                    {activeSession.messages.some(m => m.compareResults) && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Column 1: Gemini */}
                          <div className="bg-white/95 border border-[#7C5B8C]/12 rounded-2xl p-4 shadow-xs space-y-2">
                            <span className="text-xs font-serif font-extrabold text-rose-700 block">🌸 Gemini 3.5-flash</span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {activeSession.messages.find(m => m.compareResults)?.compareResults?.gemini?.content}
                            </p>
                          </div>

                          {/* Column 2: OpenAI */}
                          <div className="bg-white/95 border border-[#7C5B8C]/12 rounded-2xl p-4 shadow-xs space-y-2">
                            <span className="text-xs font-serif font-extrabold text-indigo-700 block">🧠 OpenAI GPT-4o</span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {activeSession.messages.find(m => m.compareResults)?.compareResults?.openai?.content}
                            </p>
                          </div>

                          {/* Column 3: Claude */}
                          <div className="bg-white/95 border border-[#7C5B8C]/12 rounded-2xl p-4 shadow-xs space-y-2">
                            <span className="text-xs font-serif font-extrabold text-teal-700 block">🌿 Claude 3.5 Sonnet</span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {activeSession.messages.find(m => m.compareResults)?.compareResults?.claude?.content}
                            </p>
                          </div>
                        </div>

                        {/* Consolidated Synthesis Section */}
                        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2 text-xs text-amber-900 leading-relaxed shadow-xs">
                          {activeSession.messages.find(m => m.compareResults)?.compareResults?.synthesis}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. SETTINGS & CONNECTIONS TAB */}
            {activeSubTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 md:p-6 shadow-xs">
                  <h3 className="font-serif font-extrabold text-[#372D3E] text-base mb-2 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-slate-600" />
                    金鑰與連線設定 (API Connection Center)
                  </h3>
                  <p className="text-xs text-[#5C4D66] mb-5">
                    確認您的 AI API 供應商連線狀態。正式部署時，金鑰應由伺服器環境變數安全管理，瀏覽器絕不儲存金鑰。
                  </p>

                  <div className="space-y-4">
                    {[
                      { id: 'gemini', name: 'Google Gemini AI', provider: apiConfig.providers.gemini },
                      { id: 'openai', name: 'OpenAI API (gpt-4o)', provider: apiConfig.providers.openai },
                      { id: 'claude', name: 'Anthropic Claude AI', provider: apiConfig.providers.claude },
                      { id: 'search', name: 'Google Search API Grounding', provider: apiConfig.providers.search },
                      { id: 'image', name: 'Image API Generation', provider: apiConfig.providers.image }
                    ].map((row) => {
                      const isExpanded = editingProviderId === row.id;
                      return (
                        <div 
                          key={row.id}
                          className={`p-4 bg-white border rounded-2xl transition-all shadow-xs ${
                            isExpanded ? 'border-[#7C5B8C] ring-1 ring-[#7C5B8C]/15 bg-[#FAF8F5]/30' : 'border-[#7C5B8C]/12 hover:border-[#7C5B8C]/30'
                          }`}
                        >
                          {/* Row Header */}
                          <div 
                            onClick={() => setEditingProviderId(isExpanded ? null : row.id)}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="space-y-1">
                              <span className="text-xs font-serif font-extrabold text-[#372D3E] flex items-center gap-1.5 hover:text-[#7C5B8C] transition-colors">
                                {row.name}
                                <span className="text-[10px] text-gray-400 font-normal">(點選設定 ⚙️)</span>
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span>狀態：{row.provider.connected ? '🟢 已連線' : '🔴 未連線'}</span>
                                {row.provider.lastFour && <span>(金鑰尾碼：{row.provider.lastFour})</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleTestConnection(row.id)}
                                disabled={testingStatus[row.id] === 'testing'}
                                className="py-1.5 px-4 bg-[#FAF8F5] hover:bg-[#7C5B8C]/10 border border-[#7C5B8C]/15 text-slate-700 rounded-xl text-xs font-serif font-bold cursor-pointer transition-all disabled:opacity-50"
                              >
                                {testingStatus[row.id] === 'testing' ? '連線中...' : '測試連線'}
                              </button>
                              <button
                                onClick={() => handleRemoveApiKey(row.id)}
                                className="py-1.5 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-serif cursor-pointer font-bold"
                              >
                                移除設定
                              </button>
                            </div>
                          </div>

                          {/* Expanded Config/Input Panel */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-dashed border-[#7C5B8C]/12 space-y-3">
                              <div className="text-[11px] font-bold text-[#5C4D66] flex items-center justify-between">
                                <span>設定您的 API 金鑰 (API Key)：</span>
                                <span className="text-[10px] text-gray-400 font-normal">金鑰將安全傳遞至伺服器</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type={showApiKey[row.id] ? "text" : "password"}
                                    value={inputApiKeys[row.id] ?? ''}
                                    onChange={(e) => setInputApiKeys(prev => ({ ...prev, [row.id]: e.target.value }))}
                                    placeholder={`請輸入您的 ${row.name} 金鑰...`}
                                    className="w-full bg-slate-50 border border-[#7C5B8C]/20 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#7C5B8C]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowApiKey(prev => ({ ...prev, [row.id]: !prev[row.id] }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 text-xs cursor-pointer font-semibold"
                                  >
                                    {showApiKey[row.id] ? '隱藏' : '顯示'}
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => handleSaveApiKey(row.id)}
                                  disabled={testingStatus[row.id] === 'testing'}
                                  className="py-2.5 px-4 bg-[#7C5B8C] hover:bg-[#6A4B7A] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
                                >
                                  {testingStatus[row.id] === 'testing' ? '儲存中...' : '儲存設定'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. HISTORY TAB */}
            {activeSubTab === 'history' && (
              <motion.div
                key="history-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 shadow-xs">
                  <span className="text-xs font-serif font-extrabold text-[#372D3E] block mb-4 border-b border-slate-100 pb-2">
                    對話紀錄歷史庫
                  </span>

                  <div className="space-y-2">
                    {sessions.map((sess) => (
                      <div 
                        key={sess.id}
                        className="p-3 bg-white hover:bg-[#FAF8F5] border border-[#7C5B8C]/10 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                        onClick={() => {
                          setActiveSessionId(sess.id);
                          setActiveSubTab('chat');
                        }}
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#372D3E] block truncate">{sess.title}</span>
                          <span className="text-[10px] text-gray-400 block mt-1">{sess.timestamp} ∙ 含有 {sess.messages.length} 條療癒對話</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessions(prev => prev.filter(s => s.id !== sess.id));
                          }}
                          className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 9. FAVORITES TAB */}
            {activeSubTab === 'favorites' && (
              <motion.div
                key="favorites-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-white/80 border border-[#7C5B8C]/15 rounded-3xl p-5 shadow-xs">
                  <span className="text-xs font-serif font-extrabold text-[#372D3E] block mb-4 border-b border-slate-100 pb-2">
                    我的心靈收藏庫 (Favorites)
                  </span>

                  {favorites.length === 0 ? (
                    <div className="text-center p-8 space-y-1">
                      <Heart className="w-10 h-10 text-rose-300 mx-auto fill-rose-50" />
                      <span className="text-xs text-[#5C4D66] block">收藏庫空空如也</span>
                      <span className="text-[10px] text-gray-400 block">在對話中，點擊小愛回答旁的愛心，金句便會呈現在這裡。</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {favorites.map((fav, index) => (
                        <div key={index} className="p-4 bg-white border border-[#7C5B8C]/12 rounded-2xl space-y-2 shadow-xs relative">
                          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{fav.content}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                            <span>收藏時間：{fav.timestamp}</span>
                            <button 
                              onClick={() => setFavorites(prev => prev.filter(f => f.id !== fav.id))}
                              className="text-rose-600 font-bold hover:underline cursor-pointer"
                            >
                              移出收藏
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}


          </AnimatePresence>
        </div>

        {/* BOTTOM INTEGRATED INPUT AREA (Chat Subtab only) */}
        {activeSubTab === 'chat' && (
          <div className="p-4 bg-white border-t border-[#6D4E7B]/10">
            <div className="max-w-4xl mx-auto space-y-2.5">
              
              {/* Optional uploaded Image or Doc previews */}
              <div className="flex flex-wrap gap-2">
                {attachedImage && (
                  <div className="relative shrink-0 border border-[#7C5B8C]/15 rounded-xl overflow-hidden p-1 bg-slate-50">
                    <img 
                      src={attachedImage} 
                      alt="attached" 
                      className="w-12 h-12 object-cover rounded-lg" 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => setAttachedImage(null)}
                      className="absolute top-0 right-0 p-0.5 bg-slate-900/60 rounded-full text-white cursor-pointer hover:bg-slate-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {attachedDoc && (
                  <div className="relative shrink-0 border border-[#7C5B8C]/15 rounded-xl p-2 bg-slate-50 flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold max-w-[120px] truncate">{attachedDoc.name}</span>
                    <button 
                      onClick={() => setAttachedDoc(null)}
                      className="p-0.5 bg-slate-200 hover:bg-slate-300 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Input Toolbar controls */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* File Upload Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Image Input */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                      title="上傳影像做多模態分析"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />

                    {/* Doc Input */}
                    <button 
                      onClick={() => docInputRef.current?.click()}
                      className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all cursor-pointer"
                      title="上傳文件做文檔摘要"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={docInputRef} 
                      accept=".txt,.md,.json,.js,.ts" 
                      onChange={handleDocUpload} 
                      className="hidden" 
                    />
                  </div>

                  {/* Grounding switch */}
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 text-xs md:text-sm font-medium">
                    <input 
                      type="checkbox" 
                      checked={isSearchToggled} 
                      onChange={(e) => setIsSearchToggled(e.target.checked)}
                      className="rounded text-[#7C5B8C] w-4 h-4" 
                    />
                    <span>網路搜尋 (Search)</span>
                  </label>

                  {/* Agent switch */}
                  <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800 text-xs md:text-sm font-medium">
                    <input 
                      type="checkbox" 
                      checked={isAgentToggled} 
                      onChange={(e) => {
                        setIsAgentToggled(e.target.checked);
                        if (e.target.checked) setActiveSubTab('agents');
                      }}
                      className="rounded text-purple-600 w-4 h-4" 
                    />
                    <span className="text-purple-600 font-bold">Agent 模式</span>
                  </label>
                </div>

                {/* Model Selector Dropdown */}
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500">
                  <span>模型：</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                    className="bg-white border border-[#7C5B8C]/15 rounded-lg py-1.5 px-2.5 text-xs md:text-sm text-slate-700 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="auto">🤖 系統自動選擇 (Auto)</option>
                    <option value="gemini">🌸 Google Gemini (預設)</option>
                    <option value="openai">🧠 OpenAI GPT-4o (精準)</option>
                    <option value="claude">🌿 Anthropic Claude (詩意)</option>
                  </select>
                </div>
              </div>

              {/* Main chat typing box */}
              <div className="flex gap-2.5">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="輸入您的對話問題，或是透過左下角上傳圖片與文檔..."
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-[#7C5B8C]/15 focus:border-[#7C5B8C]/40 rounded-2xl pl-4 pr-12 py-3.5 text-sm md:text-base focus:outline-none transition-all"
                  />
                  
                  {/* Microphone */}
                  <button 
                    onClick={toggleRecording}
                    className={`absolute right-4 top-3 p-1.5 rounded-full cursor-pointer transition-colors ${
                      isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="用語音輸入內容"
                  >
                    {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                  </button>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() && !attachedImage}
                  className="py-3.5 px-6 bg-[#7C5B8C] hover:bg-[#6D4E7B] disabled:opacity-50 text-white rounded-2xl text-sm md:text-base font-serif font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                >
                  <Send className="w-4 h-4 fill-white text-[#7C5B8C]" />
                </button>
              </div>

              <div className="text-xs text-gray-400 text-center leading-relaxed">
                小艾會認真傾聽、溫柔陪伴，所有對話內容皆為嚴格加密，請安心分享您的心事。💛
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
