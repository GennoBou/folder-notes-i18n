import { t } from 'src/i18n';
import { AbstractInputSuggest, type TAbstractFile, TFile } from 'obsidian';
import type FolderNotesPlugin from '../main';
export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export class FileSuggest extends AbstractInputSuggest<TFile> {
	plugin: FolderNotesPlugin;

	constructor(
		public inputEl: HTMLInputElement,
		plugin: FolderNotesPlugin,
	) {
		super(plugin.app, inputEl);
		this.plugin = plugin;
	}

	get_error_msg(mode: FileSuggestMode): string {
		switch (mode) {
			case FileSuggestMode.TemplateFiles:
				return t('Templates folder doesn t...#fbd051');
			case FileSuggestMode.ScriptFiles:
				return t('User Scripts folder does...#445e1b');
		}
	}

	getSuggestions(input_str: string): TFile[] {
		const files: TFile[] = [];
		const lower_input_str = input_str.toLowerCase();

		this.plugin.app.vault.getFiles().forEach((file: TAbstractFile) => {
			if (
				file instanceof TFile &&
                file.path.toLowerCase().contains(lower_input_str)
			) {
				files.push(file);
			}
		});

		return files;
	}

	renderSuggestion(file: TFile, el: HTMLElement): void {
		el.setText(file.path);
	}

	selectSuggestion(file: TFile): void {
		this.inputEl.value = file.path;
		this.inputEl.trigger('input');
		this.close();
	}
}
