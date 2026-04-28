export interface AnkiAssistantSettings {
  openRouterApiKey: string;
  model: string;
}

export const DEFAULT_SETTINGS: AnkiAssistantSettings = {
  openRouterApiKey: '',
  model: 'moonshotai/kimi-k2.6',
};

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
