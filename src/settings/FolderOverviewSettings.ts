import { t } from 'src/i18n';
import { Setting } from 'obsidian';
import type { SettingsTab } from './SettingsTab';
import { createOverviewSettings } from 'src/obsidian-folder-overview/src/settings';

export async function renderFolderOverview(settingsTab: SettingsTab): Promise<void> {
	const { plugin } = settingsTab;
	const defaultOverviewSettings = plugin.settings.defaultOverview;
	const containerEl = settingsTab.settingsPage;

	containerEl.createEl('h3', { text: t('Global settings') });
	new Setting(containerEl)
		.setName(t('Auto-update links without opening the overview'))
		// eslint-disable-next-line max-len
		.setDesc(t('If enabled the links tha...#31993e'))
		.addToggle((toggle) =>
			toggle
				.setValue(plugin.settings.fvGlobalSettings.autoUpdateLinks)
				.onChange(async (value) => {
					plugin.settings.fvGlobalSettings.autoUpdateLinks = value;
					await plugin.saveSettings();
					if (value) {
						plugin.fvIndexDB.init(true);
					} else {
						plugin.fvIndexDB.active = false;
					}
				}),
		);

	containerEl.createEl('h3', { text: t('Overviews default settings') });
	const pEl = containerEl.createEl('p', {
		text: t('Edit the default settings for new folder overviews,'),
		cls: 'setting-item-description',
	});
	const span = createSpan({ text: t('this won t apply to alre...#5ecba7'), cls: '' });
	const accentColor = (settingsTab.app.vault.getConfig('accentColor') as string) || '#7d5bed';
	span.setAttr('style', `color: ${accentColor};`);
	pEl.appendChild(span);

	void createOverviewSettings(
		containerEl,
		defaultOverviewSettings,
		plugin,
		plugin.settings.defaultOverview,
		// eslint-disable-next-line @typescript-eslint/unbound-method
		settingsTab.display,
		undefined,
		undefined,
		undefined,
		settingsTab,
	);
}
