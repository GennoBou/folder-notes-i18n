import { t } from 'src/i18n';
import {
	addExcludeFolderListItem,
	addExcludedFolder,
} from 'src/ExcludeFolders/functions/folderFunctions';
import { ExcludedFolder } from 'src/ExcludeFolders/ExcludeFolder';
import { addExcludePatternListItem } from 'src/ExcludeFolders/functions/patternFunctions';
import { Setting } from 'obsidian';
import type { SettingsTab } from './SettingsTab';
import ExcludedFolderSettings from 'src/ExcludeFolders/modals/ExcludeFolderSettings';
import PatternSettings from 'src/ExcludeFolders/modals/PatternSettings';
import WhitelistedFoldersSettings from 'src/ExcludeFolders/modals/WhitelistedFoldersSettings';
// import ExcludedFoldersWhitelist from 'src/ExcludeFolders/modals/WhitelistModal';

export async function renderExcludeFolders(settingsTab: SettingsTab): Promise<void> {
	const containerEl = settingsTab.settingsPage;
	const manageExcluded = new Setting(containerEl)
		.setHeading()
		.setClass('fn-excluded-folder-heading')
		.setName(t('Manage excluded folders'));
	const desc3 = document.createDocumentFragment();
	desc3.append(
		t('Add regex at the beginni...#24a3c9'),
		desc3.createEl('br'),
		t('Use before and after to...#1e39d9'),
		desc3.createEl('br'),
		t('Use before the folder na...#b22b39'),
		desc3.createEl('br'),
		t('Use after the folder nam...#914f27'),
	);
	manageExcluded.setDesc(desc3);

	manageExcluded.infoEl.appendText(t('The regexes and wildcard...#f8e9a2'));
	manageExcluded.infoEl.createEl('br');

	manageExcluded.infoEl.appendText(t('If you want to switch to...#ca8ef9'));

	manageExcluded.infoEl.style.color = settingsTab.app.vault.getConfig('accentColor') as string || '#7d5bed';


	new Setting(containerEl)
		.setName(t('Whitelisted folders'))
		.setDesc(t('Folders that override the excluded folders/patterns'))
		.addButton((cb) => {
			cb.setButtonText(t('Manage'));
			cb.setCta();
			cb.onClick(async () => {
				new WhitelistedFoldersSettings(settingsTab).open();
			});
		});

	new Setting(containerEl)
		.setName(t('Exclude folder default settings'))
		.addButton((cb) => {
			cb.setButtonText(t('Manage'));
			cb.setCta();
			cb.onClick(async () => {
				new ExcludedFolderSettings(
					settingsTab.app,
					settingsTab.plugin,
					settingsTab.plugin.settings.excludeFolderDefaultSettings,
				).open();
			});
		});

	new Setting(containerEl)
		.setName(t('Exclude pattern default settings'))
		.addButton((cb) => {
			cb.setButtonText(t('Manage'));
			cb.setCta();
			cb.onClick(async () => {
				new PatternSettings(
					settingsTab.app,
					settingsTab.plugin,
					settingsTab.plugin.settings.excludePatternDefaultSettings,
				).open();
			});
		});


	new Setting(containerEl)
		.setName(t('Add excluded folder'))
		.setClass('add-exclude-folder-item')
		.addButton((cb) => {
			cb.setIcon('plus');
			cb.setClass('add-exclude-folder');
			cb.setTooltip(t('Add excluded folder'));
			cb.onClick(() => {
				const excludedFolder = new ExcludedFolder(
					'',
					settingsTab.plugin.settings.excludeFolders.length,
					undefined,
					settingsTab.plugin,
				);
				addExcludeFolderListItem(settingsTab, containerEl, excludedFolder);
				addExcludedFolder(settingsTab.plugin, excludedFolder);
				settingsTab.renderSettingsPage(settingsTab.plugin.settings.settingsTab);
			});
		});

	settingsTab.plugin.settings.excludeFolders
		.filter((folder) => !folder.hideInSettings)
		.sort((a, b) => a.position - b.position)
		.forEach((excludedFolder) => {
			if (
				excludedFolder.string?.trim() !== '' &&
				excludedFolder.path?.trim() === ''
			) {
				addExcludePatternListItem(settingsTab, containerEl, excludedFolder);
			} else {
				addExcludeFolderListItem(settingsTab, containerEl, excludedFolder);
			}
		});
}
