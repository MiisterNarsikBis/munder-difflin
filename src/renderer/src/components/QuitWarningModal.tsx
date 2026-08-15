import { useState } from 'react';
import { PixelPanel } from './PixelPanel';
import { PixelButton } from './PixelButton';
import { Icon } from './Icon';
import { useT } from '@/i18n';

/** Renderer-side closing-time view state. Mirrors the main process's
 *  ClosingTimeEvent phases, plus a local 'error' for a failed start. */
export interface ClosingTimeState {
  phase: 'started' | 'progress' | 'complete' | 'timeout' | 'error';
  acked: number;
  total: number;
  error?: string;
}

export interface QuitWarningModalProps {
  ptyCount: number;
  /** Non-null while the closing-time protocol runs — switches the dialog into
   *  the "wrapping up the floor" progress view. */
  closing?: ClosingTimeState | null;
  onCancel: () => void;
  onConfirm: () => void;
  /** Start the graceful shutdown (the third button). */
  onClosingTime?: () => void;
}

export function QuitWarningModal({ ptyCount, closing, onCancel, onConfirm, onClosingTime }: QuitWarningModalProps) {
  const t = useT();
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    await onConfirm();
    // No need to clear busy — the app is quitting.
  };

  const inClosingTime = !!closing && closing.phase !== 'error';

  return (
    <div
      onClick={inClosingTime ? undefined : onCancel}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26, 19, 32, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 300
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 480, maxWidth: '92vw' }}
      >
        <PixelPanel variant="dialog" title={inClosingTime ? t('quitWarningModal.closingTimeTitle', 'CLOSING TIME') : t('quitWarningModal.quittingNowTitle', 'QUITTING NOW?')} noPadding>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {inClosingTime ? (
              <>
                {/* ── Graceful shutdown in progress ──────────────────────── */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32,
                    background: closing!.phase === 'complete' ? 'var(--cth-mint-light, #cdeccd)' : 'var(--cth-lemon-light, #f6ecc4)',
                    boxShadow: 'inset 0 0 0 1.5px var(--cth-ink-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon name="bell" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--cth-font-display)',
                      fontSize: 12, lineHeight: '20px',
                      color: 'var(--cth-ink-900)',
                      marginBottom: 4
                    }}>
                      {closing!.phase === 'complete'
                        ? t('quitWarningModal.floorSaved', 'FLOOR SAVED — SEE YOU TOMORROW')
                        : closing!.phase === 'timeout'
                          ? t('quitWarningModal.stillWrappingUp', 'STILL WRAPPING UP…')
                          : t('quitWarningModal.wrappingUpFloor', 'WRAPPING UP THE FLOOR')}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: '22px', color: 'var(--cth-ink-700)' }}>
                      {closing!.phase === 'complete' ? (
                        <>{t('quitWarningModal.completeBody', 'Every agent saved its memory and the orchestrator confirmed the shutdown. The harness closes itself in a moment.')}</>
                      ) : (
                        <>{t('quitWarningModal.progressBody', 'The orchestrator broadcast closing time. Every worker parks its work, saves its memory, and reports back — the app closes only after the orchestrator confirms nothing will be lost.')}</>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACK progress */}
                <div style={{
                  padding: 8,
                  background: 'var(--cth-cream-200)',
                  boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
                  fontSize: 12, lineHeight: '18px',
                  color: 'var(--cth-ink-700)',
                  fontFamily: 'var(--cth-font-display)'
                }}>
                  {closing!.total > 0
                    ? `${t('quitWarningModal.ackProgress', '{acked} / {total} WORKERS CONFIRMED', { acked: closing!.acked, total: closing!.total })}${closing!.acked >= closing!.total ? t('quitWarningModal.waitingForOrchestratorSuffix', ' — WAITING FOR THE ORCHESTRATOR') : ''}`
                    : t('quitWarningModal.noWorkers', 'NO WORKERS ON THE FLOOR — WAITING FOR THE ORCHESTRATOR')}
                  {closing!.phase === 'timeout' && (
                    <div style={{ marginTop: 6, fontFamily: 'var(--cth-font-body, inherit)' }}>
                      {t('quitWarningModal.takingAWhile', 'This is taking a while (an agent may be mid-compaction or deep in a tool call). Keep waiting, or force quit and accept the data loss.')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  {closing!.phase !== 'complete' && (
                    <>
                      <PixelButton variant="secondary" size="md" onClick={onCancel} disabled={busy}>
                        {t('quitWarningModal.cancelBackToWork', 'cancel — back to work')}
                      </PixelButton>
                      <PixelButton variant="destructive" size="md" onClick={confirm} disabled={busy}>
                        {busy ? t('quitWarningModal.killing', 'killing...') : t('quitWarningModal.forceQuitNow', 'force quit now')}
                      </PixelButton>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ── The classic quit warning ────────────────────────────── */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 32, height: 32,
                    background: 'var(--cth-coral-light)',
                    boxShadow: 'inset 0 0 0 1.5px var(--cth-ink-500)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon name="bell" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'var(--cth-font-display)',
                      fontSize: 12, lineHeight: '20px',
                      color: 'var(--cth-ink-900)',
                      marginBottom: 4
                    }}>
                      {ptyCount === 1
                        ? t('quitWarningModal.stillRunning.one', '{n} AGENT STILL RUNNING', { n: ptyCount })
                        : t('quitWarningModal.stillRunning.many', '{n} AGENTS STILL RUNNING', { n: ptyCount })}
                    </div>
                    <div style={{ fontSize: 15, lineHeight: '22px', color: 'var(--cth-ink-700)' }}>
                      {ptyCount === 1
                        ? t('quitWarningModal.terminateWarning.one', 'Closing the harness will terminate the running claude session and discard any unsaved progress they were holding in memory. The conversation history inside each session is lost when the PTY exits.')
                        : t('quitWarningModal.terminateWarning.many', 'Closing the harness will terminate all {n} running claude sessions and discard any unsaved progress they were holding in memory. The conversation history inside each session is lost when the PTY exits.', { n: ptyCount })}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: 8,
                  background: 'var(--cth-cream-200)',
                  boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
                  fontSize: 12, lineHeight: '18px',
                  color: 'var(--cth-ink-700)'
                }}>
                  {t('quitWarningModal.tipPrefix', 'Tip:')} <strong>{t('quitWarningModal.tipClosingTime', 'closing time')}</strong> {t('quitWarningModal.tipRest', 'is the safe way out — the orchestrator has every agent commit its work and save its memory, and the app closes itself once the whole floor has confirmed. No data loss.')}
                </div>

                {closing?.phase === 'error' && (
                  <div style={{
                    padding: 8,
                    background: 'var(--cth-coral-light)',
                    boxShadow: 'inset 0 0 0 1px var(--cth-ink-100)',
                    fontSize: 12, lineHeight: '18px',
                    color: 'var(--cth-ink-900)'
                  }}>
                    {closing.error ?? t('quitWarningModal.closingTimeCouldNotStart', 'Closing time could not start.')}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                  <PixelButton variant="secondary" size="md" onClick={onCancel} disabled={busy}>
                    {t('quitWarningModal.keepThemRunning', 'keep them running')}
                  </PixelButton>
                  {onClosingTime && (
                    <PixelButton variant="primary" size="md" onClick={onClosingTime} disabled={busy}>
                      <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                        <Icon name="clock" /> {t('quitWarningModal.closingTimeButton', 'closing time')}
                      </span>
                    </PixelButton>
                  )}
                  <PixelButton variant="destructive" size="md" onClick={confirm} disabled={busy}>
                    {busy
                      ? t('quitWarningModal.killing', 'killing...')
                      : ptyCount === 1
                        ? t('quitWarningModal.killItAndQuit', 'kill it & quit')
                        : t('quitWarningModal.killAllAndQuit', 'kill all & quit')}
                  </PixelButton>
                </div>
              </>
            )}
          </div>
        </PixelPanel>
      </div>
    </div>
  );
}
