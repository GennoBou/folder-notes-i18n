import { t } from 'src/i18n';
/* eslint-disable max-len */
import { Setting } from 'obsidian';
import type { SettingsTab } from './SettingsTab';

const MAX_FILE_EXPLORER_REVEAL_MARGIN = 10;

export async function renderFileExplorer(settingsTab: SettingsTab): Promise<void> {
	const containerEl = settingsTab.settingsPage;

	new Setting(containerEl)
		.setName(t('Hide folder note'))
		.setDesc(t('Hide the folder note fil...#51ba14'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.hideFolderNote)
				.onChange(async (value) => {
					settingsTab.plugin.settings.hideFolderNote = value;
					await settingsTab.plugin.saveSettings();
					if (value) {
						activeDocument.body.classList.add('hide-folder-note');
					} else {
						activeDocument.body.classList.remove('hide-folder-note');
					}
					settingsTab.display();
				}),
		);

	const setting2 = new Setting(containerEl)
		.setName(t('Disable click-to-open folder note on mobile'))
		.setDesc(t('Prevents folder notes fr...#66fa24'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.disableOpenFolderNoteOnClick)
				.onChange(async (value) => {
					settingsTab.plugin.settings.disableOpenFolderNoteOnClick = value;
					await settingsTab.plugin.saveSettings();
				}),
		);

	setting2.infoEl.appendText(t('Requires a restart to take effect'));
	const setting2AccentColor = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';
	setting2.infoEl.style.color = setting2AccentColor;

	new Setting(containerEl)
		.setName(t('Open folder notes by onl...#08e0d7'))
		.setDesc(t('Only allow folder notes...#cb40fa'))
		.addToggle((toggle) =>
			toggle
				.setValue(!settingsTab.plugin.settings.stopWhitespaceCollapsing)
				.onChange(async (value) => {
					if (!value) {
						activeDocument.body.classList.add('fn-whitespace-stop-collapsing');
					} else {
						activeDocument.body.classList.remove('fn-whitespace-stop-collapsing');
					}
					settingsTab.plugin.settings.stopWhitespaceCollapsing = !value;
					await settingsTab.plugin.saveSettings();
				}),
		);

	const disableSetting = new Setting(containerEl);
	disableSetting.setName(t('Disable folder collapsing'));
	disableSetting.setDesc(t('When enabled folders in...#3aa4b0'));
	disableSetting.addToggle((toggle) =>
		toggle
			.setValue(!settingsTab.plugin.settings.enableCollapsing)
			.onChange(async (value) => {
				settingsTab.plugin.settings.enableCollapsing = !value;
				await settingsTab.plugin.saveSettings();
			}),
	);
	disableSetting.infoEl.appendText(t('Requires a restart to take effect'));
	const accentColor = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';
	disableSetting.infoEl.style.color = accentColor;

	new Setting(containerEl)
		.setName(t('Use submenus'))
		.setDesc(t('Use submenus for file/folder commands'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.useSubmenus)
				.onChange(async (value) => {
					settingsTab.plugin.settings.useSubmenus = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	if (settingsTab.plugin.settings.frontMatterTitle.enabled) {
		new Setting(containerEl)
			.setName(t('Auto update folder name...#4cbca0'))
			.setDesc(t('Automatically update the...#dff747'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.frontMatterTitle.explorer)
					.onChange(async (value) => {
						settingsTab.plugin.settings.frontMatterTitle.explorer = value;
						await settingsTab.plugin.saveSettings();
						settingsTab.plugin.app.vault.getFiles().forEach((file) => {
							settingsTab.plugin.fmtpHandler?.fmptUpdateFileName(
								{
									id: '',
									result: false,
									path: file.path,
									pathOnly: false,
								},
								false,
							);
						});
					}),
			);
	}

	settingsTab.settingsPage.createEl('h3', { text: t('Style settings') });

	new Setting(containerEl)
		.setName(t('Highlight folder in the file explorer'))
		.setDesc(t('Highlight the folder in...#086d09'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.highlightFolder)
				.onChange(async (value) => {
					settingsTab.plugin.settings.highlightFolder = value;
					if (!value) {
						activeDocument.body.classList.add('disable-folder-highlight');
					} else {
						activeDocument.body.classList.remove('disable-folder-highlight');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Hide collapse icon'))
		.setDesc(t('Hide the collapse icon i...#4da6dd'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.hideCollapsingIcon)
				.onChange(async (value) => {
					settingsTab.plugin.settings.hideCollapsingIcon = value;
					if (value) {
						activeDocument.body.classList.add('fn-hide-collapse-icon');
					} else {
						activeDocument.body.classList.remove('fn-hide-collapse-icon');
					}
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	new Setting(containerEl)
		.setName(t('Hide collapse icon for every empty folder'))
		.setDesc(t('Hide the collapse icon i...#b5051c'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.hideCollapsingIconForEmptyFolders)
				.onChange(async (value) => {
					settingsTab.plugin.settings.hideCollapsingIconForEmptyFolders = value;
					await settingsTab.plugin.saveSettings();
					if (value) {
						activeDocument.body.classList.add('fn-hide-empty-collapse-icon');
					} else {
						activeDocument.body.classList.remove('fn-hide-empty-collapse-icon');
					}
					settingsTab.display();
				},
				));

	if (settingsTab.plugin.settings.hideCollapsingIcon) {
		new Setting(containerEl)
			.setName(t('Hide collapse icon also...#40ecf2'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.ignoreAttachmentFolder)
					.onChange(async (value) => {
						if (value) {
							activeDocument.body.classList.add('fn-ignore-attachment-folder');
						} else {
							activeDocument.body.classList.remove('fn-ignore-attachment-folder');
						}
						settingsTab.plugin.settings.ignoreAttachmentFolder = value;
						await settingsTab.plugin.saveSettings();
					}),
			);
	}

	new Setting(containerEl)
		.setName(t('Underline the name of folder notes'))
		.setDesc(t('Add an underline to fold...#fac585'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.underlineFolder)
				.onChange(async (value) => {
					settingsTab.plugin.settings.underlineFolder = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-underline');
					} else {
						activeDocument.body.classList.remove('folder-note-underline');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Bold the name of folder notes'))
		.setDesc(t('Make the folder name bol...#37b143'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.boldName)
				.onChange(async (value) => {
					settingsTab.plugin.settings.boldName = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-bold');
					} else {
						activeDocument.body.classList.remove('folder-note-bold');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Cursive the name of folder notes'))
		.setDesc(t('Make the folder name cur...#99b845'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.cursiveName)
				.onChange(async (value) => {
					settingsTab.plugin.settings.cursiveName = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-cursive');
					} else {
						activeDocument.body.classList.remove('folder-note-cursive');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	const advancedSettings = containerEl.createEl('details', {
		cls: 'fn-advanced-settings',
	});
	advancedSettings.createEl('summary', { text: t('Advanced') });

	new Setting(advancedSettings)
		.setName(t('File explorer reveal margin'))
		.setDesc(t('Controls the margin arou...#1ea53f'))
		.addSlider((slider) =>
			slider
				.setLimits(0, MAX_FILE_EXPLORER_REVEAL_MARGIN, 1)
				.setDynamicTooltip()
				.setValue(settingsTab.plugin.settings.fileExplorerRevealMargin)
				.onChange(async (value) => {
					settingsTab.plugin.settings.fileExplorerRevealMargin = value;
					await settingsTab.plugin.saveSettings();
				}),
		);

}
