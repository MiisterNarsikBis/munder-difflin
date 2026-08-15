import { useStore } from '@/store/store';
import { FR } from './fr';

/** Translation function returned by useT(). English lives at the call site as
 *  the fallback (`en`) — there is no en.json to keep in sync with the code.
 *  French lives in ./fr.ts, one flat dictionary keyed `${component}.${key}`.
 *
 *  `params`, when given, does `{name}` substitution on the resolved string
 *  (English or French) — use it for values interpolated into a sentence
 *  (counts, names) so word order can differ between languages. For strings
 *  whose grammar itself changes with a count (singular/plural, "is"/"are"),
 *  branch the KEY on the count at the call site — see i18n/README.md. */
export type T = (key: string, en: string, params?: Record<string, string | number>) => string;

function resolve(lang: 'en' | 'fr', key: string, en: string, params?: Record<string, string | number>): string {
  let out = lang === 'fr' ? (FR[key] ?? en) : en;
  if (params) {
    for (const [k, v] of Object.entries(params)) out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

/** `const t = useT(); t('officeThemePicker.title', 'Office Theme')`.
 *  Re-renders whenever the store's `language` field changes (it's a normal
 *  zustand selector), which is also what Settings flips on toggle. Use this in
 *  React components. */
export function useT(): T {
  const lang = useStore((s) => s.language);
  return (key, en, params) => resolve(lang, key, en, params);
}

/** Non-hook variant for plain TS modules that aren't React components (canvas
 *  drawing classes in `scene/office/*.ts`, imperative helpers). Reads the
 *  current language from the store on each call rather than subscribing — for
 *  a per-frame canvas redraw this is exactly right (always current, no stale
 *  closure); for anything rendered once and left alone, prefer `useT()` in the
 *  owning component so it re-renders on a language change. */
export function t(key: string, en: string, params?: Record<string, string | number>): string {
  return resolve(useStore.getState().language, key, en, params);
}
