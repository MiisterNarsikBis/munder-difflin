# Renderer i18n

Two-language UI (English default, French opt-in), same shape as `docs/i18n.js`
on the marketing site: English lives in the code as the fallback, French lives
in one dictionary (`fr.ts`), and there is nothing else to keep in sync.

## Usage

```tsx
import { useT } from '@/i18n';

function MyComponent() {
  const t = useT();
  return <span>{t('myComponent.title', 'My Component')}</span>;
}
```

- **Key**: `${component}.${shortKey}`, mirroring the file tree
  (`officeThemePicker.title`, `settingsModal.general.header`). Reuse a key
  across files only for text that is genuinely the same string in the same
  sense (e.g. a shared "Cancel" button) — when in doubt, use a new key.
- **English**: the second argument, verbatim from the current source. This is
  the fallback shown when French has no entry yet, so it must be the literal
  existing string — not a paraphrase.
- **French**: add an entry to `fr.ts` under the same key. A missing key is not
  an error, it just means "not translated yet" and falls back to English.

## Non-React modules (canvas classes, plain helpers)

`useT()` is a hook — it only works inside a React component. For plain TS
modules (e.g. `scene/office/*.ts`, which draw speech-bubble/tool-bubble text
directly on a canvas), import the non-hook `t` instead:

```ts
import { t } from '@/i18n';
ctx.fillText(t('toolBubble.reading', 'reading'), x, y);
```

It reads the current language from the store on every call (no subscription),
which is actually correct for a per-frame redraw. Prefer `useT()` in the
owning React component wherever you have the choice.

## Interpolation

`t()` takes an optional third argument for `{placeholder}` substitution —
use it for values (counts, names) so word order can differ between languages:

```tsx
t('agentCard.wraps', 'Wraps {agent}', { agent: agent.name })
```

```ts
// fr.ts
'agentCard.wraps': 'Enveloppe {agent}',
```

## Plurals / grammar that changes with a count

Don't try to make one string cover both forms. Branch the **key** (and the
English fallback) on the count at the call site — French pluralization rules
don't line up with English's, so two full dictionary entries beat one clever
template:

```tsx
const key = n === 1 ? 'themeSwitch.oneAgent' : 'themeSwitch.manyAgents';
const en = n === 1 ? 'current agent' : 'current agents';
t(key, en, { n })
```

## Never translate

Product/brand names (`Munder Difflin`, `MemPalace`, `hive`, `god`, `PTY`,
`worktree`), CLI agent/provider names (`Claude Code`, `Codex`, `Grok`,
`Kimi Code`, `Antigravity`, `Qwen`, `OpenCode`, `Crush`, `Pi`, `Copilot`),
office cast character names (`Michael`, `Jim`, `Pam`, `Dwight`), plan names
(`SOLO`, `Teams Lite`, `Teams PRO`), and anything typed into a PTY or sent as
a hive/Slack message (agent prompts, mission bodies) — those are instructions
to an LLM or a shell, not UI copy, and must stay English regardless of the
display language.

## Register

Vouvoiement ("vous"), matching `docs/i18n.js` on the marketing site. Never
"tu".

## Out of scope (for now)

Main-process-originated UI (tray menu, native `dialog.showMessageBox` boxes,
notifications built in `src/main`) is not wired to this — it would need the
current language threaded across IPC, which nothing here does yet. It stays
English until that's built.
