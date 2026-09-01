import { t } from 'src/i18n';
import { Modal, Setting, type App } from 'obsidian';
import type FolderNotesPlugin from '../../main';
import type { ExcludedFolder } from 'src/ExcludeFolders/ExcludeFolder';
import { updateCSSClassesForFolder } from 'src/functions/styleFunctions';
export default class ExcludedFolderSettings extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	excludedFolder: ExcludedFolder;
	constructor(app: App, plugin: FolderNotesPlugin, excludedFolder: ExcludedFolder) {
		super(app);
		this.plugin = plugin;
		this.app = app;
		this.excludedFolder = excludedFolder;
	}
	onOpen(): void {
		this.display();
	}
	display(): void {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h2', { text: t('Excluded folder settings') });
		new Setting(contentEl)
			.setName(t('Include subfolders'))
			.setDesc(t('Choose if the subfolders...#f6f614'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.subFolders)
					.onChange(async (value) => {
						this.excludedFolder.subFolders = value;
						await this.plugin.saveSettings(true);
					}),
			);

		new Setting(contentEl)
			.setName(t('Disable folder name sync'))
			.setDesc(t('Choose if the folder not...#36f80c'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.disableSync)
					.onChange(async (value) => {
						this.excludedFolder.disableSync = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Don t show folder in fol...#226a96'))
			.setDesc(t('Choose if the folder should be shown in the folder overview'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.excludeFromFolderOverview)
					.onChange(async (value) => {
						this.excludedFolder.excludeFromFolderOverview = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Show folder note in the file explorer'))
			.setDesc(t('Choose if the folder not...#feca16'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.showFolderNote)
					.onChange(async (value) => {
						this.excludedFolder.showFolderNote = value;
						updateCSSClassesForFolder(this.excludedFolder.path, this.plugin);
						await this.plugin.saveSettings();
						this.display();
					}),
			);

		new Setting(contentEl)
			.setName(t('Disable auto creation of folder notes in this folder'))
			.setDesc(t('Choose if a folder note...#a3ca23'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.disableAutoCreate)
					.onChange(async (value) => {
						this.excludedFolder.disableAutoCreate = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(contentEl)
			.setName(t('Disable open folder note'))
			.setDesc(t('Choose if the folder not...#0d53ad'))
			.addToggle((toggle) =>
				toggle
					.setValue(this.excludedFolder.disableFolderNote)
					.onChange(async (value) => {
						this.excludedFolder.disableFolderNote = value;
						await this.plugin.saveSettings(true);
						this.display();
					}),
			);

		if (!this.excludedFolder.disableFolderNote) {
			new Setting(contentEl)
				.setName(t('Collapse folder when opening folder note'))
				.setDesc(t('Choose if the folder sho...#7f831f'))
				.addToggle((toggle) =>
					toggle
						.setValue(this.excludedFolder.enableCollapsing)
						.onChange(async (value) => {
							this.excludedFolder.enableCollapsing = value;
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
