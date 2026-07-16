export interface Companion {
  name: string;
  avatar: string;
  description: string;
  avatarColor: string;
  watercolorBg: string;
  role: string;
  traits: string[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface TarotCard {
  id: string;
  trait: '責任' | '勇氣' | '愛' | '利他';
  title: string;
}

export interface DivinationResult {
  title: string;
  quote: string;
  guidance: string;
  question: string;
}

export interface WoopResult {
  feedback: string;
  companionQuote: string;
}
