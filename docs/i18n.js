/* ── EN/FR toggle for the Munder Difflin site ──────────────────────────────
   English lives in the HTML (canonical, unchanged). French lives here, one
   dictionary per page, keyed to `data-i18n` / `data-i18n-html` / `data-i18n-attr`
   attributes on the elements that carry it. Toggling swaps textContent /
   innerHTML / attributes against a cached copy of the original English, so
   there is nothing to keep in sync but this file.

   Scope: primary marketing/legal copy on index.html, wall.html, privacy.html
   and terms.html. NOT covered (left in English by design): the two
   architecture SVG diagrams, the live "office floor" simulation widget on the
   homepage (canvas + its dynamically-generated task/status strings), image
   alt text, and everything outside docs/ (blog, research notes, the app UI). */
(function () {
  'use strict';
  var LANG_KEY = 'mdf_lang';
  var origCache = new WeakMap(); // el -> { text?, html?, attrs?: {name: value} }

  function getLang() {
    var v;
    try { v = localStorage.getItem(LANG_KEY); } catch (e) {}
    return v === 'fr' ? 'fr' : 'en';
  }

  function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang === 'fr' ? 'fr' : 'en'); } catch (e) {}
  }

  function cacheFor(el) {
    var c = origCache.get(el);
    if (!c) { c = {}; origCache.set(el, c); }
    return c;
  }

  function dictFor(page) {
    var all = window.MDF_FR || {};
    return all[page] || {};
  }

  function apply(lang) {
    var page = document.documentElement.getAttribute('data-i18n-page');
    var dict = dictFor(page);
    var fr = lang === 'fr';

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var c = cacheFor(el);
      if (c.text === undefined) c.text = el.textContent;
      el.textContent = (fr && dict[key] !== undefined) ? dict[key] : c.text;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var c = cacheFor(el);
      if (c.html === undefined) c.html = el.innerHTML;
      el.innerHTML = (fr && dict[key] !== undefined) ? dict[key] : c.html;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var c = cacheFor(el);
      if (!c.attrs) c.attrs = {};
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var idx = pair.indexOf(':');
        if (idx < 0) return;
        var attr = pair.slice(0, idx).trim();
        var key = pair.slice(idx + 1).trim();
        if (c.attrs[attr] === undefined) c.attrs[attr] = el.getAttribute(attr) || '';
        el.setAttribute(attr, (fr && dict[key] !== undefined) ? dict[key] : c.attrs[attr]);
      });
    });

    document.documentElement.setAttribute('lang', lang);
  }

  window.MDF_I18N = { getLang: getLang, setLang: setLang, apply: apply };

  // safety net: translate as soon as the DOM exists, even if a page never
  // calls apply() itself (e.g. JS is disabled for the nav toggle for some
  // reason, or the toggle script hasn't run yet).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(getLang()); });
  } else {
    apply(getLang());
  }
})();

