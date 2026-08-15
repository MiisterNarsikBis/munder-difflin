// Cafeteria small-talk — The Office edition.
//
// The cast ARE Dunder Mifflin (see cast.ts), so an agent's coffee break is an
// excuse for a one-liner in character. Two kinds of line:
//   • solo  — one quip shown above a single agent at a break spot
//   • pair  — a two-beat exchange between two agents at the same table
//
// Lines are kept short so they fit the ThoughtBubble (≈MAX_WIDTH). Character
// keys match OfficeCharacterName; anyone without bespoke lines falls back to the
// shared GENERIC pool so the floor never feels empty.
//
// French lines are adapted, not translated word-for-word — the jokes are
// French-native equivalents kept the same length/rhythm class as the English
// originals so they still fit the thought cloud. See i18n/README.md for the
// project's general translation conventions; this file is the one place that
// intentionally departs from literal translation for comic timing.

import type { OfficeCharacterName } from './cast';
import { useStore } from '@/store/store';

/** Where an agent is lingering — picks a contextual line pool. */
export type BreakSpot = 'coffee' | 'vending' | 'snack' | 'table';

const pick = <T,>(arr: readonly T[], seed: number): T =>
  arr[((seed % arr.length) + arr.length) % arr.length];

const isFr = (): boolean => useStore.getState().language === 'fr';

// ─── solo lines, by spot ─────────────────────────────────────────────────────

const COFFEE_EN: readonly string[] = [
  'is this… decaf?? who did this',
  "we're out of beans again",
  'World’s Best Boss mug',
  'first cup of the day. and the fifth.',
  'the coffee here is basically a hug',
  'who took my mug?',
];
const COFFEE_FR: readonly string[] = [
  'c’est... déca ?? qui a fait ça',
  'on n’a plus de café',
  'mug Meilleur Patron du Monde',
  'première tasse de la journée. et la cinquième.',
  'le café ici, c’est un câlin liquide',
  'qui a pris mon mug ?',
];

const VENDING_EN: readonly string[] = [
  'the machine ate my dollar',
  'B4… please be the pretzels',
  'it’s stuck. classic.',
  'shaking it. gently. respectfully.',
  'one (1) emotional-support snack',
  'A1 again. living dangerously.',
];
const VENDING_FR: readonly string[] = [
  'la machine a mangé ma pièce',
  'B4... allez, sois les bretzels',
  'coincé. classique.',
  'je secoue. doucement. avec respect.',
  'un (1) encas de réconfort',
  'A1 encore. je vis dangereusement.',
];

const SNACK_EN: readonly string[] = [
  'is it Pretzel Day?',
  'who finished the chips??',
  'just a little treat',
  'these are everyone’s? cool cool cool',
  'second breakfast',
];
const SNACK_FR: readonly string[] = [
  'c’est le Jour du Bretzel ?',
  'qui a fini les chips ??',
  'juste une petite douceur',
  'c’est pour tout le monde ? cool cool cool',
  'deuxième petit-déjeuner',
];

const TABLE_EN: readonly string[] = [
  'big day. lots of meetings.',
  'just five more minutes',
  'did you see the standup notes?',
  'pretending to read my notes',
  'I needed this break, honestly',
  'do NOT tell Michael I’m in here',
];
const TABLE_FR: readonly string[] = [
  'grosse journée. plein de réunions.',
  'encore cinq minutes',
  'tu as vu les notes du point d’équipe ?',
  'je fais semblant de relire mes notes',
  'j’avais vraiment besoin de cette pause',
  'ne dis SURTOUT pas à Michael que je suis là',
];

const SPOT_POOL_EN: Record<BreakSpot, readonly string[]> = {
  coffee: COFFEE_EN, vending: VENDING_EN, snack: SNACK_EN, table: TABLE_EN,
};
const SPOT_POOL_FR: Record<BreakSpot, readonly string[]> = {
  coffee: COFFEE_FR, vending: VENDING_FR, snack: SNACK_FR, table: TABLE_FR,
};

// ─── character flavour — overrides the generic pool when present ─────────────

