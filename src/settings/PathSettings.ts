import { t } from 'src/i18n';
/* eslint-disable max-len */
import { Setting } from 'obsidian';
import type { SettingsTab } from './SettingsTab';
export async function renderPath(settingsTab: SettingsTab): Promise<void> {
	const containerEl = settingsTab.settingsPage;
	new Setting(containerEl)
		.setName(t('Open folder note through path'))
		.setDesc(t('Open a folder note when...#bf1fa0'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.openFolderNoteOnClickInPath)
				.onChange(async (value) => {
					settingsTab.plugin.settings.openFolderNoteOnClickInPath = value;
					await settingsTab.plugin.saveSettings();
					settingsTab.display();
				}),
		);

	if (settingsTab.plugin.settings.openFolderNoteOnClickInPath) {
		new Setting(containerEl)
			.setName(t('Open sidebar when openin...#7090d1'))
			.setDesc(t('Open the sidebar when op...#c6d7cf'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.openSidebar.mobile)
					.onChange(async (value) => {
						settingsTab.plugin.settings.openSidebar.mobile = value;
						await settingsTab.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t('Open sidebar when openin...#a37614'))
			.setDesc(t('Open the sidebar when op...#b6ebdc'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.openSidebar.desktop)
					.onChange(async (value) => {
						settingsTab.plugin.settings.openSidebar.desktop = value;
						await settingsTab.plugin.saveSettings();
					}),
			);
	}

	if (settingsTab.plugin.settings.frontMatterTitle.enabled) {
		new Setting(containerEl)
			.setName(t('Auto update folder name...#8d1cb8'))
			.setDesc(t('Automatically update the...#7bd888'))
			.addToggle((toggle) =>
				toggle
					.setValue(settingsTab.plugin.settings.frontMatterTitle.path)
					.onChange(async (value) => {
						settingsTab.plugin.settings.frontMatterTitle.path = value;
						await settingsTab.plugin.saveSettings();
						if (value) {
							settingsTab.plugin.updateAllBreadcrumbs();
						} else {
							settingsTab.plugin.updateAllBreadcrumbs(true);
						}
					}),
			);
	}

	settingsTab.settingsPage.createEl('h3', { text: t('Style settings') });

	new Setting(containerEl)
		.setName(t('Underline folders in the path'))
		.setDesc(t('Add an underline to fold...#c2db0d'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.underlineFolderInPath)
				.onChange(async (value) => {
					settingsTab.plugin.settings.underlineFolderInPath = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-underline-path');
					} else {
						activeDocument.body.classList.remove('folder-note-underline-path');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Bold folders in the path'))
		.setDesc(t('Make the folder name bol...#f1d653'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.boldNameInPath)
				.onChange(async (value) => {
					settingsTab.plugin.settings.boldNameInPath = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-bold-path');
					} else {
						activeDocument.body.classList.remove('folder-note-bold-path');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Cursive the name of folder notes in the path'))
		.setDesc(t('Make the folder name cur...#74dd5f'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.cursiveNameInPath)
				.onChange(async (value) => {
					settingsTab.plugin.settings.cursiveNameInPath = value;
					if (value) {
						activeDocument.body.classList.add('folder-note-cursive-path');
					} else {
						activeDocument.body.classList.remove('folder-note-cursive-path');
					}
					await settingsTab.plugin.saveSettings();
				}),
		);

	new Setting(containerEl)
		.setName(t('Hide folder note name in the path'))
		.setDesc(t('Only show the folder nam...#7b660b'))
		.addToggle((toggle) =>
			toggle
				.setValue(settingsTab.plugin.settings.hideFolderNoteNameInPath)
				.onChange(async (value) => {
					activeDocument.body.classList.toggle('folder-note-hide-name-path', value);
					settingsTab.plugin.settings.hideFolderNoteNameInPath = value;
					await settingsTab.plugin.saveSettings();
				}),
		);
}
