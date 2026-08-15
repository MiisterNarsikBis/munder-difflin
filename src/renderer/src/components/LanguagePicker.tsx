import { useState } from 'react';
import type { HarnessConfig } from '@/store/config';
import { useStore } from '@/store/store';
import { PixelButton } from './PixelButton';
import { useT } from '@/i18n';

/** Settings "Language" toggle: EN/FR for the renderer UI. Self-contained, same
 *  shape as OfficeThemePicker — a config-backed flag with an optimistic toggle
 *  that reverts on save failure. Main-process UI (tray, native dialogs) is not
 *  covered — see src/renderer/src/i18n/README.md. */
export function LanguagePicker({ config }: { config: HarnessConfig }) {
  const [lang, setLang] = useState<'en' | 'fr'>((config.language as 'en' | 'fr') ?? 'en');
  const setStoreLanguage = useStore((s) => s.setLanguage);
  const t = useT();

  const choose = async (next: 'en' | 'fr') => {
    if (next === lang) return;
    const prev = lang;
    setLang(next);
    setStoreLanguage(next);
    try {
      await window.cth.updateConfig({ language: next });
    } catch {
      setLang(prev);
      setStoreLanguage(prev); // revert optimistic switch on save failure
    }
  };

  return (
    <div>
      <div style={{
        fontFamily: 'var(--cth-font-display)', fontSize: 8, lineHeight: '12px',
        color: 'var(--cth-ink-500)', textTransform: 'uppercase', marginBottom: 10
      }}>
        {t('languagePicker.title', 'Language')}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, lineHeight: '20px', color: 'var(--cth-ink-900)' }}>
            {t('languagePicker.label', 'Display language')}
          </span>
          <span style={{ fontSize: 12, lineHeight: '16px', color: 'var(--cth-ink-500)' }}>
            {t('languagePicker.blurb', "Translates the app's UI. Agent prompts, hive messages and CLI output are unaffected.")}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <PixelButton variant={lang === 'en' ? 'primary' : 'secondary'} size="sm" onClick={() => void choose('en')}>
            EN
          </PixelButton>
          <PixelButton variant={lang === 'fr' ? 'primary' : 'secondary'} size="sm" onClick={() => void choose('fr')}>
            FR
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
