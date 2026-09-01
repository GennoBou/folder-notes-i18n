import { t } from 'src/i18n';
import { Modal, Setting, type App } from 'obsidian';
import type FolderNotesPlugin from '../../main';
import type { WhitelistedPattern } from '../WhitelistPattern';

export default class WhitelistPatternSettings extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	pattern: WhitelistedPattern;
	constructor(app: App, plugin: FolderNotesPlugin, pattern: WhitelistedPattern) {
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
		contentEl.createEl('h2', { text: t('Whitelisted pattern settings') });
		new Setting(contentEl)
			.setName(t('Enable folder name sync'))

			.setDesc(t('Choose if the name of a...#a6011f'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.enableSync)
					.onChange(async (value) => {
						this.pattern.enableSync = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Allow auto creation of folder notes in this folder'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.enableAutoCreate)
					.onChange(async (value) => {
						this.pattern.enableAutoCreate = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Show folder in folder overview'))
			.setDesc(t('Choose if the folder should be shown in the folder overview'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.showInFolderOverview)
					.onChange(async (value) => {
						this.pattern.showInFolderOverview = value;
						await this.plugin.saveSettings();
					}),
			);


		new Setting(contentEl)
			.setName(t('Open folder note when clicking on the folder'))
			.setDesc(t('Choose if the folder not...#c4cbe4'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.pattern.enableFolderNote)
					.onChange(async (value) => {
						this.pattern.enableFolderNote = value;
						await this.plugin.saveSettings(true);
						this.display();
					}),
			);

		if (this.pattern.enableFolderNote) {
			new Setting(contentEl)
				.setName(t('Don t collapse folder wh...#ede31a'))
				.setDesc(t('Choose if the folder sho...#7f831f'))
				.addToggle((toggle) =>
					toggle
						.setValue(this.pattern.disableCollapsing)
						.onChange(async (value) => {
							this.pattern.disableCollapsing = value;
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
