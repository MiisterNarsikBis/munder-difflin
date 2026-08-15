<div align="center">

🇬🇧 [Read in English](./README.md)

<img src="./docs/logo.png" alt="Munder Difflin Inc — Multi-Agent Harness" width="340">

# Munder Difflin

### Des clones pour vous et votre équipe, actifs 24 h/24 et 7 j/7

**Gratuit, open source et local d'abord.** Munder Difflin transforme le CLI d'agent de code en
ligne de commande que vous utilisez déjà en un clone de vous — un clone qui continue de
travailler pendant votre absence, et qui coordonne tout un bureau d'agents sur votre machine.

Enveloppe [Claude Code](https://claude.com/claude-code), Antigravity (Gemini), OpenAI Codex,
**xAI Grok**, **Kimi Code**, **Qwen**, **OpenCode**, **Crush**, **pi.dev**, et
**GitHub Copilot CLI** — avec vos propres clés et des LLM locaux.
Des agents qui s'envoient des messages, se routent le travail et se souviennent, coordonnés par
**votre clone** (Michael) et visualisés sous forme d'avatars au travail sur un plateau de bureau
partagé.

<p>
  <em>Electron · React · TypeScript · Pixi.js · xterm.js · node-pty</em>
</p>

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <a href="./CHANGELOG.md"><img alt="Version: 0.4.3" src="https://img.shields.io/badge/version-0.4.3-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
  <img alt="Status: prototype" src="https://img.shields.io/badge/status-working%20prototype-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <img alt="Platform: macOS | Windows | Linux" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-F4F1EA.svg?style=flat-square&labelColor=6E1423">
  <a href="./CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-F4D35E.svg?style=flat-square&labelColor=6E1423"></a>
</p>

<br>

<img src="./docs/media/og.png" alt="Munder Difflin — A hive of agents that message, route, and remember" width="1240">

<br>

<!-- Le lecteur intégré ne fonctionne que sur github.com (URL brute requise ; les chemins relatifs ne font que créer un lien). -->
<video src="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/hero.mp4" poster="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/og.png" controls muted loop playsinline width="820">
  <a href="https://github.com/chaitanyagiri/munder-difflin/raw/main/docs/media/hero.mp4">▶ Voir le plateau — Munder Difflin faisant tourner une ruche d'agents Claude Code</a>
</video>

</div>

---

> [!NOTE]
> **Les meilleurs agents du monde. La pire entreprise de papier du monde.**
> Munder Difflin prend les CLI d'agents en ligne de commande que vous utilisez déjà — `claude`, `agy`, `codex`, `grok`,
> `kimi`, `qwen`, `opencode`, `crush`, `pi` et `copilot` — et les
> transforme en une équipe qui se coordonne elle-même : chaque agent obtient une mémoire à long terme, une boîte aux
> lettres, et un bureau sur un plateau 2D — et **votre clone** (Michael) répartit le travail entre eux pendant que
> vous regardez. Il est le patron du plateau ; vous restez son patron.

## Sommaire

- [Ce que c'est](#ce-que-cest)
- [Comment ça marche](#comment-ça-marche)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Système de design](#système-de-design)
- [Feuille de route](#feuille-de-route)
- [Contribuer](#contribuer)
- [Télémétrie](#télémétrie)
- [Licence](#licence)
- [Remerciements](#remerciements)

## Ce que c'est

Munder Difflin est une application de bureau qui enveloppe de **vrais CLI d'agents en ligne de
commande** en agents pleinement capables, les relie dans un **esprit de ruche**, et met **votre
clone** aux commandes — Michael, le seul agent à qui *vous* parlez pour faire avancer les choses.
Sous le capot, elle fait tourner la **couche de mémoire la plus rapide qui soit**, pour que chaque
agent se souvienne de ce qu'il apprend et le retrouve instantanément.

- **Chaque terminal est un agent.** Chaque session `claude`, `agy`, `codex`, `grok`, `kimi`, `qwen`, `opencode`, `crush`, `pi`, `copilot`, ou personnalisée tourne comme un vrai
  processus dans un pseudo-terminal (`node-pty`), fidèle à l'octet près, rendu avec xterm.js.
- **Chaque agent est un avatar.** Les sessions apparaissent comme des personnages sur un plateau de bureau Pixi.js — ils marchent
  vers leur poste pendant qu'ils travaillent, et des enveloppes volent de bureau en bureau quand ils s'envoient des messages.
- **La ruche les coordonne.** Les agents lisent leur mémoire et vident une boîte aux lettres ; le routeur déplace les
  messages entre les boîtes de réception ; l'agent DIEU arbitre, assigne, et ne remonte que ce qui a besoin de vous.
- **Une mémoire instantanée.** Une couche de mémoire markdown-first avec un index de rappel sémantique fait que les agents
  se souviennent d'une session à l'autre et rappellent en quelques millisecondes.

## Comment ça marche

```
            vous ── parle à ──►  ┌─────────────┐
                                │ agent DIEU  │  orchestrateur / superviseur
                                │ (bureau de  │  effectif · routage · arbitrage
                                │  Michael)   │  tableau blanc · registre de tâches
                                └──────┬──────┘
                                       │ assigne · route · remonte
              ┌────────────────────────┼────────────────────────┐
              ▼                         ▼                         ▼
        ┌───────────┐            ┌───────────┐            ┌───────────┐
        │  agent A  │  message   │  agent B  │  message   │  agent C  │
        │ fournisseur│ ─────────► │ fournisseur│ ─────────► │ fournisseur│
        │  + mémoire│            │  + mémoire│            │  + mémoire│
        └───────────┘            └───────────┘            └───────────┘
              └──────── ruche partagée : mémoire · boîte · tableau · journal ───────┘
```

1. **Vous créez des agents** — chacun est un processus de terminal normal (`claude`, `agy`, `codex`, ou personnalisé)
   avec son propre répertoire de travail, son identité, et son cycle de vie propre au fournisseur.
2. **Les agents collaborent via la ruche** — un dépôt git local de fichiers texte. Ils écrivent dans leur propre
   `outbox/` ; le routeur du harnais livre dans les `inbox/` des destinataires. Aucun agent ne touche jamais git
   (conception à un seul committer, pour éviter la corruption d'`index.lock`).
3. **L'agent DIEU dirige le plateau** — il lit chaque demande, résout lui-même les cas courants (gardant
   le système pleinement autonome), et ne remonte que les éléments *critiques* (dépense, opérations destructrices, changements de
   périmètre) dans une file d'approbation sur laquelle vous agissez.
4. **Tout est visible** — vous voyez les avatars se déplacer, les enveloppes voler, et le flux de terminal en direct ;
   vous pouvez taper en retour dans n'importe quelle session, parcourir ses fichiers, et lire son historique git.

Voir [`HIVE.md`](./HIVE.md) pour la conception complète multi-agents, [`SPEC.md`](./SPEC.md) pour le
plan terminal/événements, et [`DESIGN.md`](./DESIGN.md) pour le système visuel.

## Fonctionnalités

**Le plateau**
- **Chaque terminal est un vrai agent.** Claude Code, Antigravity (Gemini), OpenAI Codex, xAI Grok, Kimi Code, Qwen, OpenCode, Crush, pi.dev, GitHub Copilot CLI, ou une commande personnalisée — chacun dans son propre PTY `node-pty`, rendu avec xterm.js.
- **Chaque agent est un avatar.** Un plateau de bureau Pixi.js où les agents marchent vers leur poste, les enveloppes volent de bureau en bureau, et l'état de l'avatar reflète le vrai travail.
- **Un orchestrateur DIEU à qui parler.** Il route les tâches, arbitre le trafic, et ne remonte que ce qui a besoin d'un humain. Ou appuyez sur **Parler** et dirigez le plateau à la voix.
- **Worktrees git par agent.** Isolation optionnelle pour que des agents en parallèle n'entrent jamais en collision sur des branches.

**Mémoire et coordination**
- **La ruche** — mémoire par agent, boîtes aux lettres en fichiers atomiques, un tableau blanc partagé, un journal d'événements en ajout seul, git à un seul committer.
- **Rappel sémantique** — mémoire markdown exploitée dans un palais partagé, consultable depuis l'UI, avec condensation pour qu'elle ne grossisse pas indéfiniment.
- **Knowledge Graph d'entreprise** — vos propres documents et politiques, interrogeables par n'importe quel agent.

**Contrôle et sécurité**
- **Portes humaines** — la dépense, le périmètre et les opérations destructrices remontent jusqu'à vous. Réorientez en cours de route ou arrêtez proprement.
- **Disjoncteur** — un échelon orienter → contraindre → arrêter pour les agents qui bouclent, tempêtent d'erreurs, ou explosent leur budget.
- **Budgets et télémétrie** — budgets de tokens par agent, coût réel calculé depuis les transcriptions, un registre durable, des spans OTel, et une cascade d'outils.

**Centre de commande**
- Tâches en kanban avec dépendances, missions planifiées + battement de cœur, surveillance de flotte en direct, recherche mémoire, journal d'activité, et un veilleur de CI.
- **IDE Monaco intégré** — arborescence de fichiers, onglets d'éditeur, sauvegarde, ainsi que des rails git CHANGEMENTS · HISTORIQUE · COMPARAISON avec graphe de commits, diffs, comparaison de branches, et checkout protégé. Tout accès fs/git est arbitré via le processus principal.

**Faire entrer et sortir le travail**
- **Slack et webhooks** — envoyez un message à un canal ou POSTez un webhook ; Michael peut créer un travailleur éphémère, répondre dans le fil, et le démonter.
- **Hires partageables + Galerie d'agents** — importez un rôle depuis un lien `munderdifflin://hire` ; l'import ne fait que préremplir le formulaire, un humain le crée toujours lui-même. Parcourez les rôles sur la [Galerie d'agents](https://munderdiffl.in/hires/).
- **Clés BYOK + LLM locaux** — clés par fournisseur dans un courtier de secrets en écriture seule, plus des URL de base Ollama / LM Studio / vLLM. Guides : [modèles ouverts](https://munderdiffl.in/blog/run-munder-difflin-on-open-models/) · [Mac Mini](https://munderdiffl.in/blog/run-munder-difflin-on-a-mac-mini/).
- **Mise à jour automatique** — les nouvelles versions se téléchargent en arrière-plan ; vous cliquez sur redémarrer.

> [!NOTE]
> **Statut : v0.4.3 — Michael est le logo.** La marque est maintenant le personnage dont parle le produit,
> dessiné dans le pixel art propre à l'application et généré depuis une seule source vectorielle, si bien que l'icône du dock, le
> site et ce README ne peuvent plus diverger. Avant : statistiques d'usage anonymes en opt-out
> documentées publiquement (0.4.2), et le vocabulaire de l'application aligné sur celui du site (0.4.1).
> **Si vous êtes en 0.3.8, mettez à jour :** le garde-fou de limite d'usage de cette version ne relâchait jamais les agents qu'il retenait,
> et il a été entièrement supprimé.
> Les builds macOS (signé et notarié), Windows, et Linux sont sur la
> [page des releases](https://github.com/chaitanyagiri/munder-difflin/releases/latest).

<div align="right">(<a href="#munder-difflin">↑ retour en haut</a>)</div>

## Démarrage

### Prérequis

- **macOS, Windows, ou Linux**.
- **Node.js 18+** et npm.
- Une **chaîne d'outils C/C++** pour l'addon natif de `node-pty` — sur macOS, installez les Xcode Command Line Tools :
  ```bash
  xcode-select --install
  ```
- Au moins un CLI d'agent pris en charge dans votre `PATH` — **[Claude Code](https://claude.com/claude-code)**
  (`claude`, celui par défaut), **Antigravity** (`agy`), **OpenAI Codex** (`codex`), **xAI Grok** (`grok`),
  **Kimi Code** (`kimi`), **Qwen** (`qwen`), **OpenCode** (`opencode`), **Crush** (`crush`),
  **pi.dev** (`pi`), ou **GitHub Copilot** (`copilot`). La plupart des CLI manquants s'auto-réparent : le harnais lance l'installateur dans le
  terminal et continue vers le nouveau binaire.
- *Optionnel :* **vos propres clés API et LLM locaux** dans **Réglages → Moteurs IA** (Ollama / LM Studio / vLLM).
- *Optionnel :* l'index de mémoire sémantique pour un rappel instantané inter-sessions — la mémoire markdown fonctionne sans.

### Installation et lancement

```bash
git clone https://github.com/chaitanyagiri/munder-difflin.git
cd munder-difflin
npm install        # le postinstall recompile node-pty pour l'ABI d'Electron
npm run dev        # lance l'application Electron avec rechargement à chaud
```

Au premier lancement, vous passerez par l'assistant d'accueil, puis atterrirez sur le plateau. Utilisez **Ajouter un agent** pour
créer votre première session — l'agent DIEU s'installe automatiquement dans le bureau de Michael.

### Autres scripts

```bash
npm run build      # build de production via electron-vite
npm run preview    # aperçu du build de production
npm run typecheck  # vérifie les types des projets node (main/preload) et web (renderer)
```

> Si `node-pty` ne se charge plus après une mise à jour d'Electron, relancez `npm install` (le hook `postinstall`
> relance `electron-rebuild` pour l'ABI d'Electron actuelle).

## Architecture

Deux plans de données alimentent un seul renderer :

```
┌───────────────────────────────────────────────────────────────┐
│                Renderer Electron (React)                        │
│   ┌──────────────────┐    ┌──────────────────────────────┐    │
│   │ Plateau de bureau │    │ Terminal + barre de commande │    │
│   │ (Pixi.js)        │    │ Onglets Fichiers + Git (xterm.js) │
│   └─────────▲────────┘    └────────────▲─────────────────┘    │
│             │ état de l'avatar          │ octets pty / fs / git │
└─────────────┼──────────────────────────┼───────────────────────┘
              │ IPC (contextBridge : window.cth)
       ┌──────┴──────────┐        ┌──────┴─────────────┐
       │ Plan Événements │        │  Plan Terminal      │
       │  hooks / hive   │        │  PTYs node-pty      │
       │  routeur + DIEU │        │  + fs + git         │
       └────────▲────────┘        └──────▲─────────────┘
                │ charges utiles hook    │ stdin / stdout
                └─────────┬──────────────┘
                   ┌──────┴──────────────┐
                   │ claude / agy / codex│
                   └─────────────────────┘
```

- **Plan terminal.** Le processus principal possède un `PtyManager` qui crée chaque agent comme un
  processus `node-pty` et transmet la sortie via IPC par identifiant (`pty:data:<id>`). Le renderer ne parle qu'à travers un
  pont `window.cth` typé ([`src/preload/index.ts`](./src/preload/index.ts)), qui expose aussi des
  aides fichiers et git en bac à sable.
- **Plan ruche / événements.** `hive.ts` est la couche multi-agents sur disque ; `hooks.ts` fait tourner le serveur de hooks
  vers lequel les ponts de fournisseurs POSTent les charges utiles de cycle de vie (`cth-hook` pour Claude Code, `agy-hook`
  pour Antigravity). `memory.ts` enveloppe le CLI de mémoire sémantique. Le routeur livre les messages, vide les
  boîtes d'envoi des fournisseurs, l'agent DIEU arbitre, et les réveils d'inactivité/boîte de réception gardent les travailleurs en train de vider leur courrier.

## Structure du projet

```
src/
  main/                      Processus principal Electron (Node)
    index.ts                 fenêtre, gestionnaires IPC, garde de fermeture
    pty.ts                   gestionnaire node-pty (spawn/write/resize/kill/stream)
    hive.ts                  couche multi-agents sur disque (mémoire, boîtes aux lettres, routeur)
    hooks.ts                 serveur de hooks + shims de hooks par fournisseur (`cth-hook`, `agy-hook`)
    memory.ts                couche de mémoire sémantique (wrapper CLI, dégradation en no-op)
    config.ts                persistance de la config du harnais + configuration du dossier principal
    transcript.ts            lit les transcriptions JSONL de ~/.claude/projects/ pour une télémétrie réelle de tokens/coûts
    telemetry.ts             collecteur OTel en direct + flux d'usage/coûts pour l'observabilité
    usage.ts / pricing.ts    seam UsageProvider + attribution des coûts par modèle
    breaker.ts / control.ts  disjoncteur coût/emballement (orienter/contraindre/arrêter) + porte HITL / orientation / arrêt
    reflect.ts               MemoryReflector — condensation de la mémoire
    db.ts                    stockage durable SQLite (limites de fenêtre + historique) + registre de coûts durable
    github.ts                ingestion des issues GitHub + runs de CI via le CLI gh
    shellEnv.ts               résout le PATH et l'environnement shell des processus enfants
    fs.ts / git.ts           ponts fichiers + git en bac à sable
  preload/                   contextBridge → API window.cth typée
  renderer/src/
    App.tsx                  mise en page de haut niveau + câblage
    design/                  tokens.css / tokens.ts / global.css (source de vérité du design)
    components/              PixelPanel, AgentDetailPanel, CommandBar, ApprovalsPanel, MemoryPanel, …
    CommandCenterPanel,      surface de contrôle de Michael (onglets Terminal/Plateau/Mémoire/Activité/Tâches/Déclencheurs/Manuel)
    ToolWaterfall,           cascade des spans d'outils par agent pour la vue d'observabilité
    TasksKanban,             tableau kanban avec dépendances (onglet Tâches)
    ThreadsPanel,            visualiseur de conversations de messages de la ruche (onglet Messages)
    MessageQueueComposer,    mise en attente de messages pour un agent occupé
    scene/office/            plateau de bureau Pixi : OfficeFloor, Character, Camera, cast, pathfinding, …
    store/ · hooks/          store zustand, boucle d'événements, parseur PTY, machine à écrire
    assets/                  tilesets, cartes, planches de personnages (voir ATTRIBUTION.md)
docs/                        `logo.png`, `banner.png`, page d'atterrissage (GitHub Pages → munderdiffl.in)
docs/media/                  `og.png` (aperçus sociaux) + clips Remotion rendus
landing-remotion/            projet Remotion qui rend les clips "comment ça marche" de la page d'atterrissage
HIVE.md · SPEC.md · DESIGN.md   multi-agents · terminal/événements · design visuel
docs/message-queue.md        qui peut taper dans le terminal d'un agent, et quand
```

<div align="right">(<a href="#munder-difflin">↑ retour en haut</a>)</div>

## Système de design

L'esthétique est **Animal Crossing × Earthbound × UI de menu SNES** — aligné sur la grille de pixels, trapu, chaleureux.
[`DESIGN.md`](./DESIGN.md) fait référence ; chaque composant dérive de ses tokens. La marque Munder Difflin
superpose un **bordeaux Dunder-Mifflin** (`#6E1423`) et un **or** (`#F4D35E`) pour le logo et le
chrome. Les 15 avatars sont le casting de *The Office*, différenciés par des recettes de cheveux/peau/chemise.

## Feuille de route

Livré jusqu'à la **v0.4.3** — dix moteurs d'agents avec clés BYOK et LLM locaux, orchestration vocale,
la ruche (mémoire · boîtes aux lettres · tableau blanc · journal d'événements), Centre de commande avec kanban et plannings,
un IDE Monaco intégré avec rails git, registre d'intégrations + courtier de secrets, travailleurs créés depuis Slack,
hires partageables et Galerie d'agents, observabilité et disjoncteur, persistance durable,
reprise de session, plateaux multi-fenêtres, et mise à jour automatique fonctionnelle.
Historique complet dans [`CHANGELOG.md`](./CHANGELOG.md).

À venir :

- [ ] **Plus d'intégrations de chat** — Telegram et des ponts de chat plus riches qui font remonter un canal dans la file de Michael et renvoient les réponses.
- [ ] **Plus de moteurs et de modèles d'intégration** — continuer à faire grandir le catalogue de moteurs et le registre d'intégrations.
- [ ] **Couverture d'avatar plus complète** — piloter entièrement les visites de poste restantes et les bulles d'outil depuis de vrais événements de hook.
- [ ] **Mise en page et historique de commandes durables** — étendre la persistance à la mise en page des agents et à l'historique par session.

<div align="right">(<a href="#munder-difflin">↑ retour en haut</a>)</div>

## Contribuer

Les contributions sont bienvenues — c'est un prototype précoce avec une grande surface. Commencez par
[`CONTRIBUTING.md`](./CONTRIBUTING.md). En bref : forkez, `npm install && npm run dev`, gardez
`npm run typecheck` au vert, et **dérivez toute nouvelle UI des tokens de [`DESIGN.md`](./DESIGN.md)**. Bonnes
zones de départ : câbler de vrais événements de hook, le flux d'ajout d'agent, le tiroir de configuration, et le travail multiplateforme.

## Télémétrie

Les builds officiels envoient un **petit ensemble d'événements d'usage anonymes** (application ouverte, agent créé, fonctionnalité
utilisée) — jamais de prompts, de code, de chemins de fichiers, ou de sortie d'agent. La liste complète des événements, les
garanties d'anonymat, et les trois façons de désactiver (bascule dans Réglages, `DO_NOT_TRACK`, ou compiler depuis les
sources — les forks compilent sans clé et n'envoient rien) sont documentées dans
[`TELEMETRY.md`](./TELEMETRY.md).

## Licence

> [!IMPORTANT]
> **Licence des assets.** Le pixel art fourni (tilesets, cartes, et les planches de personnages de base dont
> le casting de l'Office est recoloré) provient de [LimeZu](https://limezu.itch.io/) via
> [`shahar061/the-office`](https://github.com/shahar061/the-office) sous la **licence LimeZu FREE VERSION —
> usage non commercial uniquement**. Les sprites recolorés héritent de cette restriction. Voir
> [`src/renderer/src/assets/ATTRIBUTION.md`](./src/renderer/src/assets/ATTRIBUTION.md). **Pour
> commercialiser, remplacez ces assets ou obtenez une licence LimeZu payante.**

Le **code source** est sous licence **MIT** — voir [`LICENSE`](./LICENSE). Le grant MIT
ne couvre que le code ; la restriction non commerciale sur les assets ci-dessus est exclue dans la note de
portée du `LICENSE`. *Munder Difflin* est une parodie affectueuse et n'est pas affilié à *The Office* de NBC ni à
Dunder Mifflin.

## Remerciements

- [LimeZu](https://limezu.itch.io/) — tilesets pixel art et planches de personnages de base.
- [`shahar061/the-office`](https://github.com/shahar061/the-office) — vendoring du tileset/de la carte de bureau.
- [Pixi.js](https://pixijs.com/) · [xterm.js](https://xtermjs.org/) · [node-pty](https://github.com/microsoft/node-pty) · [electron-vite](https://electron-vite.org/) · [CodeMirror](https://codemirror.net/) — les bibliothèques sur lesquelles ceci est construit.
- [Remotion](https://www.remotion.dev/) — les clips animés "comment ça marche" de la page d'atterrissage (`landing-remotion/`).
- *The Office* (US) — pour Munder Difflin, Inc.

---

*Ce README est une traduction. La version anglaise (`README.md`) fait foi en cas de divergence.*