/* ── French dictionaries, one object per page ── */
window.MDF_FR = window.MDF_FR || {};
window.MDF_FR.index = {
  'nav.how': 'Comment ça marche',
  'nav.security': 'Sécurité',
  'nav.pricing': 'Tarifs',
  'nav.blog': 'Blog',
  'nav.download': 'Télécharger',

  'hero.taaftLabel': 'En vedette sur',
  'hero.h1u': 'Des clones pour',
  'hero.h1rest': 'vous et votre équipe',
  'hero.lead': '\n         <strong>Gratuit, open source et performant</strong>, ce harnais multi-agents agit comme votre clone numérique. Aucune configuration requise, il utilise votre abonnement existant.\n         <br>\n      ',
  'hero.downloadFree': 'Télécharger gratuitement',
  'hero.seeHow': 'Voir comment ça marche ↓',
  'hero.cliTitle': "Munder Difflin utilise des agents en ligne de commande qui tournent sur votre ordinateur pour faire tout ce que vous pouvez faire",
  'hero.cliSub': "Prend en charge 10 fournisseurs d'agents CLI dès l'installation, d'autres arrivent bientôt",
  'hero.figcaption': "Surveillez vos agents dans la simulation façon « bureau » ou passez au mode plein écran épuré. La simulation est déterministe et ne consomme aucun token.",

  'teams.kicker': 'CLOUD PRIVÉ + RÉSEAU',
  'teams.h2': 'Passez au plan Teams et doublez votre productivité',
  'teams.p': "\n          <br>\n          <b>Cloud privé :</b> faites tourner les agents 24 h/24 et 7 j/7 pour chaque coéquipier, dans des bacs à sable isolés\n          <br>\n          <b>Réseau privé :</b> permettez aux clones de votre équipe de se parler de façon autonome (chiffré de bout en bout)\n        ",

  'how.kicker': 'COMMENT ÇA MARCHE',
  'how.h2': 'Trois étapes pour un second vous.',
  'how.s1.h3': 'Installez votre nœud',
  'how.s1.p': "Un seul téléchargement. Il enveloppe l'agent CLI que vous utilisez déjà et tourne sur\n        <b>votre</b> ordinateur — ou sur une VM dédiée qui ne dort jamais. Votre code et\n        vos clés API restent dans votre environnement.",
  'how.s2.h3': 'Il devient vous',
  'how.s2.p': "Il capture votre façon de travailler, vos outils et vos connaissances. Le contexte de l'organisation est partagé\n        par tous les clones — un esprit de ruche dont hérite dès le premier jour le clone de chaque nouveau coéquipier —\n        tandis que le contexte personnel reste personnel.",
  'how.s3.h3': 'Les clones se mettent au travail',
  'how.s3.p': "Votre clone travaille en continu — et quand il a besoin d'un coéquipier, il\n        envoie un message au clone de <b>celui-ci</b>. Ils se passent le relais, synchronisent le contexte et se débloquent\n        mutuellement. Chiffré de bout en bout, nœud à nœud.",
  'how.c2c.msg1': "Bloqué — j'ai besoin des tokens de design pour l'état des factures.",
  'how.c2c.msg2': 'Envoyés — tokens + cas limites dans <code>billing/tokens.json</code>.',
  'how.c2c.done': '✓ débloqué pendant la nuit · PR #147 ouverte',
  'how.c2c.watch': 'Regarder un vrai relais en direct →',

  'cap.kicker': "CE QUE REÇOIT CHAQUE MEMBRE DE L'ÉQUIPE",
  'cap.h2': 'Comprendre les capacités du clone.',
  'cap.lead': "Munder Difflin ne donne pas à votre équipe un seul bot partagé. Il agit comme le clone de chaque individu et contrôle son ordinateur.",

  'what.kicker': 'PENDANT QUE VOUS ÊTES OCCUPÉ',
  'what.h2': 'Du vrai travail. Pas des démos.',
  'what.c1.h3': 'Relit comme vous le feriez',
  'what.c1.p': "Votre clone relit les PR de vos coéquipiers avec vos standards et vos remarques habituelles —\n        pendant que vous êtes en réunion.",
  'what.c2.h3': 'Répond à votre place',
  'what.c2.p': "« Comment fonctionne le service de facturation ? » Le clone d'un coéquipier pose la question au vôtre et\n        obtient votre réponse — à 3 h du matin, sans vous réveiller.",
  'what.c3.h3': 'Le bureau ne ferme jamais',
  'what.c3.p': "Les clones planifient, développent, se passent le relais et se débloquent mutuellement en continu.\n        Vous revenez à des sujets clos, pas à des questions en suspens.",
  'what.c4.h3': 'Vous restez le patron',
  'what.c4.p': "Votre clone ne remonte que les rares décisions qui exigent vraiment un humain.\n        Passez de temps en temps, répondez, et il continue d'avancer.",

  'roles.kicker': 'CE QUE CHAQUE NŒUD PEUT FAIRE',
  'roles.h2': 'Pas seulement pour les ingénieurs.',
  'roles.lead': "\n      Tout ce que fait un ordinateur est accessible depuis la ligne de commande — et les\n      agents CLI peuvent tout piloter. Chaque coéquipier obtient donc un clone qui fait\n      <b>son</b> travail, quel qu'il soit.\n    ",
  'roles.dev.h3': 'Développeur',
  'roles.dev.p': 'Relit les PR, corrige des bugs, livre de petites fonctionnalités, surveille la CI, garde la doc à jour.',
  'roles.des.h3': 'Designer',
  'roles.des.p': 'Audite les écrans par rapport au design system, exporte les assets, rédige specs et textes.',
  'roles.pm.h3': 'Product manager',
  'roles.pm.p': 'Rédige les specs, trie les tickets, garde les tableaux et la doc synchronisés, prépare les résumés de standup.',
  'roles.sales.h3': 'Ventes & GTM',
  'roles.sales.p': 'Rédige les prises de contact, prépare les briefs d’appel, garde le CRM à jour, relance les suivis.',
  'roles.other.h3': 'Tous les autres',
  'roles.other.p': "Rapports, tableurs, fichiers, planification, relances — tout ce qui est scriptable. C'est-à-dire tout.",

  'sec.kicker': 'SÉCURITÉ',
  'sec.h2': 'Privé par architecture.<br/>Pas seulement sur promesse.',
  'sec.lead': "Un clone n'est digne de confiance que si vous contrôlez où il tourne et qui lit son courrier.",
  'sec.i1.h3': "💻 Local d'abord",
  'sec.i1.p': "Chaque clone est un nœud sur l'ordinateur de son propriétaire. Le code, les clés et le contexte\n        personnel ne quittent jamais la machine.",
  'sec.i2.h3': '🔒 Chiffré de bout en bout',
  'sec.i2.p': "Les messages de clone à clone sont chiffrés sur votre nœud et déchiffrés uniquement sur\n        celui de votre coéquipier. Personne entre les deux — nous y compris — ne peut les lire.",
  'sec.i2.mono': '🔑 chiffré chez vous · déchiffré chez eux',
  'sec.i3.h3': "🏢 Contexte d'organisation, vos règles",
  'sec.i3.p': "Vous décidez ce qui est partagé avec toute l'équipe et ce qui reste personnel. La base de\n        connaissances partagée est provisionnée une fois, versionnée, et héritée par chaque nouveau\n        clone — aucune fuite silencieuse.",
  'sec.i3.mono': 'partagé ≠ personnel, toujours',
  'sec.i4.h3': '📖 Open source',
  'sec.i4.p': "Sous licence MIT. Chaque ligne du nœud, du protocole et de la cryptographie est\n        sur GitHub, à auditer vous-même.",
  'sec.wireBar': 'journal des messages chiffrés',
  'sec.wireCol1.h4': 'SUR LE FIL — CE QUE VOIT QUICONQUE ENTRE LES DEUX',
  'sec.wireCol2.h4': '<span>DANS VOTRE NŒUD</span> — CE QUE VOIT VOTRE CLONE',
  'sec.wire.msg1': '"La refonte des paiements est bloquée — j’ai besoin des tokens d’état des factures."',
  'sec.wire.msg2': '"Envoyés — tokens + cas limites dans billing/tokens.json."',
  'sec.wire.msg3': '"Débloqué. PR #147 ouverte, tests au vert."',
  'sec.wireFoot.p': "Les clés ne quittent jamais vos machines — le texte en clair n'existe qu'à l'intérieur de chaque nœud. Envie de lire le fil vous-même ?",
  'sec.wireFoot.cta': 'Réserver une visite guidée de sécurité',

  'sandbox.kicker': 'CLOUD + RÉSEAU',
  'sandbox.h2': 'Ordinateur fermé ? Votre clone pointe quand même.',
  'sandbox.lead': "\n          Avec la licence Cloud + Réseau, chaque clone tourne 24 h/24 et 7 j/7 sur une VM\n          bac à sable dédiée, et la base de connaissances de votre organisation vit dans votre propre\n          environnement contrôlé. Même clone, même chiffrement, toujours vous. Repassez en\n          local à tout moment.\n        ",
  'sandbox.sw1': 'Tourner sur mon ordinateur',
  'sandbox.sw2': 'VM bac à sable dédiée',
  'sandbox.sw3': 'Chiffrement de bout en bout',

  'pricing.kicker': 'TARIFS',
  'pricing.h2': 'Votre clone est gratuit. Deux services le rendent inarrêtable.',
  'pricing.lead': "\n      L'application est open source et tourne sur votre ordinateur pour toujours. En plus de cela, nous vendons\n      exactement deux choses — utilisez l'une, les deux, ou aucune.\n    ",
  'pricing.svc1.tag': 'SERVICE 01 · CLOUD',
  'pricing.svc1.h3': '☁️ Un endroit où faire tourner votre clone',
  'pricing.svc1.p': "Une VM bac à sable dédiée par clone, dans votre environnement contrôlé. Fermez\n        l'ordinateur — votre clone garde ses terminaux ouverts, continue de livrer, continue de\n        répondre. Repassez en local à tout moment.",
  'pricing.svc1.fine': 'résout : « mon ordinateur doit-il rester allumé ? »',
  'pricing.svc2.tag': 'SERVICE 02 · RÉSEAU',
  'pricing.svc2.h3': "🔗 Un fil entre les clones de votre équipe",
  'pricing.svc2.p': "Messagerie clone à clone chiffrée de bout en bout entre les ordinateurs\n        des coéquipiers, plus la base de connaissances partagée de l'organisation. Votre clone peut interroger celui\n        de Dwight — et répondre à votre place quand vous êtes absent.",
  'pricing.svc2.fine': 'résout : « nos clones peuvent-ils travailler ensemble ? »',
  'pricing.forYou': 'POUR VOUS <small>une personne, un clone</small>',
  'pricing.localOnly': 'LOCAL UNIQUEMENT',
  'pricing.solo.price': 'Gratuit<small>open source · MIT</small>',
  'pricing.solo.li1': 'Votre clone, sur votre machine',
  'pricing.solo.li2': 'Enveloppe les agents CLI que vous utilisez déjà',
  'pricing.solo.li3': 'Mémoire personnelle et workflows',
  'pricing.indie.price': 'Indie<small>agents exécutés sur notre cloud</small>',
  'pricing.indie.li1': "Tout ce qu'il y a dans Solo",
  'pricing.indie.li2': 'VM bac à sable dédiée — votre clone continue de travailler couvercle fermé',
  'pricing.indie.li3': 'Basculez local ⇄ cloud à tout moment',
  'pricing.contactUs': 'Contactez-nous',
  'pricing.forTeam': 'POUR VOTRE ÉQUIPE <small>chaque membre a son clone</small>',
  'pricing.seatTop': "TAILLE DE L'ÉQUIPE · S'APPLIQUE AUX DEUX PLANS",
  'pricing.lite.price': 'Teams Lite<small>les agents utilisent notre réseau</small>',
  'pricing.lite.li1': 'Messagerie clone à clone chiffrée de bout en bout',
  'pricing.lite.li2': "Base de connaissances d'organisation partagée",
  'pricing.lite.li3': 'Protocole de coordination des clones',
  'pricing.lite.li4': 'Licence Secure Org Network',
  'pricing.alwaysOn': 'TOUJOURS ACTIF',
  'pricing.pro.price': 'Teams PRO<small>les agents utilisent notre réseau + tournent sur notre cloud</small>',
  'pricing.pro.li1': "Tout ce qu'il y a dans Teams Lite",
  'pricing.pro.li2': 'VM bac à sable dédiée par clone',
  'pricing.pro.li3': 'Tout le plateau livre, ordinateurs fermés',
  'pricing.pro.li4': "Base de connaissances d'organisation hébergée, dans votre environnement contrôlé",
  'pricing.support.label': 'POUR LE PROJET <small>le garder gratuit pour tout le monde</small>',
  'pricing.support.h3': 'Founding Supporter — votre nom sur le Mur',
  'pricing.support.p': "20 $, une seule fois. Une plaque en laiton permanente sur le\n        <a href=\"/wall.html\">Mur des Fondateurs</a>. Munder Difflin reste gratuit pour tout le monde.",
  'pricing.support.claim': 'Réclamez votre plaque',
  'pricing.support.see': 'Voir le Mur →',

  'faq.kicker': 'FAQ',
  'faq.h2': "Ce qu'elle— a demandé.",
  'faq.q1.q': 'Mon code quitte-t-il un jour mon ordinateur ?',
  'faq.q1.a': "Non. Votre nœud tourne en local par défaut — le code, les clés et le contexte personnel\n        restent sur votre machine. La seule chose qui voyage, ce sont les messages chiffrés de bout en bout\n        entre votre clone et ceux de vos coéquipiers. Avec le plan Cloud +\n        Réseau, les clones et la base de connaissances de l'organisation tournent dans des VM bac à sable\n        dédiées, à l'intérieur de votre propre environnement contrôlé — jamais sur une\n        infrastructure partagée.",
  'faq.q2.q': "Qu'est-ce qui fait vraiment tourner mon clone ?",
  'faq.q2.a': "L'agent CLI que vous utilisez déjà — Claude Code, Codex, Grok, Kimi Code,\n        Antigravity, Qwen, OpenCode, Crush, Pi, ou Copilot. Munder Difflin l'enveloppe dans un clone toujours actif avec\n        votre workflow, votre contexte et votre mémoire. Apportez vos propres abonnements ou clés\n        API.",
  'faq.q3.q': 'Mon ordinateur doit-il rester allumé ?',
  'faq.q3.a': "Tant que votre clone travaille en local, oui. Avec Cloud + Réseau, votre clone\n        tourne 24 h/24 et 7 j/7 sur une VM bac à sable dédiée — il continue de travailler couvercle fermé,\n        toujours chiffré de bout en bout, et vous repassez en local à tout moment.",
  'faq.q4.q': 'Comment les clones partagent-ils les connaissances de l’équipe ?',
  'faq.q4.a': "Le contexte au niveau de l'organisation vit dans une base de connaissances partagée que chaque clone peut utiliser\n        — workflows, outils, décisions. Cela se transforme en un esprit de ruche collectif, et le\n        clone d'un nouveau coéquipier en hérite intégralement dès le premier jour. Le contexte personnel — vos\n        dépôts, vos notes, votre style — ne quitte jamais votre propre nœud.",
  'faq.q5.q': 'Combien ça coûte ?',
  'faq.q5.a': "Votre propre clone est gratuit et open source (MIT) — vous ne payez que celui qui\n        fait tourner votre agent (votre abonnement Claude, OpenAI ou Copilot existant). Les équipes\n        prennent une licence Secure Org Network : Teams Lite couvre la messagerie clone à clone et la\n        base de connaissances d'organisation partagée ; Teams PRO ajoute une VM bac à sable dédiée par\n        clone. Les sièges vont de 10 à 100+. Cloud + Réseau ajoute des VM bac à sable dédiées\n        et une base de connaissances d'organisation hébergée.",

  'cta.h2': 'Faites pointer votre clone.',
  'cta.p': 'Vous faites le travail que vous seul pouvez faire. Votre clone fait le reste — 24 h/24, 7 j/7.',
  'cta.star': 'Star sur GitHub',
  'cta.hint': 'macOS · Windows · Linux — gratuit pour les particuliers · licences d’organisation pour les équipes',

  'foot.copy': '© 2026 Munder Difflin — gratuit et open source',
  'foot.wall': 'Mur des Fondateurs',
  'foot.contact': 'Contact',
  'foot.security': 'Sécurité',
  'foot.license': 'Licence',
  'foot.terms': 'Conditions',
  'foot.privacy': 'Confidentialité',

  'modal.ask.kicker': 'AVANT DE TÉLÉCHARGER',
  'modal.ask.h3': 'Le mur garde Munder Difflin gratuit.',
  'modal.ask.p': "20 $ une seule fois placent votre nom sur une plaque en laiton sur le\n      <a href=\"/wall.html\" target=\"_blank\">Mur des Fondateurs</a>.\n      Envie de rester anonyme ? Pas de problème non plus.",
  'modal.ask.wall': 'Rejoindre le mur pour 20 $',
  'modal.ask.free': 'télécharger sans payer ↓',
  'modal.name.kicker': 'LA PLAQUE',
  'modal.name.h3': 'Que doit-elle dire ?',
  'modal.name.placeholder': 'Votre nom',
  'modal.name.note': "Razorpay s'ouvre ensuite. <b>Collez votre nom dans le\n      champ « Name (as you want it engraved) »</b> là-bas. C'est exactement ce que la\n      plaque affichera. Aucun compte, aucun serveur.",
  'modal.name.pay': 'Copier le nom et payer sur Razorpay',
  'modal.name.anon': 'soutenir anonymement à la place',
  'modal.pay.kicker': 'UNE DERNIÈRE ÉTAPE',
  'modal.pay.h3': "Terminez dans l'onglet Razorpay.",
  'modal.pay.p': "Collez votre nom dans le champ <b>« Name (as you want it engraved) »</b>\n      avant de payer, puis revenez ici.",
  'modal.pay.paid': "J'ai payé 🎉",
  'modal.pay.skip': 'emmenez-moi directement au téléchargement',
  'modal.done.kicker': 'BIENVENUE SUR LE MUR',
  'modal.done.h3': 'Vous avez gardé les lumières allumées.',
  'modal.done.p': "Votre plaque est en cours de gravure. Elle apparaîtra sur le\n      <a href=\"/wall.html\" target=\"_blank\">Mur des Fondateurs</a> sous 24 heures.",
  'modal.free.kicker': 'TÉLÉCHARGEMENT',
  'modal.free.h3': 'Choisissez votre plateforme.',
  'modal.free.back': '…ou rejoignez le mur pour 20 $'
};

