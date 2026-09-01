import { t } from 'src/i18n';
// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes and https://github.com/SilentVoid13/Templater

import { AbstractInputSuggest, TFolder, type TAbstractFile } from 'obsidian';
import type FolderNotesPlugin from '../main';
export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export class FolderSuggest extends AbstractInputSuggest<TFolder> {
	plugin: FolderNotesPlugin;

	constructor(
		public inputEl: HTMLInputElement,
		plugin: FolderNotesPlugin,
		private whitelistSuggester: boolean,
		public folder?: TFolder,
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

	getSuggestions(input_str: string): TFolder[] {
		const folders: TFolder[] = [];
		const lower_input_str = input_str.toLowerCase();
		let files: TAbstractFile[] = [];
		if (this.folder) {
			files = this.folder.children;
		} else {
			const MAX_FILE_SUGGESTIONS = 100;
			files = this.plugin.app.vault.getAllLoadedFiles().slice(0, MAX_FILE_SUGGESTIONS);
		}
		files.forEach((folder: TAbstractFile) => {
			if (
				folder instanceof TFolder &&
				folder.path.toLowerCase().contains(lower_input_str) &&
				(
					!this.plugin.settings.excludeFolders.find(
						(f) => f.path === folder.path,
					) || this.whitelistSuggester
				)
			) {
				folders.push(folder);
			}
		});

		return folders;
	}

	renderSuggestion(folder: TFolder, el: HTMLElement): void {
		el.setText(folder.path);
	}

	selectSuggestion(folder: TFolder): void {
		this.inputEl.value = folder.path;
		this.inputEl.trigger('input');
		this.close();
	}
}
