import { AnkiAssistantSettings, DEFAULT_SETTINGS } from './types';
import type AnkiAssistantPlugin from './main';

export async function loadSettings(plugin: AnkiAssistantPlugin): Promise<AnkiAssistantSettings> {
	return Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
}

export async function saveSettings(plugin: AnkiAssistantPlugin): Promise<void> {
	await plugin.saveData(plugin.settings);
}
