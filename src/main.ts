import { Plugin } from 'obsidian';
import { AnkiAssistantSettings, DEFAULT_SETTINGS } from './types';
import { AnkiAssistantSettingTab } from './settingsTab';
import { generateAnkiCards } from './commands/generateAnkiCards';

export default class AnkiAssistantPlugin extends Plugin {
	settings: AnkiAssistantSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'generate-anki-cards',
			name: 'Generate Anki cards from current note',
			callback: () => generateAnkiCards(this),
		});

		this.addSettingTab(new AnkiAssistantSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
