import { t } from 'src/i18n';
import { Modal, Setting, type App } from 'obsidian';
import type FolderNotesPlugin from '../../main';
import type { WhitelistedFolder } from '../WhitelistFolder';
export default class WhitelistFolderSettings extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	whitelistedFolder: WhitelistedFolder;
	constructor(app: App, plugin: FolderNotesPlugin, whitelistedFolder: WhitelistedFolder) {
		super(app);
		this.plugin = plugin;
		this.app = app;
		this.whitelistedFolder = whitelistedFolder;
	}

	onOpen(): void {
		this.display();
	}

	display(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: t('Whitelisted folder settings') });
		new Setting(contentEl)
			.setName(t('Include subfolders'))
			.setDesc(t('Choose if the subfolders...#5923bf'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.subFolders)
					.onChange(async (value) => {
						this.whitelistedFolder.subFolders = value;
						await this.plugin.saveSettings(true);
					}),
			);

		new Setting(contentEl)
			.setName(t('Enable folder name sync'))

			.setDesc(t('Choose if the name of a...#a6011f'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.enableSync)
					.onChange(async (value) => {
						this.whitelistedFolder.enableSync = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Show folder in folder overview'))
			.setDesc(t('Choose if the folder should be shown in the folder overview'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.showInFolderOverview)
					.onChange(async (value) => {
						this.whitelistedFolder.showInFolderOverview = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Hide folder note in file explorer'))
			.setDesc(t('Choose if the folder not...#c427f9'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.hideInFileExplorer)
					.onChange(async (value) => {
						this.whitelistedFolder.hideInFileExplorer = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Allow auto creation of folder notes in this folder'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.enableAutoCreate)
					.onChange(async (value) => {
						this.whitelistedFolder.enableAutoCreate = value;
						await this.plugin.saveSettings();
					}),
			);


		new Setting(contentEl)
			.setName(t('Open folder note when clicking on the folder'))
			.setDesc(t('Choose if the folder not...#0d53ad'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.whitelistedFolder.enableFolderNote)
					.onChange(async (value) => {
						this.whitelistedFolder.enableFolderNote = value;
						await this.plugin.saveSettings(true);
						this.display();
					}),
			);

		if (this.whitelistedFolder.enableFolderNote) {
			new Setting(contentEl)
				.setName(t('Don t collapse folder wh...#ede31a'))
				.setDesc(t('Choose if the folder sho...#7f831f'))
				.addToggle((toggle) =>
					toggle
						.setValue(this.whitelistedFolder.disableCollapsing)
						.onChange(async (value) => {
							this.whitelistedFolder.disableCollapsing = value;
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
