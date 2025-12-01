export interface AnkiAssistantSettings {
	openRouterApiKey: string;
	model: string;
}

export const DEFAULT_SETTINGS: AnkiAssistantSettings = {
	openRouterApiKey: '',
	model: 'openai/gpt-4o-mini',
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
