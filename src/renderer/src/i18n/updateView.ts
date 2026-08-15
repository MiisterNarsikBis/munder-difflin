/**
 * French-aware mirrors of describeUpdate / describeUpdateSettings.
 *
 * The originals live in src/shared/updateState.ts, which is electron-free and
 * imported by src/main/updater.ts as well as the renderer — it can't reach for
 * the renderer's zustand-backed t(). These wrappers re-run the same
 * state-to-text mapping, taking the caller's t()/useT() so the component stays
 * reactive to a language change, so the wording rules stay in one place
 * (updateState.ts) while the language stays in fr.ts.
 */
import { clampPercent, type UpdateAction, type UpdateStatus } from '@shared/updateState';

type Translate = (key: string, en: string, params?: Record<string, string | number>) => string;

export interface UpdateBadgeViewT {
  label: string | null;
  action: UpdateAction;
  tone: 'idle' | 'busy' | 'ready' | 'warn';
  title: string;
  busy: boolean;
}

export function describeUpdateT(translate: Translate, status: UpdateStatus | null, currentVersion: string): UpdateBadgeViewT {
  const v = currentVersion;
  switch (status?.state) {
    case 'checking':
      return {
        label: translate('updateView.badge.checkingLabel', 'checking…'), action: 'none', tone: 'busy', busy: true,
        title: translate('updateView.badge.checkingTitle', "Checking for updates (you're on v{v})", { v })
      };
    case 'available':
      return {
        label: translate('updateView.badge.availableLabel', 'v{version} ready to install', { version: status.version }),
        action: 'download', tone: 'ready', busy: false,
        title: translate('updateView.badge.availableTitle', 'Version {version} is available — click to download it', { version: status.version })
      };
    case 'downloading':
      return {
        label: translate('updateView.badge.downloadingLabel', 'downloading {pct}%', { pct: clampPercent(status.percent) }),
        action: 'none', tone: 'busy', busy: true,
        title: translate('updateView.badge.downloadingTitle', 'Downloading v{version}… {pct}%', { version: status.version, pct: clampPercent(status.percent) })
      };
    case 'downloaded':
      return {
        label: translate('updateView.badge.downloadedLabel', 'restart to update to v{version}', { version: status.version }),
        action: 'restart', tone: 'ready', busy: false,
        title: translate('updateView.badge.downloadedTitle', 'v{version} is downloaded and ready — click to restart and apply it', { version: status.version })
      };
    case 'available-manual':
      return {
        label: translate('updateView.badge.manualLabel', 'v{version} — get it manually', { version: status.version }),
        action: 'open-release', tone: 'warn', busy: false,
        title: status.reason
          ? translate('updateView.badge.manualTitleReason', "This install couldn't update itself ({reason}) — click to open the release page", { reason: status.reason })
          : translate('updateView.badge.manualTitle', "This install can't update itself — click to open the release page")
      };
    case 'error':
      return {
        label: translate('updateView.badge.errorLabel', 'update check failed'), action: 'check', tone: 'warn', busy: false,
        title: translate('updateView.badge.errorTitle', '{message} — click to try again', { message: status.message })
      };
    case 'not-available':
      return {
        label: null, action: 'check', tone: 'idle', busy: false,
        title: translate('updateView.badge.notAvailableTitle', 'v{v} is the latest version — click to check again', { v })
      };
    case 'idle':
    default:
      return {
        label: null, action: 'check', tone: 'idle', busy: false,
        title: translate('updateView.badge.idleTitle', 'v{v} — click to check for updates', { v })
      };
  }
}

export interface UpdateSettingsViewT {
  headline: string;
  detail: string;
  button: string | null;
  action: UpdateAction;
  busy: boolean;
  tone: 'idle' | 'busy' | 'ready' | 'warn';
}

export function describeUpdateSettingsT(translate: Translate, status: UpdateStatus | null, currentVersion: string): UpdateSettingsViewT {
  const v = currentVersion;
  switch (status?.state) {
    case 'checking':
      return {
        headline: translate('updateView.settings.checkingHeadline', "You're on v{v}", { v }),
        detail: translate('updateView.settings.checkingDetail', 'Checking for a newer release…'),
        button: null, action: 'none', busy: true, tone: 'busy'
      };
    case 'available':
      return {
        headline: translate('updateView.settings.availableHeadline', 'v{version} is available', { version: status.version }),
        detail: translate('updateView.settings.availableDetail', "You're on v{v}. Download it now — you'll be asked to restart once it's ready.", { v }),
        button: translate('updateView.settings.availableButton', 'Download v{version}', { version: status.version }),
        action: 'download', busy: false, tone: 'ready'
      };
    case 'downloading':
      return {
        headline: translate('updateView.settings.downloadingHeadline', 'Downloading v{version}', { version: status.version }),
        detail: translate('updateView.settings.downloadingDetail', '{pct}% done. You can keep working; the restart is yours to trigger.', { pct: clampPercent(status.percent) }),
        button: null, action: 'none', busy: true, tone: 'busy'
      };
    case 'downloaded':
      return {
        headline: translate('updateView.settings.downloadedHeadline', 'v{version} is ready to install', { version: status.version }),
        detail: translate('updateView.settings.downloadedDetail', 'Restart Munder Difflin to finish updating from v{v}.', { v }),
        button: translate('updateView.settings.downloadedButton', 'Restart to update'), action: 'restart', busy: false, tone: 'ready'
      };
    case 'available-manual':
      return {
        headline: translate('updateView.settings.manualHeadline', 'v{version} is available', { version: status.version }),
        detail: status.reason
          ? translate('updateView.settings.manualDetailReason', "This install can't update itself ({reason}) — download it from the release page.", { reason: status.reason })
          : translate('updateView.settings.manualDetail', "This install can't update itself — download it from the release page."),
        button: translate('updateView.settings.manualButton', 'Open release page'), action: 'open-release', busy: false, tone: 'warn'
      };
    case 'error':
      return {
        headline: translate('updateView.settings.errorHeadline', 'Update check failed'),
        detail: translate('updateView.settings.errorDetail', "{message} (you're on v{v}).", { message: status.message, v }),
        button: translate('updateView.settings.errorButton', 'Try again'), action: 'check', busy: false, tone: 'warn'
      };
    case 'not-available':
      return {
        headline: translate('updateView.settings.notAvailableHeadline', 'v{v} is the latest version', { v }),
        detail: translate('updateView.settings.notAvailableDetail', "You're already up to date — nothing to install."),
        button: translate('updateView.settings.notAvailableButton', 'Check again'), action: 'check', busy: false, tone: 'idle'
      };
    case 'idle':
    default:
      return {
        headline: translate('updateView.settings.idleHeadline', "You're on v{v}", { v }),
        detail: translate('updateView.settings.idleDetail', 'Updates are checked automatically every 6 hours. Check now if you want to be sure.'),
        button: translate('updateView.settings.idleButton', 'Check for updates'), action: 'check', busy: false, tone: 'idle'
      };
  }
}
