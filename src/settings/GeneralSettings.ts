import { t, tDom } from 'src/i18n';

/* eslint-disable max-len */
import { Setting, Platform } from 'obsidian';
import type { SettingsTab } from './SettingsTab';
import { ListComponent } from '../functions/ListComponent';
import AddSupportedFileModal from '../modals/AddSupportedFileType';
import { FrontMatterTitlePluginHandler } from '../events/FrontMatterTitle';
import ConfirmationModal from './modals/CreateFnForEveryFolder';
import { TemplateSuggest } from '../suggesters/TemplateSuggester';
import { refreshAllFolderStyles } from '../functions/styleFunctions';
import BackupWarningModal from './modals/BackupWarning';
import RenameFolderNotesModal from './modals/RenameFns';

let debounceTimer: number | undefined;

// eslint-disable-next-line complexity
export async function renderGeneral(settingsTab: SettingsTab): Promise<void> {
	const containerEl = settingsTab.settingsPage;
	const nameSetting = new Setting(containerEl)
		.setName(t('Folder note name template'))
		.setDesc(t('All folder notes will us...#e97235'))
		.addText((text) =>
			text
				.setValue(settingsTab.plugin.settings.folderNoteName)
				.onChange(async (value) => {
					if (value.trim() === '') { return; }
					settingsTab.plugin.settings.folderNoteName = value;
					await settingsTab.plugin.saveSettings();

					window.clearTimeout(debounceTimer);
					const FOLDER_NOTE_NAME_DEBOUNCE_MS = 2000;
					debounceTimer = window.setTimeout(() => {
						if (!value.includes('{{folder_name}}')) {
							if (!settingsTab.showFolderNameInTabTitleSetting) {
								settingsTab.display();
								settingsTab.showFolderNameInTabTitleSetting = true;
							}
						} else {
							if (settingsTab.showFolderNameInTabTitleSetting) {
								settingsTab.display();
								settingsTab.showFolderNameInTabTitleSetting = false;
							}
						}
					}, FOLDER_NOTE_NAME_DEBOUNCE_MS);
				}),
		)
		.addButton((button) =>
			button
				.setButtonText(t('Rename existing folder notes'))
				.setCta()
				.onClick(async () => {
					new RenameFolderNotesModal(
						settingsTab.plugin,
						t('Rename all existing folder notes'),
						t('When you click on Confir...#84cbcb'),
						settingsTab.renameFolderNotes,
						[settingsTab.plugin.settings.oldFolderNoteName ?? '{{folder_name}}'])
						.open();
				}),
		);
	nameSetting.infoEl.appendText(t('Requires a restart to take effect'));
	nameSetting.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';

	if (!settingsTab.plugin.settings.folderNoteName.includes('{{folder_name}}')) {
		new Setting(containerEl)
			.setName(t('Display folder name in tab title'))
			.setDesc(t('Use the actual folder na...#2e39d6'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.tabManagerEnabled)
					.onChange(async (value) => {
						if (!value) {
							settingsTab.plugin.tabManager.resetTabs();
						} else {
							settingsTab.plugin.settings.tabManagerEnabled = value;
							settingsTab.plugin.tabManager.updateTabs();
						}
						settingsTab.plugin.settings.tabManagerEnabled = value;
						await settingsTab.plugin.saveSettings();
						settingsTab.display();
					}),
			);
	}

	new Setting(containerEl)
		.setName(t('Default file type for new folder notes'))
		.setDesc(t('Choose the default file...#efb2f4'))
		.addDropdown((dropdown) => {
			dropdown.addOption('.ask', t('Ask for file type'));
			settingsTab.plugin.settings.supportedFileTypes.forEach((type) => {
				if (type === '.md' || type === 'md') {
					dropdown.addOption('.md', t('Markdown'));
				} else {
					dropdown.addOption('.' + type, type);
				}
			});

			if (
				!settingsTab.plugin.settings.supportedFileTypes.includes(
					settingsTab.plugin.settings.folderNoteType.replace('.', ''),
				) &&
				settingsTab.plugin.settings.folderNoteType !== '.ask'
			) {
				settingsTab.plugin.settings.folderNoteType = '.md';
				void settingsTab.plugin.saveSettings();
			}

			let defaultType = settingsTab.plugin.settings.folderNoteType.startsWith('.')
				? settingsTab.plugin.settings.folderNoteType
				: '.' + settingsTab.plugin.settings.folderNoteType;
			if (
				!settingsTab.plugin.settings.supportedFileTypes.includes(
					defaultType.replace('.', ''),
				)
			) {
				defaultType = '.ask';
				settingsTab.plugin.settings.folderNoteType = defaultType;
			}

			dropdown
				.setValue(defaultType)
				.onChange(async (value: string) => {
					settingsTab.plugin.settings.folderNoteType = value as '.md' | '.canvas' | '.ask';
					void settingsTab.plugin.saveSettings();
					void settingsTab.display();
				});
		});

	const setting0 = new Setting(containerEl);
	setting0.setName(t('Supported file types'));
	const desc0 = document.createDocumentFragment();
	desc0.append(
		t('Specify which file types...#f90077'),
	);
	setting0.setDesc(desc0);
	const list = new ListComponent(
		setting0.settingEl,
		settingsTab.plugin.settings.supportedFileTypes || [],
		['md', 'canvas'],
	);
	list.on('update', (values: unknown) => {
		settingsTab.plugin.settings.supportedFileTypes = values as string[];
		void settingsTab.plugin.saveSettings();
		void settingsTab.display();
	});

	if (
		!settingsTab.plugin.settings.supportedFileTypes.includes('md') ||
		!settingsTab.plugin.settings.supportedFileTypes.includes('canvas') ||
		!settingsTab.plugin.settings.supportedFileTypes.includes('excalidraw')
	) {
		setting0.addDropdown((dropdown) => {
			const options = [
				{ value: 'md', label: t('Markdown') },
				{ value: 'canvas', label: t('Canvas') },
				{ value: 'base', label: t('Bases') },
				{ value: 'excalidraw', label: t('Excalidraw') },
				{ value: 'custom', label: t('Custom extension') },
			];

			options.forEach((option) => {
				if (!settingsTab.plugin.settings.supportedFileTypes?.includes(option.value)) {
					dropdown.addOption(option.value, option.label);
				}
			});
			dropdown.addOption('+', '+');
			dropdown.setValue('+');
			dropdown.onChange(async (value) => {
				if (value === 'custom') {
					return new AddSupportedFileModal(
						settingsTab.app,
						settingsTab.plugin,
						settingsTab,
						list,
					).open();
				}
				await list.addValue(value.toLowerCase());
				void settingsTab.display();
				void settingsTab.plugin.saveSettings();
			});
		});
	} else {
		setting0.addButton((button) =>
			button
				.setButtonText(t('Add custom file type'))
				.setCta()
				.onClick(async () => {
					new AddSupportedFileModal(
						settingsTab.app,
						settingsTab.plugin,
						settingsTab,
						list,
					).open();
				}),
		);
	}


	const templateSetting = new Setting(containerEl)
		.setDesc(t('Can be used with templat...#673001'))
		.setName(t('Template path'))
		.addSearch((cb) => {
			new TemplateSuggest(cb.inputEl, settingsTab.plugin);
			cb.setPlaceholder(t('Template path'));
			const templateFile = settingsTab.plugin.app.vault.getAbstractFileByPath(
				settingsTab.plugin.settings.templatePath,
			);
			const templateName = templateFile?.name.replace('.md', '') || '';
			cb.setValue(templateName);
			cb.onChange(async (value) => {
				if (value.trim() === '') {
					settingsTab.plugin.settings.templatePath = '';
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
					return;
				}
			});
		});
	templateSetting.infoEl.appendText(t('Requires a restart to take effect'));
	templateSetting.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';

	const storageLocation = new Setting(containerEl)
		.setName(t('Storage location'))
		.setDesc(t('Choose where to store the folder notes'))
		.addDropdown((dropdown) =>
			dropdown
				.addOption('insideFolder', t('Inside the folder'))
				.addOption('parentFolder', t('In the parent folder'))
				.setValue(settingsTab.plugin.settings.storageLocation)
				.onChange(async (value: string) => {
					if (value !== 'insideFolder' && value !== 'parentFolder' && value !== 'vaultFolder') {
						return;
					}
					settingsTab.plugin.settings.storageLocation = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
					refreshAllFolderStyles(undefined, settingsTab.plugin);
				}),
		)
		.addButton((button) =>
			button
				.setButtonText(t('Switch'))
				.setCta()
				.onClick(async () => {
					let oldStorageLocation = settingsTab.plugin.settings.storageLocation;
					if (settingsTab.plugin.settings.storageLocation === 'parentFolder') {
						oldStorageLocation = 'insideFolder';
					} else if (settingsTab.plugin.settings.storageLocation === 'insideFolder') {
						oldStorageLocation = 'parentFolder';
					}
					new BackupWarningModal(
						settingsTab.plugin,
						t('Switch storage location'),
						t('When you click on Confir...#0873e0'),
						settingsTab.switchStorageLocation,
						[oldStorageLocation],
					).open();
				}),
		);
	storageLocation.infoEl.appendText(t('Requires a restart to take effect'));
	storageLocation.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';

	if (settingsTab.plugin.settings.storageLocation === 'parentFolder') {
		new Setting(containerEl)
			.setName(t('Delete folder notes when deleting the folder'))
			.setDesc(t('Delete the folder note when deleting the folder'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.syncDelete)
					.onChange(async (value) => {
						settingsTab.plugin.settings.syncDelete = value;
						await settingsTab.plugin.saveSettings();
					},
					),
			);
		new Setting(containerEl)
			.setName(t('Move folder notes when moving the folder'))
			.setDesc(t('Move the folder note fil...#71b0cf'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.syncMove)
					.onChange(async (value) => {
						settingsTab.plugin.settings.syncMove = value;
						await settingsTab.plugin.saveSettings();
					}),
			);
	}
	if (Platform.isDesktopApp) {
		settingsTab.settingsPage.createEl('h3', { text: t('Keyboard shortcuts') });

		new Setting(containerEl)
			.setName(t('Key for creating folder note'))
			.setDesc(t('The key combination to create a folder note'))
			.addDropdown((dropdown) => {
				if (!Platform.isMacOS) {
					dropdown.addOption('ctrl', t('Ctrl + Click'));
					dropdown.addOption('alt', t('Alt + Click'));
				} else {
					dropdown.addOption('ctrl', t('Cmd + Click'));
					dropdown.addOption('alt', t('Option + Click'));
				}
				dropdown.setValue(settingsTab.plugin.settings.ctrlKey ? 'ctrl' : 'alt');
				dropdown.onChange(async (value) => {
					settingsTab.plugin.settings.ctrlKey = value === 'ctrl';
					settingsTab.plugin.settings.altKey = value === 'alt';
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				});
			});

		new Setting(containerEl)
			.setName(t('Key for opening folder note'))
			.setDesc(t('Select the combination to open a folder note'))
			.addDropdown((dropdown) => {
				dropdown.addOption('click', t('Mouse click'));
				if (!Platform.isMacOS) {
					dropdown.addOption('ctrl', t('Ctrl + Click'));
					dropdown.addOption('alt', t('Alt + Click'));
				} else {
					dropdown.addOption('ctrl', t('Cmd + Click'));
					dropdown.addOption('alt', t('Option + Click'));
				}
				if (settingsTab.plugin.settings.openByClick) {
					dropdown.setValue('click');
				} else if (settingsTab.plugin.settings.openWithCtrl) {
					dropdown.setValue('ctrl');
				} else {
					dropdown.setValue('alt');
				}
				dropdown.onChange(async (value) => {
					settingsTab.plugin.settings.openByClick = value === 'click';
					settingsTab.plugin.settings.openWithCtrl = value === 'ctrl';
					settingsTab.plugin.settings.openWithAlt = value === 'alt';
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				});
			});
	}

	settingsTab.settingsPage.createEl('h3', { text: t('Folder note behavior') });

	new Setting(containerEl)
		.setName(t('Confirm folder note deletion'))
		.setDesc(t('Ask for confirmation before deleting a folder note'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.showDeleteConfirmation)
				.onChange(async (value) => {
					settingsTab.plugin.settings.showDeleteConfirmation = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	new Setting(containerEl)
		.setName(t('Deleted folder notes'))
		.setDesc(t('What happens to the folder note after you delete it'))
		.addDropdown((dropdown) => {
			dropdown.addOption('trash', t('Move to system trash'));
			dropdown.addOption('obsidianTrash', t('Move to Obsidian trash (.trash folder)'));
			dropdown.addOption('delete', t('Delete permanently'));
			dropdown.setValue(settingsTab.plugin.settings.deleteFilesAction);
			dropdown.onChange(async (value) => {
				const v = value as 'trash' | 'delete' | 'obsidianTrash';
				settingsTab.plugin.settings.deleteFilesAction = v;
				await settingsTab.plugin.saveSettings();
				settingsTab.display();
			});
		});

	if (Platform.isDesktop) {
		const setting3 = new Setting(containerEl);
		setting3.setName(t('Open folder note in a new tab by default'));
		setting3.setDesc(t('Always open folder notes...#0db8e5'));
		setting3.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.openInNewTab)
				.onChange(async (value) => {
					settingsTab.plugin.settings.openInNewTab = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);
		setting3.infoEl.appendText(t('Requires a restart to take effect'));
		setting3.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';
	}

	if (settingsTab.plugin.settings.openInNewTab) {
		new Setting(containerEl)
			.setName(t('Focus existing tab instead of creating a new one'))
			.setDesc(t('If a folder note is alre...#16ca3a'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.focusExistingTab)
					.onChange(async (value) => {
						settingsTab.plugin.settings.focusExistingTab = value;
						await settingsTab.plugin.saveSettings();
						settingsTab.display();
					}),
			);
	}

	new Setting(containerEl)
		.setName(t('Sync folder name'))
		.setDesc(t('Automatically rename the...#903cdd'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.syncFolderName)
				.onChange(async (value) => {
					settingsTab.plugin.settings.syncFolderName = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	settingsTab.settingsPage.createEl('h4', { text: t('Automation settings') });

	new Setting(containerEl)
		.setName(t('Create folder notes for all folders'))
		.setDesc(t('Generate folder notes for every folder in the vault.'))
		.addButton((cb) => {
			cb.setIcon('plus');
			cb.setTooltip(t('Create folder notes'));
			cb.onClick(async () => {
				new ConfirmationModal(settingsTab.app, settingsTab.plugin).open();
			});
		});

	new Setting(containerEl)
		.setName(t('Auto-create on folder creation'))
		.setDesc(t('Automatically create a f...#b8a9a1'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.autoCreate)
				.onChange(async (value) => {
					settingsTab.plugin.settings.autoCreate = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	if (settingsTab.plugin.settings.autoCreate) {
		new Setting(containerEl)
			.setName(t('Auto-open after creation'))
			.setDesc(t('Open the folder note imm...#1eed24'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.autoCreateFocusFiles)
					.onChange(async (value) => {
						settingsTab.plugin.settings.autoCreateFocusFiles = value;
						await settingsTab.plugin.saveSettings();
						settingsTab.display();
					}),
			);

		new Setting(containerEl)
			.setName(t('Auto-create for attachment folders'))
			.setDesc(t('Also automatically creat...#d908d5'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.autoCreateForAttachmentFolder)
					.onChange(async (value) => {
						settingsTab.plugin.settings.autoCreateForAttachmentFolder = value;
						await settingsTab.plugin.saveSettings();
						settingsTab.display();
					}),
			);
	}

	new Setting(containerEl)
		.setName(t('Auto-create when creating notes'))
		.setDesc(t('Automatically create a f...#d528aa'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.autoCreateForFiles)
				.onChange(async (value) => {
					settingsTab.plugin.settings.autoCreateForFiles = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	settingsTab.settingsPage.createEl('h3', { text: t('Integration & compatibility') });

	const link = activeDocument.createElement('a');
	link.href = 'https://github.com/snezhig/obsidian-front-matter-title';
	link.textContent = t('Front matter title plugin');
	link.target = '_blank';

	const desc1 = tDom(
		'Allows you to use the li...#11733a',
		{ link },
	);

	const fmtpSetting = new Setting(containerEl)
		.setName(t('Enable front matter title plugin integration'))
		.setDesc(desc1)
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.frontMatterTitle.enabled)
				.onChange(async (value) => {
					settingsTab.plugin.settings.frontMatterTitle.enabled = value;
					await settingsTab.plugin.saveSettings();
					if (value) {
						settingsTab.plugin.fmtpHandler =
							new FrontMatterTitlePluginHandler(settingsTab.plugin);
					} else {
						if (settingsTab.plugin.fmtpHandler) {
							settingsTab.plugin.updateAllBreadcrumbs(true);
						}
						settingsTab.plugin.app.vault.getFiles().forEach((file) => {
							void settingsTab.plugin.fmtpHandler?.fmptUpdateFileName(
								{
									id: '',
									result: false,
									path: file.path,
									pathOnly: false,
								},
								false,
							);
						});
						settingsTab.plugin.fmtpHandler?.deleteEvent();
						settingsTab.plugin.fmtpHandler =
							new FrontMatterTitlePluginHandler(settingsTab.plugin);
					}
					settingsTab.display();
				}),
		);
	fmtpSetting.infoEl.appendText(t('Requires a restart to take effect'));
	fmtpSetting.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';

	settingsTab.settingsPage.createEl('h3', { text: t('Session & persistence') });

	new Setting(containerEl)
		.setName(t('Persist tab after restart'))
		.setDesc(t('Restore the same settings tab after restarting Obsidian.'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.persistentSettingsTab.afterRestart)
				.onChange(async (value) => {
					settingsTab.plugin.settings.persistentSettingsTab.afterRestart = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	new Setting(containerEl)
		.setName(t('Persist tab during session only'))
		.setDesc(t('Keep the current setting...#99b57b'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.persistentSettingsTab.afterChangingTab)
				.onChange(async (value) => {
					settingsTab.plugin.settings.persistentSettingsTab.afterChangingTab = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);
}
