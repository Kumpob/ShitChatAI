export interface Message {
  sender: "user" | "ai";
  text: string;
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
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastActive: number;
}
