import { OpenRouter } from '@openrouter/sdk';
import type { OpenRouterMessage } from '../types';

export class OpenRouterService {
	private client: OpenRouter;
	private model: string;

	constructor(apiKey: string, model: string) {
		this.client = new OpenRouter({ apiKey });
		this.model = model;
	}

	async generateCompletion(messages: OpenRouterMessage[]): Promise<string> {
		const response = await this.client.chat.send({
			model: this.model,
			messages: messages,
			stream: false,
		});

		const content = response.choices[0]?.message?.content;
		if (!content) {
			throw new Error('No response content from OpenRouter');
		}

		if (typeof content === 'string') {
			return content;
		}

		// Handle array content (multimodal response)
		const textContent = content.find((item) => item.type === 'text');
		if (textContent && 'text' in textContent) {
			return textContent.text;
		}

		throw new Error('Unexpected response format from OpenRouter');
	}
}
