import { App, PluginSettingTab, Setting } from 'obsidian';
import type AnkiAssistantPlugin from './main';
import { saveSettings } from './settings';

export class AnkiAssistantSettingTab extends PluginSettingTab {
	plugin: AnkiAssistantPlugin;

	constructor(app: App, plugin: AnkiAssistantPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Anki Card Generator Settings' });

		new Setting(containerEl)
			.setName('OpenRouter API key')
			.setDesc('Enter your OpenRouter API key')
			.addText((text) =>
				text
					.setPlaceholder('sk-or-...')
					.setValue(this.plugin.settings.openRouterApiKey)
					.onChange(async (value) => {
						this.plugin.settings.openRouterApiKey = value;
						await saveSettings(this.plugin);
					})
			);

		new Setting(containerEl)
			.setName('Model')
			.setDesc('OpenRouter model ID (e.g., openai/gpt-4o, anthropic/claude-3.5-sonnet)')
			.addText((text) =>
				text
					.setPlaceholder('openai/gpt-4o-mini')
					.setValue(this.plugin.settings.model)
					.onChange(async (value) => {
						this.plugin.settings.model = value;
						await saveSettings(this.plugin);
					})
			);
	}
}