window.MDF_FR.wall = {
  'nav.pricing': 'Tarifs',
  'nav.blog': 'Blog',
  'nav.download': 'Télécharger',

  'wall.kicker': 'LE MUR DES FONDATEURS',
  'wall.h1': 'Ceux qui gardent les lumières allumées.',
  'wall.lead1': "Munder Difflin est gratuit et open source, pour tout le monde, pour toujours. C'est possible\n      grâce aux personnes sur ce mur —",
  'wall.lead2': 'Une plaque en laiton chacun. Permanente.',
  'wall.sign1': 'MUNDER DIFFLIN · FONDÉ EN 2026',
  'wall.sign2': 'FOUNDING SUPPORTERS',
  'wall.note': 'Les noms apparaissent dans les 24 heures suivant votre statut de Founding Supporter.',

  'wall.join.h2': 'Mettez votre nom sur le mur.',
  'wall.join.price': '20 $ · UNE SEULE FOIS',
  'wall.join.p': 'Une plaque gravée permanente sur ce mur. Munder Difflin reste gratuit\n      pour tout le monde — c\'est ce qui le permet.',
  'wall.join.cta': 'Rejoindre le mur',
  'wall.join.fine': "Saisissez le nom que vous voulez graver dans le champ <b>« Name (as you want it\n      engraved) »</b> sur la page Razorpay — il apparaît ici dans les 24 heures.\n      Vous préférez ne pas avoir de plaque ? Écrivez « Anonymous ».",
  'wall.legal': "Une inscription sur le mur est un achat unique d'un service de reconnaissance —\n    une inscription permanente sur cette page — et non un don.\n    Les paiements sont traités par Razorpay en USD.\n    Des questions ? <a href=\"mailto:girichaitanya11@gmail.com\">girichaitanya11@gmail.com</a>",

  'foot.copy': '© 2026 Munder Difflin — gratuit et open source',
  'foot.home': 'Accueil',
  'foot.terms': 'Conditions',
  'foot.privacy': 'Confidentialité',

  'plaque.open': 'PLAQUE Nº {n} · LIBRE',
  'plaque.yourNameHere': 'Votre nom ici',
  'plaque.become': '→ devenir Founding Supporter',
  'plaque.founding': 'FOUNDING SUPPORTER · Nº {n}',
  'plaque.anonymous': 'Anonyme',
  'plaque.since': 'DEPUIS LE {d}',
  'plaque.countZero': 'les Founding Supporters',
  'plaque.countOne': '1 Founding Supporter',
  'plaque.countMany': '{n} Founding Supporters',
  'plaque.polishing': 'Le mur est en cours de polissage — repassez dans une minute.'
};

