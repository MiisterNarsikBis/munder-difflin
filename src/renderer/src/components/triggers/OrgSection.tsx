import { useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import { type OrgTriggerConfig, type TriggerMode } from '@shared/triggers';
import { getOrgTrigger, setOrgTrigger as persistOrgTrigger } from './api';
import { Callout, Field, Hint, ModePicker, SecretField, Toggle } from './ui';
import { useT } from '@/i18n';

/**
 * ORGANISATION — peer messaging between teammates' clone nodes.
 *
 * Configuration only. There is no transport service yet, so a key saved here
 * starts nothing; it is the setting the service will read once it exists. The
 * copy says exactly that rather than implying a connection.
 *
 * Renders off the store mirror that Settings → Connections also renders off, and
 * follows the same mirror-then-persist rule: typing the key updates the mirror
 * (so Settings stays live) and commits on blur; the toggle and the trust mode
 * persist on the spot.
 */
export function OrgSection({ onSummary }: { onSummary?: (s: string) => void }) {
  const t = useT();
  const cfg = useStore((s) => s.orgTrigger);
  const mirror = useStore((s) => s.setOrgTrigger);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Only when the mirror looks unseeded — adopting unconditionally could
    // clobber a key being typed in Settings this second.
    if (useStore.getState().orgTrigger.apiKey) return;
    void getOrgTrigger().then((c) => {
      if (c && !useStore.getState().orgTrigger.apiKey) mirror(c);
    });
  }, [mirror]);

  useEffect(() => {
    onSummary?.(!cfg.apiKey.trim() ? t('orgSection.noKey', 'no key') : cfg.enabled ? t('triggersUi.on', 'on') : t('triggersUi.off', 'off'));
  }, [cfg, onSummary, t]);

  const apply = (next: OrgTriggerConfig, persist = true) => {
    mirror(next);
    if (persist) persistOrgTrigger(next);
  };

  const hasKey = cfg.apiKey.trim().length > 0;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ flex: 1, fontSize: 12, color: 'var(--cth-ink-700)' }}>
          {t('orgSection.acceptMessages', 'Accept messages from your organisation')}
        </span>
        <Toggle on={cfg.enabled} onClick={() => apply({ ...cfg, enabled: !cfg.enabled })} />
      </div>

      <Field label={t('orgSection.organisationKey', 'ORGANISATION KEY')}>
        <SecretField
          value={cfg.apiKey}
          revealed={revealed}
          onReveal={() => setRevealed((r) => !r)}
          placeholder={t('orgSection.pasteYourKey', 'paste your key')}
          onChange={(apiKey) => apply({ ...cfg, apiKey }, false)}
          onBlur={() => apply(cfg)}
        />
        <Hint>{t('orgSection.cloneNodeBlurb', 'Set an organisation key and your teammates can message your clone node — the copy of Munder Difflin running on your machine. Each teammate runs their own, so an org key is how two installs find each other.')}</Hint>
      </Field>

      <Field label={t('orgSection.trust', 'TRUST')}>
        <ModePicker value={cfg.mode} onChange={(mode: TriggerMode) => apply({ ...cfg, mode })} />
      </Field>

      <Callout tone="note">
        {t('orgSection.settingsOnlyNote', 'Settings only, for now. The org messaging service does not exist yet, so a key here starts no connection and nothing is sent or received. It is stored ready for when it does.')}
      </Callout>

      {cfg.enabled && !hasKey && (
        <Callout>{t('orgSection.noKeySetWarning', 'This is switched on with no key set, so no teammate can reach you yet.')}</Callout>
      )}
    </>
  );
}
