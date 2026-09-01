import { t } from 'src/i18n';
import BackupWarningModal from './BackupWarning';
import type FolderNotesPlugin from 'src/main';
import { Setting } from 'obsidian';

export default class RenameFolderNotesModal extends BackupWarningModal {
	constructor(
		plugin: FolderNotesPlugin,
		title: string,
		description: string,
		callback: (oldMethod: string) => void,
		args: [string],
	) {
		super(plugin, title, description, callback, args);
	}

	insertCustomHtml(): void {
		const { contentEl } = this;
		new Setting(contentEl)
			.setName(t('Old folder note name'))
			.setDesc(t('Every folder note that m...#fe1ec0'))
			.addText((text) => text
				.setPlaceholder(t('Enter the old folder note name'))
				.setValue(this.plugin.settings.oldFolderNoteName || '')
				.onChange(async (value) => {
					this.plugin.settings.oldFolderNoteName = value;
				}),
			);

		new Setting(contentEl)
			.setName(t('New folder note name'))
			.setDesc(t('Every folder note that m...#045855'))
			.addText((text) => text
				.setPlaceholder(t('Enter the new folder note name'))
				.setValue(this.plugin.settings.folderNoteName || '')
				.onChange(async (value) => {
					this.plugin.settings.folderNoteName = value;
					this.plugin.settingsTab.display();
				}),
			);
	}
}
