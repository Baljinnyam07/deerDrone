// Inline type definitions for chatbot service
// Copied from @deer-drone/types to avoid workspace resolution issues on Vercel

export type LeadStatus = "new" | "qualified" | "contacted" | "closed";

export interface ChatCardProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  heroNote: string;
}

export interface ChatLead {
  id: string;
  name: string;
  phone: string;
  interest: string;
  status: LeadStatus;
  sourcePage: string;
  createdAt: string;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
  sourcePage?: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  cards?: ChatCardProduct[];
  lead?: Partial<ChatLead>;
  image?: string;
  quickReplies?: { title: string; payload: string }[];
}
