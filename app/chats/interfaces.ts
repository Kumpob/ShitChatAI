export interface Message {
  sender: "user" | "ai";
  text: string;
  thinking?: string;
  regeneratedResponses?: string[];
  regeneratedThinking?: string[];
  currentResponseIndex?: number;
}

export interface Character {
  id: string;
  name: string;
  alias?: string;
  personality: string;
  scenario: string;
  firstMessage?: string;
  chats: Chat[];
  thumbnail?: string;
  fullImage?: string;
  storyContent?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastActive: number;
}

export interface UserPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  fullImage: string;
  p1: string;
  p2: string;
  p3: string;
}

export interface ApiPreset {
  id: string;
  name: string;
  model: string;
  endpointUrl: string;
  apiKey: string;
}