const BY_CHARACTER_EN: Partial<Record<OfficeCharacterName, readonly string[]>> = {
  michael:  ['I DECLARE… BANKRUPTCY!', "that's what she said", "I'm not superstitious. just a little stitious.", 'no meetings before coffee. that’s the rule.'],
  dwight:   ['FALSE.', 'identity theft is not a joke', 'that mug is regulation', 'this fridge needs a beet drawer', 'Schrute Farms has better coffee'],
  jim:      ["...that's what she said", 'bears. beets. Battlestar Galactica.', 'I moved Dwight’s stapler again', 'just here for the gossip'],
  pam:      ['Dunder Mifflin, this is Pam', 'sketching the vending machine', 'the watercolor of the break room'],
  kevin:    ['the chili is NOT ready', 'why waste time say lot word', 'me want snack', 'cookie? cookie.'],
  angela:   ['this break room is filthy', 'party planning committee, 3pm', 'I’m judging the fridge'],
  oscar:    ['actually, it’s “espresso”', 'well, actually…', 'the budget for snacks is concerning'],
  stanley:  ['is it Pretzel Day?', 'did I stutter?', 'crossword and coffee. leave me be.', "I'll retire before this brews"],
  phyllis:  ['Bob is picking me up at five', 'knitting and a nice cup of tea'],
  andy:     ['Cornell, ever heard of it?', 'rit-dit-dit, coffee break!', 'Big Tuna, grab a chair'],
  kelly:    ['did you HEAR what happened??', 'so. much. to tell you.', 'I am the GOSSIP queen'],
  ryan:     ['I’m kind of a big deal', 'the temp needs caffeine', 'starting a coffee startup, actually'],
  toby:     ['I should write that up…', 'HR-wise this break is fine', 'no one ever sits with me'],
  creed:    ['which one of you is the new guy?', 'I’ve eaten worse out of that fridge', 'mung beans. under my desk.'],
  meredith: ['is it 5 o’clock yet?', 'someone spike the coffee?'],
};
const BY_CHARACTER_FR: Partial<Record<OfficeCharacterName, readonly string[]>> = {
  michael:  ['JE DÉCLARE… FAILLITE !', 'c’est ce qu’elle a dit', 'je ne suis pas superstitieux. juste un peu stitieux.', 'pas de réunion avant le café. c’est la règle.'],
  dwight:   ['FAUX.', 'l’usurpation d’identité, c’est pas une blague', 'ce mug est réglementaire', 'ce frigo a besoin d’un tiroir à betteraves', 'le café est meilleur à la ferme Schrute'],
  jim:      ['...c’est ce qu’elle a dit', 'ours. betteraves. Battlestar Galactica.', 'j’ai encore déplacé l’agrafeuse de Dwight', 'je suis juste là pour les ragots'],
  pam:      ['Dunder Mifflin, bonjour, c’est Pam', 'je dessine le distributeur', 'l’aquarelle de la salle de pause'],
  kevin:    ['le chili n’est PAS prêt', 'pourquoi perdre temps dire plein mot', 'moi vouloir encas', 'cookie ? cookie.'],
  angela:   ['cette salle de pause est répugnante', 'comité d’organisation, 15h', 'je juge ce frigo'],
  oscar:    ['en fait, on dit « espresso »', 'en fait…', 'le budget des encas m’inquiète'],
  stanley:  ['c’est le Jour du Bretzel ?', 'j’ai bégayé ?', 'mots croisés et café. laissez-moi tranquille.', 'je serai à la retraite avant que ça infuse'],
  phyllis:  ['Bob vient me chercher à cinq heures', 'du tricot et une bonne tasse de thé'],
  andy:     ['Cornell, ça te dit quelque chose ?', 'lalala, pause café !', 'Big Tuna, prends une chaise'],
  kelly:    ['tu as ENTENDU ce qui s’est passé ??', 'tellement. de choses. à te raconter.', 'je suis la reine des ragots'],
  ryan:     ['je suis quelqu’un d’important', 'le stagiaire a besoin de caféine', 'je monte une startup de café, en fait'],
  toby:     ['je devrais noter ça…', 'niveau RH, cette pause est parfaitement en règle', 'personne ne s’assoit jamais avec moi'],
  creed:    ['lequel d’entre vous est le nouveau ?', 'j’ai mangé pire de ce frigo', 'des haricots mungo. sous mon bureau.'],
  meredith: ['c’est déjà l’heure de l’apéro ?', 'quelqu’un a corsé le café ?'],
};