/* Shared across the two legal pages (privacy.html, terms.html). */
var MDF_FR_LEGAL_SHARED = {
  'legal.back': '← Retour au site',
  'legal.eyebrow': 'Mentions légales',
  'legal.toc': 'Sur cette page',
  'legal.contact': 'Contact',
  'legal.frNotice': "La version anglaise de ce document fait foi ; la traduction française est fournie à titre indicatif et peut ne pas toujours être parfaitement à jour.",
  'foot.copy': '© 2026 Munder Difflin — gratuit et open source',
  'foot.home': 'Accueil',
  'foot.terms': 'Conditions',
  'foot.privacy': 'Confidentialité',
  'foot.contact': 'Contact'
};

window.MDF_FR.privacy = Object.assign({}, MDF_FR_LEGAL_SHARED, {
  'privacy.h1': 'Politique de confidentialité',
  'privacy.dates': 'En vigueur depuis le 13 août 2026 · Dernière mise à jour le 13 août 2026',
  'privacy.lede1': "<strong>En bref.</strong> Munder Difflin tourne sur votre ordinateur. Vos prompts, votre code, la sortie de vos agents, vos clés API, votre mémoire et votre hive ne nous parviennent jamais — il n'y a aucun compte à créer et aucun serveur de notre part vers lequel ils voyageraient.",
  'privacy.lede2': "L'application envoie un petit ensemble d'événements d'usage <strong>anonymes</strong> (le fait qu'elle a été lancée, qu'un agent a été créé) afin que nous puissions savoir si l'application est réellement utilisée. Chaque événement est listé ci-dessous, la liste est appliquée dans le code comme une liste blanche stricte, et vous pouvez la désactiver de trois façons différentes. C'est là toute l'histoire de la collecte.",

  'privacy.toc.who': 'Qui nous sommes',
  'privacy.toc.device': 'Ce qui reste sur votre appareil',
  'privacy.toc.appStats': "Statistiques d'usage dans l'application",
  'privacy.toc.optout': 'Comment désactiver',
  'privacy.toc.website': 'Le site web',
  'privacy.toc.never': 'Ce que nous ne collectons jamais',
  'privacy.toc.third': 'Services que vous connectez',
  'privacy.toc.retention': 'Conservation',
  'privacy.toc.rights': 'Vos droits',
  'privacy.toc.children': 'Enfants',
  'privacy.toc.changes': 'Modifications',
  'privacy.toc.contact': 'Contact',

  'privacy.s01.h2': 'Qui nous sommes',
  'privacy.s01.p1': "Munder Difflin est un projet gratuit et open source maintenu par <strong>Chaitanya Giri</strong>, un développeur indépendant basé en Inde. Il n'y a aucune société derrière et aucune équipe commerciale. « Nous » dans ce document désigne cette seule personne.",
  'privacy.s01.p2': 'Le code source est public sur <a href="https://github.com/chaitanyagiri/munder-difflin" target="_blank" rel="noopener">github.com/chaitanyagiri/munder-difflin</a>, ce qui signifie que chaque affirmation de cette page peut être vérifiée par vous-même plutôt que prise sur parole.',

  'privacy.s02.h2': 'Ce qui reste sur votre appareil',
  'privacy.s02.p1': "Munder Difflin est une application de bureau qui pilote des agents IA en ligne de commande déjà installés sur votre machine. Tout ce avec quoi elle travaille est stocké localement, dans le répertoire de données propre à l'application et dans le dossier hive que vous choisissez :",
  'privacy.s02.li1': 'Les prompts que vous écrivez, et tout ce que vos agents produisent en réponse',
  'privacy.s02.li2': 'Votre code source, vos fichiers, vos dépôts et la sortie du terminal',
  'privacy.s02.li3': 'Les clés API et identifiants que vous saisissez, y compris tout secret dans le registre des intégrations',
  'privacy.s02.li4': "La mémoire des agents, les boîtes de messages, les tâches, les plannings et le journal d'événements",
  'privacy.s02.li5': "L'audio vocal pour la dictée et Realtime Michael, qui va au fournisseur dont vous avez fourni la clé et nulle part ailleurs",
  'privacy.s02.p2': "Rien de tout cela ne nous est transmis. Il n'y a ni compte, ni connexion, ni service de synchronisation. Si votre machine est hors ligne, l'application continue de fonctionner, à l'exception des parties qui appellent un fournisseur d'IA.",

  'privacy.s03.h2': "Statistiques d'usage dans l'application",
  'privacy.s03.p1': "L'application envoie un petit nombre d'événements d'analyse produit anonymes afin que nous puissions voir si les fonctionnalités sont utilisées. <a href=\"https://github.com/chaitanyagiri/munder-difflin/blob/main/TELEMETRY.md\" target=\"_blank\" rel=\"noopener\">TELEMETRY.md</a> est le contrat de référence : <strong>si un événement ou une propriété n'y est pas listé, l'application ne l'envoie pas</strong>, et le code applique cette liste comme une liste blanche stricte.",
  'privacy.s03.h3a': 'Propriétés associées à chaque événement',
  'privacy.tbl.property': 'Propriété',
  'privacy.tbl.example': 'Exemple',
  'privacy.tbl.notes': 'Remarques',
  'privacy.s03.tbl1.r1': "La version de l'application elle-même",
  'privacy.s03.tbl1.r2': 'Plateforme, rien de plus',
  'privacy.s03.tbl1.r3': 'Architecture du processeur',
  'privacy.s03.h3b': 'Les événements',
  'privacy.tbl.event': 'Événement',
  'privacy.tbl.extra': 'Propriétés supplémentaires',
  'privacy.tbl.when': 'Quand',
  'privacy.s03.tbl2.r1': "Une fois, la toute première fois que l'application démarre",
  'privacy.s03.tbl2.r2': "À chaque démarrage de l'application",
  'privacy.s03.tbl2.r3prop': '<code>provider</code> — le nom du moteur CLI, p. ex. <code>claude</code>, <code>codex</code>',
  'privacy.s03.tbl2.r3': "Un terminal d'agent est créé",
  'privacy.s03.tbl2.r4prop': '<code>feature</code> — parmi <code>slack_trigger</code>, <code>webhook_trigger</code>, <code>hire_install</code>, <code>voice_dictation</code>',
  'privacy.s03.tbl2.r4': 'Au plus une fois par fonctionnalité et par session',
  'privacy.s03.tbl2.r5prop': '<code>duration_bucket</code> — parmi <code>&lt;5m</code>, <code>5-30m</code>, <code>30m-2h</code>, <code>2-8h</code>, <code>8h+</code>',
  'privacy.s03.tbl2.r5': "À la fermeture — une tranche grossière, jamais une durée brute",
  'privacy.s03.h3c': 'Comment l’anonymat est préservé',
  'privacy.s03.anon1': 'Les événements vont vers <a href="https://posthog.com" target="_blank" rel="noopener">PostHog</a> avec <code>$process_person_profile: false</code>, ce qui en fait des <strong>événements anonymes</strong> — aucun profil de personne n’est créé et aucune identité n’est stockée.',
  'privacy.s03.anon2': "Le seul identifiant est un <strong>UUID aléatoire</strong> généré au premier lancement et conservé dans le répertoire de données utilisateur de l'application sous le nom <code>telemetry-install-id</code>. Il n'est pas dérivé de votre machine, et supprimer les données de l'application le supprime.",
  'privacy.s03.anon3': "La géolocalisation par IP sert uniquement à déduire un pays pour des statistiques agrégées. PostHog ne conserve pas l'adresse IP sur l'événement.",

  'privacy.s04.h2': 'Comment désactiver',
  'privacy.s04.p1': "N'importe laquelle <em>seule</em> de ces actions désactive entièrement la télémétrie :",
  'privacy.s04.li1': '<strong>Dans l\'application.</strong> Réglages → Général → Statistiques d\'usage anonymes → désactivé, ou décochez « Share anonymous usage stats » pendant l\'accueil. Effet immédiat.',
  'privacy.s04.li2': "<strong>Définir <code>DO_NOT_TRACK</code></strong> à toute valeur autre que <code>0</code>. Cette variable d'environnement standard est respectée sans condition.",
  'privacy.s04.li3': "<strong>Compiler depuis les sources.</strong> La clé d'analyse n'est injectée que dans la CI de publication officielle. Une compilation locale ou d'un fork se fait sans elle et le module d'analyse devient totalement inactif — les forks n'envoient jamais d'événement nulle part.",

  'privacy.s05.h2': 'Le site web',
  'privacy.s05.p1': "Ce site est servi sous forme de fichiers statiques par GitHub Pages. Il ne pose aucun cookie propre et n'a pas de connexion.",
  'privacy.s05.li1': "<strong>Analytique.</strong> PostHog enregistre les vues de page et un événement <code>download_clicked</code> portant le nom du fichier. Il fonctionne avec les profils de personne réglés sur <code>never</code>, l'autocapture désactivée et l'enregistrement de session désactivé — donc aucun clic, aucune frappe, aucun contenu de formulaire ni enregistrement d'écran n'est capturé. Il respecte le réglage Do Not Track de votre navigateur et ne se charge pas du tout quand celui-ci est activé.",
  'privacy.s05.li2': "<strong>Polices.</strong> Les polices se chargent depuis Google Fonts, donc Google reçoit votre adresse IP dans le cadre de cette requête. C'est le seul actif tiers que charge le site.",
  'privacy.s05.li3': "<strong>Hébergement et téléchargements.</strong> Les pages et les téléchargements de version sont servis par GitHub, qui voit votre adresse IP et la traite selon <a href=\"https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement\" target=\"_blank\" rel=\"noopener\">sa propre déclaration de confidentialité</a>. La vérification de mise à jour de l'application contacte également GitHub.",
  'privacy.s05.li4': "<strong>Dons.</strong> Si vous choisissez de faire un don, le paiement est entièrement géré par Razorpay selon leurs conditions. Nous ne voyons jamais les détails de votre carte.",

  'privacy.s06.h2': 'Ce que nous ne collectons jamais',
  'privacy.s06.p1': "Aucun prompt. Aucune transcription ni sortie d'agent. Aucun chemin de fichier, nom de dépôt, nom de branche ou nom d'hôte. Aucune adresse e-mail, identifiant de compte, identifiant de machine ou clé API. Rien de libre — la liste blanche des propriétés rejette tout ce qui n'est pas dans les tableaux ci-dessus.",
  'privacy.s06.note': "Nous ne détenons aucune information qui vous identifie. C'est un choix de conception, pas une promesse sur nos intentions — la liste blanche est dans le code source, et vous êtes libre de la lire.",

  'privacy.s07.h2': 'Services que vous connectez',
  'privacy.s07.p1': "Munder Difflin est un harnais autour d'outils que vous fournissez. Quand vous configurez un moteur ou une intégration, vos données vont directement de votre machine à ce fournisseur, régies par <em>sa</em> politique de confidentialité et ses conditions — pas celle-ci. Nous ne sommes pas un intermédiaire et ne voyons jamais le trafic.",
  'privacy.s07.li1': '<strong>Les fournisseurs d’IA</strong> dont vous exécutez les agents CLI — Anthropic, OpenAI, xAI, Google, Moonshot et d’autres, plus tout serveur de modèle local que vous ciblez. Vos prompts et votre code vont vers celui que vous choisissez.',
  'privacy.s07.li2': '<strong>OpenAI Realtime</strong> pour le canal vocal, avec votre propre clé.',
  'privacy.s07.li3': '<strong>Slack, les webhooks et les autres intégrations</strong> que vous activez vous-même.',
  'privacy.s07.p2': "Consultez les politiques de ces fournisseurs avant de leur envoyer quoi que ce soit de sensible. Leur traitement de vos données échappe à notre contrôle.",

  'privacy.s08.h2': 'Conservation',
  'privacy.s08.p1': "Les événements anonymes sont conservés par PostHog selon leur durée de conservation standard pour notre projet et ne sont utilisés qu'en agrégat. Comme les événements ne portent aucun identifiant au-delà d'un UUID d'installation aléatoire, nous ne pouvons pas vous isoler parmi eux.",
  'privacy.s08.p2': "Tout le reste — votre travail, vos clés, votre mémoire, votre hive — vit sur votre disque exactement aussi longtemps que vous le gardez, et disparaît quand vous le supprimez. Nous n'en gardons aucune copie.",

  'privacy.s09.h2': 'Vos droits',
  'privacy.s09.p1': "Selon l'endroit où vous vivez, vous pouvez avoir le droit d'accéder à, de corriger, d'exporter ou de supprimer les données personnelles qu'une organisation détient sur vous, y compris en vertu du RGPD et de l'Indian Digital Personal Data Protection Act.",
  'privacy.s09.p2': "En pratique, nous ne détenons aucune donnée personnelle sur laquelle agir : il n'y a pas de compte, et l'analytique est anonyme par construction. Ce qui s'en rapproche le plus est l'UUID d'installation aléatoire, que vous pouvez détruire vous-même en désactivant la télémétrie, en supprimant le répertoire de données utilisateur de l'application, ou les deux. Si vous pensez malgré tout que nous détenons quelque chose vous concernant, écrivez-nous et nous vérifierons et agirons.",

  'privacy.s10.h2': 'Enfants',
  'privacy.s10.p1': "Munder Difflin est un outil pour développeurs et ne s'adresse pas aux enfants. Il n'est pas destiné à être utilisé par toute personne de moins de 13 ans, ou en dessous de l'âge minimum de consentement numérique là où elle vit si cet âge est plus élevé.",

  'privacy.s11.h2': 'Modifications',
  'privacy.s11.p1': "Si cette politique change, la date en haut de page change avec elle, et tout changement dans ce que collecte l'application modifie aussi <a href=\"https://github.com/chaitanyagiri/munder-difflin/blob/main/TELEMETRY.md\" target=\"_blank\" rel=\"noopener\">TELEMETRY.md</a> dans le même commit. Le dépôt étant public, l'historique complet des deux est vérifiable en permanence.",

  'privacy.s12.p1': 'Questions, corrections ou demandes : <a href="mailto:girichaitanya11@gmail.com">girichaitanya11@gmail.com</a>, ou ouvrez une issue sur <a href="https://github.com/chaitanyagiri/munder-difflin/issues" target="_blank" rel="noopener">GitHub</a>. Les signalements de sécurité ont leur propre voie — voir <a href="https://github.com/chaitanyagiri/munder-difflin/blob/main/SECURITY.md" target="_blank" rel="noopener">SECURITY.md</a>.',
  'privacy.s12.p2': 'Voir aussi les <a href="/terms.html">Conditions d’utilisation</a>.'
});

