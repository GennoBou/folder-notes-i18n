import { t } from 'src/i18n';
import {
	Modal,
	Setting,
	Platform,
	type App,
	type TFile,
	type TFolder,
	type TAbstractFile,
} from 'obsidian';
import type FolderNotesPlugin from '../main';
import { turnIntoFolderNote } from 'src/functions/folderNoteFunctions';
export default class ExistingFolderNoteModal extends Modal {
	plugin: FolderNotesPlugin;
	app: App;
	file: TFile;
	folder: TFolder;
	folderNote: TAbstractFile;
	constructor(
		app: App,
		plugin: FolderNotesPlugin,
		file: TFile,
		folder: TFolder,
		folderNote: TAbstractFile,
	) {
		super(app);
		this.plugin = plugin;
		this.app = app;
		this.file = file;
		this.folder = folder;
		this.folderNote = folderNote;
	}
	onOpen(): void {
		const { contentEl } = this;
		contentEl.createEl('h2', { text: t('A folder note for this folder already exists') });
		const setting = new Setting(contentEl);
		// eslint-disable-next-line max-len
		setting.infoEl.createEl('p', { text: t('Are you sure you want to...#f8a519') });

		setting.infoEl.parentElement?.classList.add('fn-delete-confirmation-modal');

		// Create a container for the buttons and the checkbox
		// eslint-disable-next-line max-len
		const buttonContainer = setting.infoEl.createEl('div', { cls: 'fn-delete-confirmation-modal-buttons' });
		if (Platform.isMobileApp) {
			const confirmButton = buttonContainer.createEl('button', {
				text: t('Rename and don t ask aga...#009e12'),
			});
			confirmButton.classList.add('mod-warning', 'fn-confirmation-modal-button');
			confirmButton.addEventListener('click', () => {
				this.plugin.settings.showRenameConfirmation = false;
				void this.plugin.saveSettings();
				this.close();
				turnIntoFolderNote(this.plugin, this.file, this.folder, this.folderNote, true);
			});
		} else {
			const checkbox = buttonContainer.createEl('input', { type: 'checkbox' });
			checkbox.addEventListener('change', (e) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					this.plugin.settings.showRenameConfirmation = false;
				} else {
					this.plugin.settings.showRenameConfirmation = true;
				}
			});
			const checkBoxText = buttonContainer.createEl('span', { text: t('Don t ask again...#1a6eb5') });
			checkBoxText.addEventListener('click', () => {
				checkbox.click();
			});
		}
		const button = buttonContainer.createEl('button', { text: t('Rename') });
		button.classList.add('mod-warning', 'fn-confirmation-modal-button');
		button.addEventListener('click', () => {
			void this.plugin.saveSettings();
			this.close();
			turnIntoFolderNote(this.plugin, this.file, this.folder, this.folderNote, true);
		});
		button.focus();
		const cancelButton = buttonContainer.createEl('button', { text: t('Cancel') });
		cancelButton.addEventListener('click', () => {
			this.close();
		});

	}
	onClose(): void {
		const { contentEl } = this;
		contentEl.empty();
	}
}