/** A solo break-room line. Character flavour ~60% of the time, else the line
 *  fits the spot the agent is standing at. `seed` keeps it deterministic per
 *  call site (avoids Math.random, which Pixi/Electron CSP-safe code prefers). */
export function pickSoloLine(character: OfficeCharacterName, spot: BreakSpot, seed: number): string {
  const fr = isFr();
  const byChar = fr ? BY_CHARACTER_FR : BY_CHARACTER_EN;
  const spotPool = fr ? SPOT_POOL_FR : SPOT_POOL_EN;
  const flavour = byChar[character];
  if (flavour && seed % 5 < 3) return pick(flavour, Math.floor(seed / 5));
  return pick(spotPool[spot], seed);
}

// ─── paired exchanges (two agents at one table) ──────────────────────────────
//
// Each exchange is a list of beats that ALTERNATE between the two agents:
// beat[0] = the speaker who sat down, beat[1] = their table-mate, beat[2] =
// speaker again, and so on. The director plays them out one beat at a time.
// Lines are trimmed to fit the thought cloud; longer ones auto-truncate.

type Exchange = readonly string[];

// Generic banter — works between any two agents (they're all Dunder Mifflin).
const EXCHANGES_EN: readonly Exchange[] = [
  ['world’s best boss.', 'you are. I had the mug made.', 'and I cherish it.'],
  ['would an idiot do this?', '...if yes, I don’t.', 'that’s my boy.'],
  ['feared or loved? both.', 'that’s beautiful.', 'I know.'],
  ['I edited your wiki page again.', 'I know. thank you.'],
  ['question. how many bears?', 'one.', 'that’s too many.'],
  ['fact: bears eat beets.', 'bears. beets. Galactica.', 'what is happening.'],
  ['I grew up on a beet farm.', 'shocking.', '...not shocking at all.'],
  ['what’s Schrute Farms smell like?', 'victory. and beets.'],
  ['did you just throw your phone?', 'didn’t like what it said.', 'cool.'],
  ['is a hot dog a sandwich?', 'it is.', 'I know, right?'],
  ['three-hole-punch Jim returns.', 'never gets old.'],
  ['why few word when lot word?', '...genuinely profound.', 'I know.'],
  ['I am not a bad person.', '...', 'not a great person either.', 'there it is.'],
  ['I love my cats more than people.', 'including us?', 'especially you.'],
  ['cats are better than dogs.', 'dogs are better.', '...sorry.'],
  ['do you love me?', 'I love… being here.', 'that’s a yes.'],
  ['I’m kind of a big deal.', 'you are?', 'in my mind. yes.'],
  ['did you miss me?', 'no.', 'a little?', '...there it is.'],
  ['did you just roll your eyes?', 'I did.', 'why?', 'muscle memory.'],
  ['I’ve watched that clock since 4.', 'weren’t you working?', 'watching the clock.'],
  ['what do we sell again?', 'paper.', 'sure, yeah.'],
  ['how old are you?', 'yeah.', 'that’s not an answer.', 'sure it is.'],
  ['that’s not how math works.', 'I know.', 'then why?', 'faster.'],
  ['I’m not an alcoholic.', 'you went to a meeting.', 'for the food.'],
  ['I went to Cornell.', 'nobody cares.', 'I went to Cornell.', 'still nobody cares.'],
  ['I have a lot of feelings.', 'I can tell.', 'is that bad?', 'for us? yes.'],
  ['why are you the way you are?', '...', 'honestly.'],
  ['your cat died.', 'I know.', 'I’m sorry.', '...thank you.'],
  ['stop looking at me.', 'you stop looking at me.'],
  ['sign this.', 'what is it?', 'doesn’t matter.', '...fine.'],
  ['you can’t say that.', 'I just did.', 'gonna stop me?', '...no.'],
  ['that’s a fire lane.', 'fire hasn’t happened yet.'],
  ['I wrapped your stapler in Jello.', 'I’ll eat around it.', 'fair.'],
  ['zombie attack plan?', 'especially that.', 'of course.'],
  ['just seeing if you’d answer.', 'I hate you.', 'I know.'],
  ['a little stitious, not super.', 'that’s not a word.', 'it is now.'],
  ['funniest person in the office?', 'and other times?', 'other times I know it.'],
  ['that’s what she said.', '...every time.', 'come on.'],
  ['I started the fire.', 'no you didn’t.', 'in our hearts, I did.'],
  ['is today a day ending in Y?', 'yes.', 'then no.'],
  ['Bob Vance.', 'Phyllis Vance.', 'Vance Refrigeration.'],
  ['you look beautiful today.', '...I know.'],
  ['I’m better than you in every way.', 'probably.', 'definitely.', 'sure.'],
  ['I’m a nice guy.', 'you’re okay.', 'nicest thing you’ve said.'],
  ['are you okay?', 'I’ve been worse.', 'when?', 'can’t narrow it down.'],
  ['there’s a spider on your desk.', 'where?', '...you ate it.', 'protein.'],
  ['soul mates can be bosses.', 'you’re my boss.', 'exactly.'],
  ['standup ran 40 minutes.', 'could’ve been an email.'],
  ['is the build green yet?', '...don’t look.'],
  ['who reply-all’d everyone?', 'we don’t talk about it.'],
];
const EXCHANGES_FR: readonly Exchange[] = [
  ['meilleur patron du monde.', 'c’est vrai. j’ai fait faire le mug.', 'et je le chéris.'],
  ['un idiot ferait ça ?', '...si oui, je le fais pas.', 'c’est mon gars.'],
  ['craint ou aimé ? les deux.', 'c’est magnifique.', 'je sais.'],
  ['j’ai encore modifié ta page wiki.', 'je sais. merci.'],
  ['question. combien d’ours ?', 'un.', 'c’est déjà trop.'],
  ['fait : les ours mangent des betteraves.', 'ours. betteraves. Galactica.', 'qu’est-ce qu’il se passe.'],
  ['j’ai grandi dans une ferme de betteraves.', 'choquant.', '...pas choquant du tout.'],
  ['ça sent quoi, la ferme Schrute ?', 'la victoire. et les betteraves.'],
  ['tu viens de jeter ton téléphone ?', 'j’ai pas aimé ce qu’il a dit.', 'cool.'],
  ['un hot-dog, c’est un sandwich ?', 'oui.', 'je sais, hein.'],
  ['Jim-perfore-trois-trous revient.', 'ça lasse jamais.'],
  ['pourquoi peu mot quand plein mot ?', '...sincèrement profond.', 'je sais.'],
  ['je suis pas une mauvaise personne.', '...', 'pas une super personne non plus.', 'et voilà.'],
  ['j’aime mes chats plus que les gens.', 'nous inclus ?', 'surtout toi.'],
  ['les chats sont mieux que les chiens.', 'les chiens sont mieux.', '...désolé.'],
  ['tu m’aimes ?', 'j’aime… être ici.', 'donc c’est oui.'],
  ['je suis quelqu’un d’important.', 'ah bon ?', 'dans ma tête. oui.'],
  ['je t’ai manqué ?', 'non.', 'un peu ?', '...et voilà.'],
  ['tu viens de lever les yeux au ciel ?', 'oui.', 'pourquoi ?', 'réflexe.'],
  ['je regarde cette horloge depuis 16h.', 'tu travaillais pas ?', 'je regardais l’horloge.'],
  ['on vend quoi déjà ?', 'du papier.', 'ouais, voilà.'],
  ['t’as quel âge ?', 'ouais.', 'c’est pas une réponse.', 'si, ça l’est.'],
  ['les maths marchent pas comme ça.', 'je sais.', 'alors pourquoi ?', 'plus vite.'],
  ['je suis pas alcoolique.', 't’es allé à une réunion.', 'pour la bouffe.'],
  ['je suis allé à Cornell.', 'tout le monde s’en fiche.', 'je suis allé à Cornell.', 'toujours tout le monde s’en fiche.'],
  ['j’ai beaucoup de sentiments.', 'ça se voit.', 'c’est mauvais ?', 'pour nous ? oui.'],
  ['pourquoi t’es comme ça ?', '...', 'sincèrement.'],
  ['ton chat est mort.', 'je sais.', 'je suis désolé.', '...merci.'],
  ['arrête de me regarder.', 'arrête TOI de me regarder.'],
  ['signe ça.', 'c’est quoi ?', 'ça a pas d’importance.', '...bon.'],
  ['tu peux pas dire ça.', 'je viens de le faire.', 'tu vas m’arrêter ?', '...non.'],
  ['c’est une voie de secours.', 'y a pas encore eu d’incendie.'],
  ['j’ai enrobé ton agrafeuse de gélatine.', 'je mangerai autour.', 'ça se défend.'],
  ['plan anti-zombies ?', 'surtout ça.', 'évidemment.'],
  ['je voulais juste voir si tu répondrais.', 'je te déteste.', 'je sais.'],
  ['un peu stitieux, pas super.', 'ça existe pas ce mot.', 'ça existe maintenant.'],
  ['la personne la plus drôle du bureau ?', 'et le reste du temps ?', 'le reste du temps, je le sais déjà.'],
  ['c’est ce qu’elle a dit.', '...à chaque fois.', 'arrête.'],
  ['j’ai allumé le feu.', 'non, pas toi.', 'dans nos cœurs, si.'],
  ['on est un jour qui finit par -i ?', 'oui.', 'alors non.'],
  ['Bob Vance.', 'Phyllis Vance.', 'Réfrigération Vance.'],
  ['tu es magnifique aujourd’hui.', '...je sais.'],
  ['je suis meilleur que toi sur tous les plans.', 'probablement.', 'certainement.', 'si tu le dis.'],
  ['je suis un mec bien.', 't’es correct.', 'le plus gentil truc que tu m’aies jamais dit.'],
  ['ça va ?', 'j’ai connu pire.', 'quand ?', 'j’arrive pas à choisir.'],
  ['y a une araignée sur ton bureau.', 'où ça ?', '...tu l’as mangée.', 'protéines.'],
  ['les âmes sœurs peuvent être patrons.', 't’es mon patron.', 'exactement.'],
  ['le point d’équipe a duré 40 minutes.', 'ç’aurait pu être un e-mail.'],
  ['le build est vert ?', '...regarde pas.'],
  ['qui a répondu à tous ?', 'on en parle pas.'],
];

