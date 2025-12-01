import { MarkdownView, Notice, TFile } from 'obsidian';
import type AnkiAssistantPlugin from '../main';
import { OpenRouterService } from '../services/openRouterService';
import { ANKI_SYSTEM_PROMPT, createUserPrompt } from '../prompts/ankiPrompt';

export async function generateAnkiCards(plugin: AnkiAssistantPlugin): Promise<void> {
	const { settings, app } = plugin;

	// Validate API key
	if (!settings.openRouterApiKey) {
		new Notice('Please set your OpenRouter API key in settings');
		return;
	}

	// Get active file
	const activeView = app.workspace.getActiveViewOfType(MarkdownView);
	if (!activeView) {
		new Notice('No active markdown file');
		return;
	}

	const activeFile = activeView.file;
	if (!activeFile) {
		new Notice('No file is currently open');
		return;
	}

	// Get file content
	const content = await app.vault.read(activeFile);
	if (!content.trim()) {
		new Notice('The current file is empty');
		return;
	}

	const filename = activeFile.basename;

	new Notice('Generating Anki cards...');

	try {
		// Call OpenRouter API
		const openRouter = new OpenRouterService(settings.openRouterApiKey, settings.model);
		const response = await openRouter.generateCompletion([
			{ role: 'system', content: ANKI_SYSTEM_PROMPT },
			{ role: 'user', content: createUserPrompt(content, filename) },
		]);

		// Create output file
		const outputFilename = `anki-${filename}.md`;
		const outputPath = getOutputPath(activeFile, outputFilename);

		// Check if file already exists
		const existingFile = app.vault.getAbstractFileByPath(outputPath);
		if (existingFile instanceof TFile) {
			await app.vault.modify(existingFile, response);
		} else {
			await app.vault.create(outputPath, response);
		}

		new Notice(`Anki cards saved to ${outputFilename}`);

		// Open the created file
		const createdFile = app.vault.getAbstractFileByPath(outputPath);
		if (createdFile instanceof TFile) {
			await app.workspace.getLeaf(false).openFile(createdFile);
		}
	} catch (error) {
		console.error('Error generating Anki cards:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		new Notice(`Error: ${errorMessage}`);
	}
}

function getOutputPath(sourceFile: TFile, outputFilename: string): string {
	const parentPath = sourceFile.parent?.path;
	if (parentPath && parentPath !== '/') {
		return `${parentPath}/${outputFilename}`;
	}
	return outputFilename;
}
