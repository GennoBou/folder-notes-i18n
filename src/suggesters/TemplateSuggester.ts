import { t } from 'src/i18n';
import { TFile, TFolder, Vault, AbstractInputSuggest, type TAbstractFile } from 'obsidian';
import type FolderNotesPlugin from '../main';
import { getTemplatePlugins } from 'src/template';

interface TemplateSuggestion {
	path: string;
	name: string;
	parent?: {
		path: string;
	} | null;
}

export enum FileSuggestMode {
	TemplateFiles,
	ScriptFiles,
}

export class TemplateSuggest extends AbstractInputSuggest<TemplateSuggestion> {
	constructor(
		public inputEl: HTMLInputElement,
		public plugin: FolderNotesPlugin,
	) {
		super(plugin.app, inputEl);
	}


	get_error_msg(mode: FileSuggestMode): string {
		switch (mode) {
			case FileSuggestMode.TemplateFiles:
				return t('Templates folder doesn t...#fbd051');
			case FileSuggestMode.ScriptFiles:
				return t('User Scripts folder does...#445e1b');
		}
	}

	getSuggestions(input_str: string): TemplateSuggestion[] {
		const { templateFolder, templaterPlugin } = getTemplatePlugins(this.app);

		let files: TemplateSuggestion[] = [];
		const lower_input_str = input_str.toLowerCase();

		if ((!templateFolder || templateFolder.trim() === '') && !templaterPlugin) {
			files = this.plugin.app.vault.getFiles().filter((file) =>
				file.path.toLowerCase().includes(lower_input_str),
			);
		} else {
			let folder: TFolder | TAbstractFile | null = null;
			if (templaterPlugin) {
				folder = this.plugin.app.vault.getAbstractFileByPath(
					(templaterPlugin as unknown as {
						plugin?: { settings?: { templates_folder?: string } }
					}).plugin?.settings?.templates_folder as string,
				);
				if (!(folder instanceof TFolder)) {
					return [
						{
							path: '',
							name:
								t('You need to set the Temp...#c494e8'),
						},
					];
				}
			} else if (templateFolder) {
				folder = this.plugin.app.vault.getAbstractFileByPath(templateFolder);
			}

			if (!(folder instanceof TFolder)) {
				return [];
			}

			Vault.recurseChildren(folder, (file: TAbstractFile) => {
				if (file instanceof TFile && file.path.toLowerCase().includes(lower_input_str)) {
					files.push(file);
				}
			});
		}

		return files;
	}


	renderSuggestion(file: TemplateSuggestion, el: HTMLElement): void {
		const { templateFolder, templaterPlugin } = getTemplatePlugins(this.app);

		if ((!templateFolder || templateFolder.trim() === '') && !templaterPlugin) {
			el.setText(`${file.parent?.path !== '/' ? file.parent?.path + '/' : ''}${file.name}`);
		} else {
			el.setText(file.name);
		}
	}


	selectSuggestion(file: TemplateSuggestion): void {
		this.inputEl.value = file.name.replace('.md', '');
		this.inputEl.trigger('input');
		this.plugin.settings.templatePath = file.path;
		void this.plugin.saveSettings();
		this.close();
	}
}