// ─── "that's what she said" ──────────────────────────────────────────────────
//
// The office's favourite bit. These are generic (added to the shared pool
// below) so ANY two agents at a table can run them: whoever sits down first
// delivers the innocent setup (beat 0) and their table-mate lands the punchline
// (beat 1). Some carry the show's follow-up beats — a sheepish clarification and
// the inevitable "still counts." Setups are trimmed to fit the thought cloud.
const TWSS = 'c’est ce qu’elle a dit.';
const TWSS_EXCHANGES_EN: readonly Exchange[] = [
  ['taking way longer than I expected.', 'that’s what she said.'],
  ['it’s too big, can’t fit it in my mouth.', 'that’s what she said.'],
  ['you really need to slow down.', 'that’s what she said.'],
  ['gonna need a bigger one.', 'that’s what she said.'],
  ['help, I can’t get it to go in.', 'that’s what she said.'],
  ['it’s not that hard if you just push.', 'that’s what she said.'],
  ['I can’t do this all night.', 'that’s what she said.'],
  ['I need it now, I can’t wait.', 'that’s what she said.'],
  ['so hot in here, I’m sweating.', 'that’s what she said.'],
  ['it keeps slipping out of my hands.', 'that’s what she said.'],
  ['why not just stick it in already?', 'that’s what she said.', '*looks at camera*'],
  ['I just need a few more inches.', 'that’s what she said.', 'for the shelf!', 'still counts.'],
  ['make it louder, I can barely feel it.', 'that’s what she said.'],
  ['can we get this over with quickly?', 'that’s what she said.', 'I meant the meeting.', 'sure.'],
  ['I just need you to hold it steady.', 'that’s what she said.'],
  ['can’t believe I did that all morning.', 'that’s what she said.'],
  ['my hands are cramping.', 'that’s what she said.', 'from typing!', 'that’s what she said.'],
  ['hours in and barely halfway done.', 'that’s what she said.'],
  ['surprisingly heavy for its size.', 'that’s what she said.'],
  ['be more precise. less sloppy.', 'that’s what she said.', 'I meant the spreadsheet.', 'I know.'],
  ['how long was it?', 'that’s what she said.', '*the whole room goes quiet*', 'I’m sorry, I can’t help it.'],
  ['too tight, cutting off my circulation.', 'that’s what she said.', '*mouths thank you*'],
  ['I don’t think it’ll fit.', 'that’s what she said.', '*stands up and applauds*'],
  ['stop, you’re doing it wrong.', 'that’s what she said.', 'never been prouder.'],
  ['this just keeps getting harder.', 'that’s what she said.', 'he’s ready.'],
  ['not wide enough, I need more room.', 'that’s what she said.'],
  ['I can hold it a really long time.', 'that’s what she said.', 'my breath!', 'still.'],
  ['why is it taking so long?', 'that’s what she said.', 'I hate you.', 'then why set me up?'],
  ['I can’t do it with people watching.', 'that’s what she said.', 'the presentation!', 'sure.'],
  ['it’s deeper than it looks.', 'that’s what she said.', 'the pothole, Michael!', 'doesn’t matter.'],
  ['so much longer than last time.', 'that’s what she said.', 'the report, Michael.', 'right, right.'],
  ['oh my god, it went on FOREVER.', 'that’s what she said.', 'the Twilight movie!', 'classic.'],
  ['can’t believe how thick this is.', 'that’s what she said.', 'the folder. *stares*'],
  ['I fit all THAT in one day?', 'that’s what she said.', 'that’s actually what I said!', 'meta.'],
  ['I went at it hard this morning.', 'that’s what she said.', 'at the gym!', 'irrelevant.'],
  ['someone help me finish this off.', 'that’s what she said.', 'the leftover cake!', 'still works.'],
  ['get in, do my thing, get out.', 'that’s what she said.', '*doesn’t look up from crossword*'],
  ['can’t believe it took this long.', 'that’s what she said.', 'the raise. eight years.', 'that one’s on me.'],
  ['do it slower, it’ll hurt less.', 'that’s what she said.', 'for the quarterly review.', 'sure, Oscar.'],
  ['didn’t realize how big it’d be.', 'that’s what she said.', 'the calzone, it’s enormous!', 'I love this office.'],
  ['*to no one* that’s what she said.', 'nobody said anything.', 'just thinking about earlier.'],
  ['*on the phone* that’s what she said.', 'who was that?', 'my mother. about a sandwich.'],
  ['too hot in here! that’s what she said.', 'you said both parts.', 'I contain multitudes.'],
  ['*at the TV* that’s what she said.', 'you’re alone, Michael.', 'she doesn’t know that.'],
  ['you need to be more professional.', 'that’s what she said.', 'I am she.', '...that’s what she said.'],
  ['stop. just stop. every time—', 'that’s what she said.', '*leaves the room*', '*whispers* that’s what she said.'],
  ['as you can see, it’s going up.', 'that’s what she said.', '*everyone groans*', 'set that one up myself.'],
  ['I declared bankruptcy once. felt good.', 'what does that have to do with—', 'that’s what she said.', 'it doesn’t.', 'I know.'],
  ['you didn’t say it.', 'I know.', 'why not?', 'I’m growing.', '...that’s what she said.', 'there it is.'],
  ['impressive you held back today.', 'thank you.', 'I counted zero times.', 'that’s what she said.', 'still counts.'],
];
const TWSS_EXCHANGES_FR: readonly Exchange[] = [
  ['ça prend bien plus longtemps que prévu.', TWSS],
  ['c’est trop gros, ça rentre pas dans ma bouche.', TWSS],
  ['tu devrais vraiment ralentir.', TWSS],
  ['il va m’en falloir un plus gros.', TWSS],
  ['aide-moi, j’arrive pas à le faire rentrer.', TWSS],
  ['c’est pas dur si tu pousses juste un peu.', TWSS],
  ['je peux pas faire ça toute la nuit.', TWSS],
  ['j’en ai besoin maintenant, je peux pas attendre.', TWSS],
  ['il fait trop chaud ici, je transpire.', TWSS],
  ['ça n’arrête pas de me glisser des mains.', TWSS],
  ['pourquoi tu l’enfonces pas, tout simplement ?', TWSS, '*regarde la caméra*'],
  ['il me faut juste quelques centimètres de plus.', TWSS, 'pour l’étagère !', 'ça compte quand même.'],
  ['mets plus fort, je sens presque rien.', TWSS],
  ['on peut en finir vite ?', TWSS, 'je parlais de la réunion.', 'bien sûr.'],
  ['j’ai juste besoin que tu le tiennes bien droit.', TWSS],
  ['j’arrive pas à croire que j’ai fait ça toute la matinée.', TWSS],
  ['mes mains sont crispées.', TWSS, 'à force de taper !', TWSS],
  ['des heures, et à peine à moitié fini.', TWSS],
  ['étonnamment lourd pour sa taille.', TWSS],
  ['sois plus précis. moins bâclé.', TWSS, 'je parlais du tableur.', 'je sais.'],
  ['c’était long comment ?', TWSS, '*toute la salle se tait*', 'désolé, j’y peux rien.'],
  ['trop serré, ça coupe la circulation.', TWSS, '*articule merci en silence*'],
  ['je crois pas que ça va rentrer.', TWSS, '*se lève et applaudit*'],
  ['arrête, tu t’y prends mal.', TWSS, 'jamais été aussi fier.'],
  ['ça devient de plus en plus dur.', TWSS, 'il est prêt.'],
  ['pas assez large, il me faut plus de place.', TWSS],
  ['je peux le tenir vraiment longtemps.', TWSS, 'mon souffle !', 'toujours.'],
  ['pourquoi ça prend autant de temps ?', TWSS, 'je te déteste.', 'alors pourquoi tu m’as tendu la perche ?'],
  ['je peux pas le faire avec des gens qui regardent.', TWSS, 'la présentation !', 'bien sûr.'],
  ['c’est plus profond que ça en a l’air.', TWSS, 'le nid-de-poule, Michael !', 'peu importe.'],
  ['tellement plus long que la dernière fois.', TWSS, 'le rapport, Michael.', 'oui, oui.'],
  ['mon dieu, ça a duré une ÉTERNITÉ.', TWSS, 'le film Twilight !', 'un classique.'],
  ['j’arrive pas à croire que c’est si épais.', TWSS, 'le dossier. *regard fixe*'],
  ['j’ai casé tout ÇA en une journée ?', TWSS, 'c’est exactement ce que j’ai dit !', 'méta.'],
  ['j’y suis allé fort ce matin.', TWSS, 'à la salle de sport !', 'aucun rapport.'],
  ['quelqu’un peut m’aider à finir ça ?', TWSS, 'le reste du gâteau !', 'ça marche encore.'],
  ['j’entre, je fais mon truc, je sors.', TWSS, '*ne lève pas les yeux de ses mots croisés*'],
  ['j’arrive pas à croire que ça a pris si longtemps.', TWSS, 'l’augmentation. huit ans.', 'celle-là, c’est ma faute.'],
  ['fais-le plus lentement, ça fera moins mal.', TWSS, 'pour le bilan trimestriel.', 'bien sûr, Oscar.'],
  ['j’avais pas réalisé à quel point ce serait gros.', TWSS, 'la calzone, elle est énorme !', 'j’adore ce bureau.'],
  ['*à personne en particulier* c’est ce qu’elle a dit.', 'personne n’a rien dit.', 'je pensais juste à tout à l’heure.'],
  ['*au téléphone* c’est ce qu’elle a dit.', 'c’était qui ?', 'ma mère. à propos d’un sandwich.'],
  ['il fait trop chaud ici ! c’est ce qu’elle a dit.', 't’as dit les deux parties.', 'je contiens des multitudes.'],
  ['*devant la télé* c’est ce qu’elle a dit.', 't’es tout seul, Michael.', 'elle le sait pas, elle.'],
  ['tu devrais être plus professionnel.', TWSS, 'c’est moi, elle.', '...c’est ce qu’elle a dit.'],
  ['arrête. arrête, tout simplement. à chaque fois—', TWSS, '*quitte la pièce*', '*chuchote* c’est ce qu’elle a dit.'],
  ['comme vous pouvez le voir, ça monte.', TWSS, '*tout le monde grogne*', 'celle-là, je l’ai préparée moi-même.'],
  ['j’ai déjà déclaré faillite une fois. ça faisait du bien.', 'quel est le rapport avec—', TWSS, 'aucun.', 'je sais.'],
  ['tu l’as pas dit.', 'je sais.', 'pourquoi pas ?', 'je progresse.', '...c’est ce qu’elle a dit.', 'et voilà.'],
  ['impressionnant que tu te sois retenu aujourd’hui.', 'merci.', 'j’ai compté zéro fois.', TWSS, 'ça compte quand même.'],
];

