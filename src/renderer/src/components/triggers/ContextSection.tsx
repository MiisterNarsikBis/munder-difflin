import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ContextRule, ContextTriggerConfig } from '@shared/triggers';
import { getContextTrigger, setContextTrigger } from './api';
import {
  Callout, Field, Hint, IntervalPicker, Muted, PctField, SubCard, SubHeader, Toggle,
  fmtInterval, textareaStyle
} from './ui';
import { useT } from '@/i18n';

/**
 * CONTEXT — the trigger that fires on an agent's own terminal filling up rather
 * than on the clock alone. Two rules, and they are not the same operation:
 * compaction SUMMARISES the context, clearing THROWS IT AWAY.
 */

const WRITE_DEBOUNCE_MS = 400;

export function ContextSection({ onSummary }: { onSummary?: (s: string) => void }) {
  const t = useT();
  const [cfg, setCfg] = useState<ContextTriggerConfig | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    getContextTrigger().then((c) => { if (alive) setCfg(c); }).catch(() => { /* defaults */ });
    return () => {
      alive = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!cfg) return;
    const on = [
      cfg.compact.enabled ? t('contextSection.compactWord', 'compact') : null,
      cfg.clear.enabled ? t('contextSection.clearWord', 'clear') : null
    ].filter(Boolean);
    onSummary?.(on.length ? on.join(' + ') : t('contextSection.bothOff', 'both off'));
  }, [cfg, onSummary, t]);

  // Optimistic + debounced: the controls answer instantly, and a burst of typing
  // in the message box collapses into one write instead of one per keystroke.
  const commit = (next: ContextTriggerConfig) => {
    setCfg(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setContextTrigger(next), WRITE_DEBOUNCE_MS);
  };
  const patch = (key: 'compact' | 'clear', fields: Partial<ContextRule>) => {
    if (!cfg) return;
    commit({ ...cfg, [key]: { ...cfg[key], ...fields } });
  };

  if (!cfg) return <Muted>{t('contextSection.oneSec', 'One sec…')}</Muted>;

  return (
    <>
      <Muted>
        {t('contextSection.blurb', "A rule fires only when both halves agree: the gap since its last run has passed, AND that agent's context is at least as full as the bar. A bar of 0% means the clock alone.")}
      </Muted>
      <div style={{ height: 8 }} />

      <RuleCard
        title={t('contextSection.compact.title', 'Compact')}
        blurb={t('contextSection.compact.blurb', 'Summarises the context so the thread keeps going.')}
        rule={cfg.compact}
        messageLabel={t('contextSection.compact.messageLabel', 'EXTRA FOCUS')}
        messageHint={t('contextSection.compact.messageHint', "Appended to the provider's compaction command. Empty sends the bare command.")}
        messagePlaceholder={t('contextSection.compact.messagePlaceholder', 'What the summary must keep…')}
        onPatch={(fields) => patch('compact', fields)}
      />

      <RuleCard
        title={t('contextSection.clear.title', 'Clear')}
        blurb={t('contextSection.clear.blurb', 'Discards the context. Nothing is summarised.')}
        rule={cfg.clear}
        messageLabel={t('contextSection.clear.messageLabel', 'COMMAND')}
        messageHint={t('contextSection.clear.messageHint', 'Sent literally. Empty sends the bare clear command.')}
        messagePlaceholder="/clear"
        caution={t('contextSection.clear.caution', 'Clearing throws context away — it is not a smaller version of compaction. An agent mid-task forgets what it was doing. Leave this off unless you keep context another way.')}
        onPatch={(fields) => patch('clear', fields)}
      />
    </>
  );
}

function RuleCard({ title, blurb, rule, messageLabel, messageHint, messagePlaceholder, caution, onPatch }: {
  title: string;
  blurb: string;
  rule: ContextRule;
  messageLabel: string;
  messageHint: string;
  messagePlaceholder: string;
  caution?: ReactNode;
  onPatch: (fields: Partial<ContextRule>) => void;
}) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <SubCard>
      <SubHeader
        open={open}
        onToggle={() => setOpen((o) => !o)}
        title={title}
        sub={blurb}
        right={<Toggle on={rule.enabled} onClick={() => onPatch({ enabled: !rule.enabled })} />}
      />
      {/* The caution is always on screen — it is why this ships off — but it only
          goes coral once the destructive rule is actually armed. A red box over a
          switched-off setting is crying wolf. */}
      {caution && <Callout tone={rule.enabled ? 'warn' : 'note'}>{caution}</Callout>}
      {!open && (
        <Hint>
          {rule.enabled
            ? t('contextSection.everyOncePasses', 'Every {interval}, once context passes {pct}%.', { interval: fmtInterval(rule.everyMs), pct: rule.minContextPct })
            : t('contextSection.offDot', 'Off.')}
        </Hint>
      )}
      {open && (
        <div style={{ marginTop: 4 }}>
          <Field label={t('contextSection.noSoonerThanEvery', 'NO SOONER THAN EVERY')}>
            {/* Main clamps a context cadence to 1 minute … 24 hours, so the
                picker offers exactly that range and never labels a value it
                cannot actually store. */}
            <IntervalPicker
              value={rule.everyMs}
              onChange={(everyMs) => onPatch({ everyMs })}
              minMs={60_000}
              maxMs={86_400_000}
            />
          </Field>
          <Field label={t('contextSection.contextBar', 'CONTEXT BAR')}>
            <PctField value={rule.minContextPct} onChange={(minContextPct) => onPatch({ minContextPct })} />
            <Hint>{t('contextSection.contextBarHint', 'How full the window must be before this may run. 0% = time alone.')}</Hint>
          </Field>
          <Field label={t('contextSection.barOnBigWindows', 'BAR ON BIG WINDOWS')}>
            <PctField
              value={rule.minContextPctLargeWindow}
              onChange={(minContextPctLargeWindow) => onPatch({ minContextPctLargeWindow })}
            />
            <Hint>{t('contextSection.barOnBigWindowsHint', 'Used on ~1M-token windows, where a smaller slice is still an enormous amount of text.')}</Hint>
          </Field>
          <Field label={messageLabel}>
            <textarea
              value={rule.message}
              onChange={(e) => onPatch({ message: e.target.value })}
              rows={3}
              placeholder={messagePlaceholder}
              style={textareaStyle}
            />
            <Hint>{messageHint}</Hint>
          </Field>
        </div>
      )}
    </SubCard>
  );
}
