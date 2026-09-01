import { t } from 'src/i18n';
import { Modal, Setting, type App } from 'obsidian';
import type FolderNotesPlugin from '../../main';
import type { ExcludePattern } from 'src/ExcludeFolders/ExcludePattern';
import { refreshAllFolderStyles } from 'src/functions/styleFunctions';

export default class PatternSettings extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	pattern: ExcludePattern;
	constructor(app: App, plugin: FolderNotesPlugin, pattern: ExcludePattern) {
		super(app);
		this.plugin = plugin;
		this.app = app;
		this.pattern = pattern;
	}

	onOpen(): void {
		this.display();
	}

	display(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: t('Pattern settings') });

		new Setting(contentEl)
			.setName(t('Disable folder name sync'))

			.setDesc(t('Choose if the folder nam...#6b36d4'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.disableSync)
					.onChange(async (value) => {
						this.pattern.disableSync = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Disable auto creation of folder notes in this folder'))
			// eslint-disable-next-line max-len
			.setDesc(t('Choose if a folder note...#a3d427'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.disableAutoCreate)
					.onChange(async (value) => {
						this.pattern.disableAutoCreate = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Don t show folder in fol...#226a96'))
			.setDesc(t('Choose if the folder should be shown in the folder overview'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.excludeFromFolderOverview)
					.onChange(async (value) => {
						this.pattern.excludeFromFolderOverview = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Show folder note in the file explorer'))
			.setDesc(t('Choose if the folder not...#feca16'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.showFolderNote)
					.onChange(async (value) => {
						this.pattern.showFolderNote = value;
						await this.plugin.saveSettings();
						refreshAllFolderStyles(true, this.plugin);
						this.display();
					}),
			);

		new Setting(contentEl)
			.setName(t('Disable open folder note'))
			.setDesc(t('Choose if the folder not...#0d53ad'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.disableFolderNote)
					.onChange(async (value) => {
						this.pattern.disableFolderNote = value;
						await this.plugin.saveSettings(true);
						this.display();
					}),
			);

		if (!this.pattern.disableFolderNote) {
			new Setting(contentEl)
				.setName(t('Collapse folder when opening folder note'))
				.setDesc(t('Choose if the folder sho...#7f831f'))
				.addToggle((toggle) =>
					toggle
						.setValue(this.pattern.enableCollapsing)
						.onChange(async (value) => {
							this.pattern.enableCollapsing = value;
							await this.plugin.saveSettings();
						}),
				);
		}
	}

	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