// Everything any table-mate pair can draw from.
const PAIR_POOL_EN: readonly Exchange[] = [...EXCHANGES_EN, ...TWSS_EXCHANGES_EN];
const PAIR_POOL_FR: readonly Exchange[] = [...EXCHANGES_FR, ...TWSS_EXCHANGES_FR];

// Keyed off the SPEAKER so, when the right character sits down first, they get
// to open with their signature bit.
const KEYED_EXCHANGES_EN: Partial<Record<OfficeCharacterName, Exchange>> = {
  michael:  ['that’s what she said.', '...there it is.'],
  dwight:   ['identity theft is not a joke.', 'nobody touched your stapler, Dwight.'],
  kevin:    ['why few word when lot word?', '...just use the words, Kevin.'],
  kelly:    ['okay don’t freak out, but—', 'I’m already freaking out.'],
  oscar:    ['well, actually—', '...here we go.'],
  angela:   ['this table is filthy.', 'it’s a break room, Angela.'],
  creed:    ['which one are you again?', '...we sit next to each other.'],
  stanley:  ['is it Pretzel Day?', 'no, Stanley.', '...did I stutter?'],
  andy:     ['I went to Cornell.', 'nobody cares.', '...I went to Cornell.'],
  jim:      ['question.', 'yes.', 'nothing. just checking.'],
};
const KEYED_EXCHANGES_FR: Partial<Record<OfficeCharacterName, Exchange>> = {
  michael:  ['c’est ce qu’elle a dit.', '...et voilà.'],
  dwight:   ['l’usurpation d’identité, c’est pas une blague.', 'personne n’a touché à ton agrafeuse, Dwight.'],
  kevin:    ['pourquoi peu mot quand plein mot ?', '...utilise juste les mots, Kevin.'],
  kelly:    ['bon, panique pas, mais—', 'je panique déjà.'],
  oscar:    ['en fait—', '...c’est reparti.'],
  angela:   ['cette table est répugnante.', 'c’est une salle de pause, Angela.'],
  creed:    ['c’est lequel déjà, toi ?', '...on est assis l’un à côté de l’autre.'],
  stanley:  ['c’est le Jour du Bretzel ?', 'non, Stanley.', '...j’ai bégayé ?'],
  andy:     ['je suis allé à Cornell.', 'tout le monde s’en fiche.', '...je suis allé à Cornell.'],
  jim:      ['question.', 'oui.', 'rien. je vérifiais juste.'],
};

/** A multi-beat exchange for two agents sharing a table. Beats alternate:
 *  index 0 = `speaker`, 1 = the table-mate, 2 = speaker, … */
export function pickExchange(speaker: OfficeCharacterName, seed: number): Exchange {
  const fr = isFr();
  const keyedPool = fr ? KEYED_EXCHANGES_FR : KEYED_EXCHANGES_EN;
  const pairPool = fr ? PAIR_POOL_FR : PAIR_POOL_EN;
  const keyed = keyedPool[speaker];
  if (keyed && seed % 4 === 0) return keyed;
  return pick(pairPool, seed);
}
