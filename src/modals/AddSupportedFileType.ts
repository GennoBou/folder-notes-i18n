import { t } from 'src/i18n';
import { Modal, Setting, Notice, type App, type SettingTab } from 'obsidian';
import type FolderNotesPlugin from '../main';
import type { ListComponent } from 'src/functions/ListComponent';

export default class AddSupportedFileModal extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	name: string;
	list: ListComponent;
	settingsTab: SettingTab;
	constructor(app: App, plugin: FolderNotesPlugin, settingsTab: SettingTab, list: ListComponent) {
		super(app);
		this.plugin = plugin;
		this.app = app;
		this.name = '';
		this.list = list;
		this.settingsTab = settingsTab;
	}

	onOpen(): void {
		const { contentEl } = this;
		// close when user presses enter
		contentEl.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				this.close();
			}
		});
		contentEl.createEl('h2', { text: t('Extension name') });
		new Setting(contentEl)
			.setName(t('Enter the name of the ex...#efe14e'))
			.addText((text) =>
				text
					.setValue('')
					.onChange(async (value) => {
						if (value.trim() !== '') {
							this.name = value.trim();
						}
					}),
			);
	}
	onClose(): void {
		if (this.name.toLocaleLowerCase() === 'markdown') {
			this.name = 'md';
		}
		const { contentEl } = this;
		if (this.name === '') {
			contentEl.empty();
			this.settingsTab.display();
		} else if (this.plugin.settings.supportedFileTypes.includes(this.name.toLowerCase())) {
			new Notice(t('This extension is already supported'));
			return;
		} else {
			// Run async operations without returning a Promise from onClose
			void (async (): Promise<void> => {
				await this.list.addValue(this.name.toLowerCase());
				this.settingsTab.display();
				await this.plugin.saveSettings();
				contentEl.empty();
			})();
		}
	}
}