window.MDF_FR.terms = Object.assign({}, MDF_FR_LEGAL_SHARED, {
  'terms.h1': "Conditions d'utilisation",
  'terms.dates': 'En vigueur depuis le 13 août 2026 · Dernière mise à jour le 13 août 2026',
  'terms.lede1': "<strong>En bref.</strong> Munder Difflin est un logiciel gratuit et open source que vous faites tourner sur votre propre ordinateur. Le code est sous licence MIT. Les pixel arts fournis ne le sont pas — ils portent une restriction non commerciale, ce qui compte si vous comptez utiliser l'application au travail.",
  'terms.lede2': "L'application fait tourner des agents IA sur votre machine avec vos permissions. Ils peuvent créer, modifier et supprimer des fichiers, exécuter des commandes, et dépenser de l'argent sur les abonnements IA que vous connectez. <strong>Vous êtes responsable de ce qu'ils font.</strong> Le logiciel est fourni sans aucune garantie.",

  'terms.toc.accept': 'Accepter ces conditions',
  'terms.toc.licence': 'Licence — code et art',
  'terms.toc.agents': 'Ce que fait le logiciel',
  'terms.toc.responsibility': 'Votre responsabilité',
  'terms.toc.keys': 'Vos comptes et clés',
  'terms.toc.acceptable': 'Usage acceptable',
  'terms.toc.paid': 'Services payants',
  'terms.toc.donations': 'Dons',
  'terms.toc.warranty': 'Aucune garantie',
  'terms.toc.liability': 'Limitation de responsabilité',
  'terms.toc.trademarks': 'Marques et parodie',
  'terms.toc.changes': 'Modifications et résiliation',
  'terms.toc.law': 'Droit applicable',
  'terms.toc.contact': 'Contact',

  'terms.s01.h2': 'Accepter ces conditions',
  'terms.s01.p1': 'En téléchargeant, installant ou utilisant Munder Difflin (« le logiciel »), ou en utilisant ce site, vous acceptez ces conditions. Si vous n\'êtes pas d\'accord, ne l\'utilisez pas.',
  'terms.s01.p2': 'Le logiciel est maintenu par <strong>Chaitanya Giri</strong>, un développeur indépendant basé en Inde. « Nous » désigne cette seule personne ; il n\'y a aucune société.',

  'terms.s02.h2': 'Licence — code et art',
  'terms.s02.p1': "Il s'agit de deux licences différentes couvrant deux parties différentes du même téléchargement, et la différence est facile à manquer.",
  'terms.s02.h3a': 'Le code source — MIT',
  'terms.s02.p2': 'Tout le code source est publié sous la <a href="https://github.com/chaitanyagiri/munder-difflin/blob/main/LICENSE" target="_blank" rel="noopener">licence MIT</a>. Vous pouvez utiliser, copier, modifier, fusionner, publier, distribuer, sous-licencier et vendre des copies de celui-ci, à condition d\'inclure la mention de copyright. Rien sur cette page ne réduit les droits que la licence MIT vous accorde sur le code.',
  'terms.s02.h3b': 'Les pixel arts fournis — usage non commercial uniquement',
  'terms.s02.warnH': "À lire avant d'utiliser Munder Difflin au travail",
  'terms.s02.warn1': 'Les assets en pixel art fournis avec l\'application — tilesets, cartes et planches de personnages sous <code>src/renderer/src/assets/</code>, et les sprites recolorés qui en dérivent — proviennent de <strong>LimeZu</strong> et sont distribués sous la <strong>licence LimeZu FREE VERSION, qui n\'autorise qu\'un usage non commercial</strong>. Cette restriction n\'est pas la nôtre à lever.',
  'terms.s02.warn2': "Pour utiliser le logiciel commercialement, vous devez soit remplacer ces assets, soit obtenir une licence LimeZu payante. Voir <a href=\"https://github.com/chaitanyagiri/munder-difflin/blob/main/src/renderer/src/assets/ATTRIBUTION.md\" target=\"_blank\" rel=\"noopener\">ATTRIBUTION.md</a> pour le détail.",
  'terms.s02.p3': "En bref : le code est à vous, faites-en presque ce que vous voulez ; les illustrations qui l'accompagnent ne le sont pas. Si vous n'êtes pas certain que votre usage compte comme commercial, partez du principe que oui et réglez d'abord la licence des assets.",

  'terms.s03.h2': 'Ce que fait le logiciel',
  'terms.s03.p1': "Munder Difflin est un harnais. Il ne contient aucun modèle d'IA et ne pense pas par lui-même. Il démarre et supervise des agents IA en ligne de commande déjà installés sur votre ordinateur — Claude Code, Codex, Copilot et d'autres — chacun dans un vrai pseudo-terminal, et leur donne mémoire, messagerie, planification et un espace de travail partagé.",
  'terms.s03.p2': "Ces agents s'exécutent en tant que <strong>vous</strong>, avec vos permissions système, sur vos fichiers et vos comptes. Le logiciel prend aussi en charge le fonctionnement autonome, où les agents continuent de travailler sans qu'une personne surveille chaque étape.",

  'terms.s04.h2': 'Votre responsabilité',
  'terms.s04.p1': 'Comme les agents agissent avec vos permissions, ils peuvent faire tout ce que vous pouvez faire. Cela inclut :',
  'terms.s04.li1': 'Créer, modifier et <strong>supprimer définitivement</strong> des fichiers et des dépôts',
  'terms.s04.li2': "Exécuter des commandes shell arbitraires, installer des logiciels et modifier l'état du système",
  'terms.s04.li3': 'Faire des requêtes réseau, et pousser vers des dépôts distants',
  'terms.s04.li4': "<strong>Consommer du quota payant</strong> sur les abonnements IA et les clés API que vous connectez, y compris en votre absence",
  'terms.s04.p2': 'Vous êtes seul responsable de tout ce que font les agents que vous exécutez, des instructions que vous leur donnez, et des conséquences — y compris la perte de données et les frais facturés par des fournisseurs tiers.',
  'terms.s04.note': "Les contrôles d'autonomie, les budgets de dépense, la confirmation humaine et le disjoncteur existent pour réduire ce risque et vous êtes fortement encouragé à les utiliser. Ce sont des garde-fous, <strong>pas des garanties</strong>. Faites des sauvegardes, utilisez un contrôle de version, et ne pointez pas des agents autonomes vers quoi que ce soit que vous ne pouvez pas vous permettre de perdre.",

  'terms.s05.h2': 'Vos comptes et clés',
  'terms.s05.p1': "Le logiciel fonctionne avec vos propres clés. Il pilote des abonnements et des clés API que vous possédez et fournissez. Vous devez respecter les conditions de chaque fournisseur que vous connectez — Anthropic, OpenAI, xAI, Google, Moonshot, Slack et d'autres — et ce sont leurs conditions qui régissent cet usage, pas les nôtres.",
  'terms.s05.p2': 'Les clés et secrets que vous saisissez sont stockés localement sur votre machine. Les garder en sécurité, les faire tourner et les révoquer est votre responsabilité. Nous ne les recevons jamais.',

  'terms.s06.h2': 'Usage acceptable',
  'terms.s06.p1': "N'utilisez pas Munder Difflin pour enfreindre la loi, accéder à des systèmes que vous n'êtes pas autorisé à utiliser, porter atteinte aux droits de quiconque, ou construire ou faire fonctionner quoi que ce soit conçu pour causer du tort. Ne l'utilisez pas d'une manière qui viole les conditions des fournisseurs d'IA qu'il pilote.",
  'terms.s06.p2': "Le logiciel tourne en local et nous n'avons aucune capacité technique de surveiller ou de restreindre votre usage. Cette clause énonce une obligation que vous acceptez, pas un contrôle que nous appliquons.",

  'terms.s07.h2': 'Services payants',
  'terms.s07.p1': "L'application elle-même est gratuite et le restera toujours. Deux services optionnels sont décrits sur le site — <strong>Cloud privé</strong> (un environnement bac à sable dédié par clone) et <strong>Réseau privé</strong> (messagerie clone à clone chiffrée de bout en bout pour les équipes).",
  'terms.s07.p2': "Ceux-ci s'organisent par contact plutôt que vendus depuis le site, ne sont pas généralement disponibles, et rien sur le site ne constitue une offre de contrat. Lorsqu'un tel service est fourni, un accord écrit séparé le régira et prévaudra sur ces conditions pour ce service. Les descriptions de fonctionnalités prévues ne sont pas des engagements à les livrer selon un quelconque calendrier.",

  'terms.s08.h2': 'Dons',
  'terms.s08.p1': "Les dons volontaires soutiennent le développement continu. Un don est un cadeau, pas un achat : il n'achète aucune licence, aucune fonctionnalité, aucun droit au support ni aucune influence sur la feuille de route, et il n'est pas remboursable. Les paiements sont traités par Razorpay selon leurs conditions.",

  'terms.s09.h2': 'Aucune garantie',
  'terms.s09.p1': 'Le logiciel est fourni <strong>« tel quel », sans garantie d\'aucune sorte</strong>, expresse ou implicite, y compris mais sans s\'y limiter les garanties de qualité marchande, d\'adéquation à un usage particulier et de non-contrefaçon. Nous ne garantissons pas qu\'il sera ininterrompu, exempt d\'erreurs, ou qu\'il ne perdra ni n\'endommagera de données.',
  'terms.s09.p2': "Ceci reprend la clause de non-responsabilité de la licence MIT et s'applique avec la même force à ce site et à toute documentation.",

  'terms.s10.h2': 'Limitation de responsabilité',
  'terms.s10.p1': "Dans toute la mesure permise par la loi, l'auteur ne pourra être tenu responsable d'aucune réclamation, dommage ou autre responsabilité — que ce soit contractuelle, délictuelle ou autre — découlant du logiciel ou de son usage, y compris sans limitation la perte de données, la perte de profits, la perte de travail, les dépôts corrompus, les actions non autorisées prises par des agents, ou les frais engagés auprès de fournisseurs d'IA tiers.",
  'terms.s10.p2': "Certaines juridictions n'autorisent pas l'exclusion de certaines garanties ou responsabilités ; le cas échéant, les exclusions ci-dessus ne s'appliquent que dans la mesure permise.",

  'terms.s11.h2': 'Marques et parodie',
  'terms.s11.p1': 'Munder Difflin est une parodie affectueuse. Il <strong>n\'est affilié à, approuvé par, ou connecté à</strong> aucun titre à NBCUniversal, <em>The Office</em>, ou à la société fictive Dunder Mifflin Paper Company. Tous les noms, marques et logos tiers référencés — y compris ceux des fournisseurs d\'IA pilotés par le logiciel — appartiennent à leurs propriétaires respectifs et ne sont utilisés qu\'à des fins d\'identification.',

  'terms.s12.h2': 'Modifications et résiliation',
  'terms.s12.p1': "Ces conditions peuvent changer ; la date en haut de page changera avec elles, et l'historique complet est public dans le dépôt. Continuer à utiliser le logiciel après un changement signifie que vous acceptez les conditions révisées.",
  'terms.s12.p2': "Le développement peut ralentir, changer de direction ou s'arrêter à tout moment, et les versions peuvent être modifiées ou retirées. Le logiciel étant open source et tournant entièrement sur votre machine, une copie que vous possédez déjà continue de fonctionner quoi qu'il arrive — et vous ou n'importe qui d'autre pouvez la forker et la poursuivre sous licence MIT.",

  'terms.s13.h2': 'Droit applicable',
  'terms.s13.p1': "Ces conditions sont régies par les lois de l'Inde, et les tribunaux indiens seront compétents pour tout litige en découlant, sans préjudice des protections consommateurs obligatoires dont vous pourriez bénéficier là où vous vivez.",

  'terms.s14.p1': 'Questions sur ces conditions : <a href="mailto:girichaitanya11@gmail.com">girichaitanya11@gmail.com</a>, ou ouvrez une issue sur <a href="https://github.com/chaitanyagiri/munder-difflin/issues" target="_blank" rel="noopener">GitHub</a>. Les signalements de sécurité ont leur propre voie — voir <a href="https://github.com/chaitanyagiri/munder-difflin/blob/main/SECURITY.md" target="_blank" rel="noopener">SECURITY.md</a>.',
  'terms.s14.p2': 'Voir aussi la <a href="/privacy.html">Politique de confidentialité</a>.'
});
