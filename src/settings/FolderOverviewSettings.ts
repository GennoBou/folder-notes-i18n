import { t } from 'src/i18n';
import { Setting } from 'obsidian';
import type { SettingsTab } from './SettingsTab';
import { createOverviewSettings } from 'src/obsidian-folder-overview/src/settings';

const CHANGED_SECTION_ARG = 10;

export function renderOverviewDefaults(settingsTab: SettingsTab, containerEl: HTMLElement): void {
	const { plugin } = settingsTab;
	const pEl = containerEl.createEl('p', {
		text: t('Edit the default settings for new folder overviews,'),
		cls: 'setting-item-description',
	});
	pEl.createSpan({ text: t('this won t apply to alre...#5ecba7'), cls: 'fn-restart-note' });

	const settingsEl = containerEl.createDiv();
	const render = (...args: unknown[]): void => {
		const changedSection = args[CHANGED_SECTION_ARG] as string | undefined;
		void createOverviewSettings(
			settingsEl,
			plugin.settings.defaultOverview,
			plugin,
			plugin.settings.defaultOverview,
			render,
			undefined,
			undefined,
			undefined,
			settingsTab,
			undefined,
			changedSection,
		);
	};
	render();
}

export async function renderFolderOverview(settingsTab: SettingsTab): Promise<void> {
	const { plugin } = settingsTab;
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
					await settingsTab.setControlValue('fvGlobalSettings.autoUpdateLinks', value);
				}),
		);

	containerEl.createEl('h3', { text: t('Overviews default settings') });
	renderOverviewDefaults(settingsTab, containerEl);
}
