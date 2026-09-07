(() => {
  const { useEffect, useMemo, useRef, useState } = React;
  const Trait = (props) => {
    const { d, size = 18, strokeWidth = 2 } = props;
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    }, React.createElement("path", { d }));
  };
  const Check = (p) => Trait({ ...p, d: "M4.8 12.6 9.6 17.4 19.2 6.6" });
  const Plus = (p) => Trait({ ...p, d: "M12 5v14M5 12h14" });
  const X = (p) => Trait({ ...p, d: "M6.5 6.5l11 11M17.5 6.5l-11 11" });
  const Trash2 = (p) => Trait({ ...p, d: "M4 6.5h16M9.5 6.5V4h5v2.5M6.8 6.5l1 13h8.4l1-13M10.2 10v6M13.8 10v6" });
  const DEFAULT_HABITS = [
    { id: "h1", label: "R\xE9veil \xE0 7h00", time: "07:00", kind: "ancre" },
    { id: "h2", label: "Ma t\xE2che la plus dure avant 10h", time: "08:30", kind: "pro" },
    { id: "h3", label: "Sport", time: "18:00", kind: "perso" },
    { id: "h4", label: "D\xEEner sans travailler", time: "20:00", kind: "perso" },
    { id: "h5", label: "\xC9crans coup\xE9s", time: "22:30", kind: "perso" },
    { id: "h6", label: "Au lit avant minuit", time: "23:30", kind: "ancre" }
  ];
  const KIND_LABEL = { ancre: "Ancre", pro: "Pro", perso: "Perso" };
  const SEUIL_SERIE = 70;
  const pad = (n) => String(n).padStart(2, "0");
  const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = (k) => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const shiftKey = (k, n) => {
    const d = fromKey(k);
    d.setDate(d.getDate() + n);
    return toKey(d);
  };
  const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const MOIS = ["janvier", "f\xE9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\xFBt", "septembre", "octobre", "novembre", "d\xE9cembre"];
  const dateLongue = (k) => {
    const d = fromKey(k);
    return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
  };
  const dateCourte = (k) => {
    const d = fromKey(k);
    return `${JOURS[d.getDay()].slice(0, 3)}. ${d.getDate()}`;
  };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const T = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  const DESSINS = {
    reveil: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12.5", r: "3.5" }), /* @__PURE__ */ React.createElement("path", { d: "M4 18h16" }), /* @__PURE__ */ React.createElement("path", { d: "M12 5v2.2M6.3 7.6l1.5 1.5M17.7 7.6l-1.5 1.5M3.5 12.5h2M18.5 12.5h2" })),
    lune: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M19 14.8A7.2 7.2 0 0 1 9.6 5.2 7.6 7.6 0 1 0 19 14.8Z" }), /* @__PURE__ */ React.createElement("path", { d: "M15.6 3.6l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6Z" })),
    haltere: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M4.5 9.5v5M7.5 7.5v9M16.5 7.5v9M19.5 9.5v5M7.5 12h9" })),
    courir: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "14.5", cy: "4.8", r: "1.9" }), /* @__PURE__ */ React.createElement("path", { d: "M13.6 8.2 10.4 11l2.2 2.9-1.1 5.4" }), /* @__PURE__ */ React.createElement("path", { d: "M10.4 11 6.3 12.3" }), /* @__PURE__ */ React.createElement("path", { d: "M14.8 12.2l3.1 1.7 1 4.3" })),
    velo: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "5.8", cy: "16.2", r: "3.4" }), /* @__PURE__ */ React.createElement("circle", { cx: "18.2", cy: "16.2", r: "3.4" }), /* @__PURE__ */ React.createElement("path", { d: "M5.8 16.2 10 9.4h4.2" }), /* @__PURE__ */ React.createElement("path", { d: "M10 9.4l4.6 6.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "15.6", cy: "5.2", r: "1.3" })),
    yoga: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "5.4", r: "2.2" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8.4c-2.1 0-3.5 1.7-3.5 3.6 0 1.2.5 2.2 1.3 2.9" }), /* @__PURE__ */ React.createElement("path", { d: "M12 8.4c2.1 0 3.5 1.7 3.5 3.6 0 1.2-.5 2.2-1.3 2.9" }), /* @__PURE__ */ React.createElement("path", { d: "M5.5 18.6c1.5-2 4-3 6.5-3s5 1 6.5 3Z" })),
    marche: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "13", cy: "4.8", r: "1.9" }), /* @__PURE__ */ React.createElement("path", { d: "M12.4 8.2 10 11.4l2 2.4-.6 5.4" }), /* @__PURE__ */ React.createElement("path", { d: "M12 13.8 15.4 19" }), /* @__PURE__ */ React.createElement("path", { d: "M10 11.4 7.4 13" }), /* @__PURE__ */ React.createElement("path", { d: "M13.5 9.6 16.6 11" })),
    ecranoff: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("rect", { x: "7.2", y: "3", width: "9.6", height: "18", rx: "2.6" }), /* @__PURE__ */ React.createElement("path", { d: "M10.5 18h3" }), /* @__PURE__ */ React.createElement("path", { d: "M4.5 20.5 19.5 3.5" })),
    enveloppe: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "5.5", width: "18", height: "13", rx: "2.4" }), /* @__PURE__ */ React.createElement("path", { d: "M3.8 7.6 12 13.6l8.2-6" })),
    telephone: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M6.2 3.2h2.9l1.9 4.7-2.4 1.5a11.8 11.8 0 0 0 5.9 5.9l1.5-2.4 4.7 1.9v2.9a2 2 0 0 1-2.1 2A15.8 15.8 0 0 1 4.2 5.3a2 2 0 0 1 2-2.1Z" })),
    reunion: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "8.8", cy: "8", r: "2.9" }), /* @__PURE__ */ React.createElement("path", { d: "M3.2 19c0-3.2 2.6-4.9 5.6-4.9s5.6 1.7 5.6 4.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "17.4", cy: "9.2", r: "2.3" }), /* @__PURE__ */ React.createElement("path", { d: "M16 14.3c2.9 0 4.8 1.6 4.8 4.4" })),
    euro: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.6" }), /* @__PURE__ */ React.createElement("path", { d: "M15.6 8.6a4.4 4.4 0 0 0-7 3.4 4.4 4.4 0 0 0 7 3.4" }), /* @__PURE__ */ React.createElement("path", { d: "M6.8 11h5.4M6.8 13.4h5.4" })),
    cible: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.4" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "4.4" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1" })),
    stylo: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M4.4 19.6 5.5 15 16.6 3.9a2.1 2.1 0 0 1 3 3L8.5 18l-4.1 1.6Z" }), /* @__PURE__ */ React.createElement("path", { d: "M14.6 5.9l3 3" })),
    livre: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M4 5.4A2.4 2.4 0 0 1 6.4 3H11v15.6H6.4A2.4 2.4 0 0 0 4 21Z" }), /* @__PURE__ */ React.createElement("path", { d: "M20 5.4A2.4 2.4 0 0 0 17.6 3H13v15.6h4.6A2.4 2.4 0 0 1 20 21Z" })),
    panier: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M3.4 8.2h17.2l-1.9 10.4a1.6 1.6 0 0 1-1.6 1.3H6.9a1.6 1.6 0 0 1-1.6-1.3Z" }), /* @__PURE__ */ React.createElement("path", { d: "M8.6 8.2 10.9 3.8M15.4 8.2 13.1 3.8" })),
    couverts: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M5 3v5.4a2.6 2.6 0 0 0 5.2 0V3" }), /* @__PURE__ */ React.createElement("path", { d: "M7.6 3.4v17.4" }), /* @__PURE__ */ React.createElement("path", { d: "M17.4 3c1.8 0 3 2.1 3 5.2s-1 4.2-2 4.2v8.4" })),
    cafe: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M4.4 7.8h12.2v5.4a5.2 5.2 0 0 1-5.2 5.2H9.6a5.2 5.2 0 0 1-5.2-5.2Z" }), /* @__PURE__ */ React.createElement("path", { d: "M16.6 9.4h1.9a2.6 2.6 0 0 1 0 5.2h-1.9" }), /* @__PURE__ */ React.createElement("path", { d: "M8.2 3.6v1.9M12 3.1v2.4" }), /* @__PURE__ */ React.createElement("path", { d: "M3.8 21h14" })),
    goutte: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M12 3.2s5.4 6.1 5.4 9.4a5.4 5.4 0 0 1-10.8 0c0-3.3 5.4-9.4 5.4-9.4Z" })),
    maison: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M3.6 11 12 4.2 20.4 11" }), /* @__PURE__ */ React.createElement("path", { d: "M6 9.8V19.8h12V9.8" }), /* @__PURE__ */ React.createElement("path", { d: "M10 19.8v-5h4v5" })),
    coeur: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M12 20.2S4.2 15.4 4.2 10.2A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.8 2.6c0 5.2-7.8 10-7.8 10Z" })),
    dossier: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M3.2 6.8a2 2 0 0 1 2-2h3.6l2.1 2.6h8a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2Z" })),
    code: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M9 6.6 3.8 12 9 17.4M15 6.6 20.2 12 15 17.4" })),
    voiture: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("path", { d: "M4 14.4l1.6-5A2.2 2.2 0 0 1 7.7 7.8h8.6a2.2 2.2 0 0 1 2.1 1.6l1.6 5" }), /* @__PURE__ */ React.createElement("rect", { x: "3", y: "14.4", width: "18", height: "4.2", rx: "1.4" }), /* @__PURE__ */ React.createElement("path", { d: "M6.6 18.6v1.6M17.4 18.6v1.6" })),
    mallette: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "7.4", width: "18", height: "12.6", rx: "2.4" }), /* @__PURE__ */ React.createElement("path", { d: "M8.8 7.4V5.6a2 2 0 0 1 2-2h2.4a2 2 0 0 1 2 2v1.8" }), /* @__PURE__ */ React.createElement("path", { d: "M3 12.4h18" })),
    horloge: /* @__PURE__ */ React.createElement("g", { ...T }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "8.6" }), /* @__PURE__ */ React.createElement("path", { d: "M12 6.8V12.4l3.4 2" }))
  };
  const REGLES = [
    { n: "courir", m: ["courir", "course a pied", "running", "footing", "jogging", "run"] },
    { n: "velo", m: ["velo", "bike", "cyclisme", "vtt"] },
    { n: "haltere", m: ["sport", "muscu", "salle", "gym", "seance", "entrainement", "haltere", "pompes", "abdos", "fitness", "crossfit", "piscine", "natation", "boxe", "padel", "tennis", "foot"] },
    { n: "yoga", m: ["yoga", "medit", "respiration", "sophro", "etirement", "stretch", "pilates", "coh\xE9rence", "coherence"] },
    { n: "marche", m: ["marche", "marcher", "promenade", "balade", "pas", "randonnee"] },
    { n: "reveil", m: ["reveil", "lever", "debout", "matin", "aube"] },
    { n: "lune", m: ["coucher", "dormir", "lit", "sommeil", "minuit", "nuit", "sieste", "dodo"] },
    { n: "ecranoff", m: ["ecran", "reseaux", "scroll", "insta", "tiktok", "portable", "notif"] },
    { n: "enveloppe", m: ["mail", "mails", "e-mail", "inbox", "boite", "courrier", "newsletter"] },
    { n: "reunion", m: ["reunion", "rdv", "rendez", "meeting", "visio", "entretien", "brief", "point avec", "equipe", "collaborateur", "recrutement"] },
    { n: "telephone", m: ["appel", "appeler", "telephoner", "call", "rappeler"] },
    { n: "euro", m: ["facture", "devis", "compta", "banque", "argent", "paie", "salaire", "tresorerie", "impot", "urssaf", "tva", "encaiss", "budget", "cash", "relance", "paiement", "note de frais"] },
    { n: "cible", m: ["prospect", "vente", "client", "commercial", "closing", "lead", "demarchage", "objectif", "offre", "proposition"] },
    { n: "stylo", m: ["ecrire", "redig", "post", "contenu", "article", "copy", "note", "brouillon", "cv", "pitch"] },
    { n: "livre", m: ["lire", "lecture", "livre", "bouquin", "formation", "cours", "apprendre", "podcast", "video"] },
    { n: "panier", m: ["courses", "supermarche", "commissions", "drive", "achat", "shopping"] },
    { n: "couverts", m: ["cuisin", "repas", "dejeuner", "diner", "manger", "petit dej", "plat", "restaurant", "resto", "brunch"] },
    { n: "cafe", m: ["cafe", "the", "pause"] },
    { n: "goutte", m: ["eau", "boire", "hydrat", "douche"] },
    { n: "maison", m: ["menage", "rangement", "ranger", "lessive", "vaisselle", "maison", "bricolage", "jardin", "poubelle"] },
    { n: "coeur", m: ["famille", "enfant", "fils", "fille", "femme", "mari", "couple", "parents", "amis", "maman", "papa", "anniversaire"] },
    { n: "dossier", m: ["admin", "paperasse", "dossier", "contrat", "juridique", "assurance", "papiers", "devis signe"] },
    { n: "code", m: ["code", "dev", "site", "bug", "appli", "technique", "serveur", "seo"] },
    { n: "voiture", m: ["voiture", "route", "deplacement", "train", "trajet", "livraison", "chantier", "garage"] }
  ];
  const sansAccent = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  function pictoDe(label, kind) {
    const s = sansAccent(label);
    if (s.trim()) {
      for (const r of REGLES) {
        for (const mot of r.m) {
          const motif = new RegExp("\\b" + mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
          if (motif.test(s)) return r.n;
        }
      }
    }
    if (kind === "perso") return "coeur";
    if (kind === "ancre") return "horloge";
    return "mallette";
  }
  function Picto({ nom, size = 19 }) {
    return /* @__PURE__ */ React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" }, DESSINS[nom] || DESSINS.mallette);
  }
  const emptyDay = () => ({ checks: {}, priorities: [], tasks: [] });
  function itemsOfDay(day, habits) {
    const d = day || emptyDay();
    const list = [];
    habits.forEach((h) => list.push(!!d.checks?.[h.id]));
    (d.priorities || []).forEach((p) => list.push(!!p.done));
    (d.tasks || []).forEach((t) => list.push(!!t.done));
    return list;
  }
  function pctOfDay(day, habits) {
    const list = itemsOfDay(day, habits);
    if (!list.length) return 0;
    return Math.round(list.filter(Boolean).length / list.length * 100);
  }
  function computeStreak(days, habits, todayKey) {
    let streak = 0;
    let k = todayKey;
    if (!days[todayKey] || pctOfDay(days[todayKey], habits) < SEUIL_SERIE) k = shiftKey(todayKey, -1);
    for (let i = 0; i < 400; i++) {
      if (!days[k] || pctOfDay(days[k], habits) < SEUIL_SERIE) break;
      streak++;
      k = shiftKey(k, -1);
    }
    return streak;
  }
  const CSS = `
:root {
  --violet: #4B24D6;
  --violet-fonce: #3A1AAE;
  --violet-vif: #7B4DFF;
  --corail: #FF5A36;
  --ambre: #F5A114;
  --encre: #1A1330;
  --gris: #6F6890;
  --fond: #F4F1FE;
  --blanc: #FFFFFF;
  --trait: #E4DEF8;
}
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
.app {
  height: 100vh; display: flex; flex-direction: column; background: var(--fond); color: var(--encre);
  font-family: "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
  font-size: 15px; line-height: 1.45;
}
.serif { font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; }
.scroll { flex: 1; overflow-y: auto; overscroll-behavior: contain; }
.wrap { max-width: 470px; margin: 0 auto; padding: 0 16px 30px; }

/* ---- Panneau du haut ---- */
.panneau {
  background: var(--violet); color: #fff; padding: 14px 16px 22px;
  border-radius: 0 0 26px 26px;
}
.panneau-inner { max-width: 470px; margin: 0 auto; }
.jours-nav { display: flex; gap: 6px; background: rgba(255,255,255,.14); padding: 4px; border-radius: 14px; }
.jour-btn {
  flex: 1; padding: 9px 4px; border: 0; background: none; border-radius: 11px;
  font: inherit; font-size: 13.5px; color: rgba(255,255,255,.72); cursor: pointer; font-weight: 500;
}
.jour-btn.on { background: #fff; color: var(--violet); font-weight: 700; }
.panneau-date { font-size: 12.5px; color: rgba(255,255,255,.68); margin-top: 16px; }
.panneau-corps { display: flex; align-items: flex-end; justify-content: space-between; gap: 14px; margin-top: 2px; }
.pct { font-size: 66px; line-height: .88; letter-spacing: -.035em; font-weight: 500; }
.pct-sous { font-size: 13px; color: rgba(255,255,255,.78); margin-top: 6px; }
.badge-serie {
  flex: none; background: var(--ambre); color: #2A1A00; border-radius: 12px;
  padding: 8px 11px; text-align: center; font-size: 11px; font-weight: 600; line-height: 1.2;
}
.badge-serie b { display: block; font-size: 20px; font-weight: 700; }
.rail { display: flex; gap: 3px; height: 9px; margin-top: 18px; }
.seg { flex: 1; border-radius: 3px; background: rgba(255,255,255,.26); }
.seg.on { background: #fff; }
.demain-note { margin-top: 18px; font-size: 13.5px; color: rgba(255,255,255,.82); line-height: 1.5; }

/* ---- Sections ---- */
.section { margin-top: 22px; }
.section-tete { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 9px; }
.section-tete h2 { margin: 0; font-size: 16px; font-weight: 700; letter-spacing: -.015em; }
.compteur { font-size: 12.5px; color: var(--gris); font-weight: 600; }

/* ---- Saisie ---- */
.bloc-saisie { background: var(--blanc); border: 1px solid var(--trait); border-radius: 16px; padding: 10px; margin-bottom: 12px; }
.rangee { display: flex; gap: 8px; align-items: center; }
.champ {
  flex: 1; min-width: 0; padding: 11px 12px; border-radius: 11px; border: 1px solid var(--trait);
  background: #FAF9FF; font: inherit; font-size: 14.5px; color: var(--encre);
}
.champ::placeholder { color: #A79FC4; }
.champ:focus { outline: none; border-color: var(--violet-vif); background: #fff; }
.champ.heure-champ { flex: none; width: 96px; font-variant-numeric: tabular-nums; }
.btn-ajout {
  flex: none; width: 44px; height: 44px; border-radius: 12px; border: 0; background: var(--violet); color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.btn-ajout:disabled { background: #CFC7EC; cursor: default; }
.choix { display: flex; gap: 7px; margin-bottom: 9px; }
.choix-btn {
  padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--trait); background: #fff;
  font: inherit; font-size: 12.5px; font-weight: 600; color: var(--gris); cursor: pointer;
}
.choix-btn.on.pro { background: var(--violet); border-color: var(--violet); color: #fff; }
.choix-btn.on.perso { background: var(--corail); border-color: var(--corail); color: #fff; }
.choix-btn.on.ancre { background: var(--ambre); border-color: var(--ambre); color: #2A1A00; }

/* ---- Lignes ---- */
.ligne {
  display: flex; align-items: center; gap: 11px; width: 100%; text-align: left;
  background: var(--blanc); border: 1px solid var(--trait); border-left: 5px solid var(--trait);
  border-radius: 14px; padding: 12px 12px 12px 11px; margin-bottom: 7px; font: inherit; color: inherit;
}
.ligne.pro { border-left-color: var(--violet); }
.ligne.perso { border-left-color: var(--corail); }
.ligne.ancre { border-left-color: var(--ambre); }
.ligne.faite { background: #FBFAFF; border-color: var(--trait); }
.ligne.cliquable { cursor: pointer; }
.ligne.cliquable:active { background: #F7F5FF; }
.case {
  flex: none; width: 24px; height: 24px; border-radius: 8px; border: 2px solid #D6CEF3; background: #fff;
  display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; padding: 0;
}
.case.on.pro { background: var(--violet); border-color: var(--violet); }
.case.on.perso { background: var(--corail); border-color: var(--corail); }
.case.on.ancre { background: var(--ambre); border-color: var(--ambre); color: #2A1A00; }
.corps { flex: 1; min-width: 0; }
.txt { font-size: 14.5px; font-weight: 500; }
.txt.on { color: var(--gris); text-decoration: line-through; text-decoration-thickness: 1.5px; font-weight: 400; }
.meta { display: flex; align-items: center; gap: 7px; margin-top: 4px; }
.pastille { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; letter-spacing: .01em; }
.pastille.pro { background: #EBE4FF; color: var(--violet-fonce); }
.pastille.perso { background: #FFE6DF; color: #C13411; }
.pastille.ancre { background: #FDEFD2; color: #8A5A00; }
.heure { font-size: 12px; font-weight: 700; color: var(--gris); font-variant-numeric: tabular-nums; }
.picto {
  position: relative; flex: none; width: 36px; height: 36px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.picto.pro { background: #EDE7FF; color: var(--violet); }
.picto.perso { background: #FFE7E0; color: #DB421B; }
.picto.ancre { background: #FDF0D5; color: #B27508; }
.ligne.faite .picto { opacity: .45; }
.num {
  position: absolute; top: -6px; left: -6px; width: 19px; height: 19px; border-radius: 50%;
  background: var(--encre); color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; border: 2px solid var(--blanc);
}
.picto-saisie { flex: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.croix { flex: none; background: none; border: 0; padding: 5px; color: #B7AFD4; cursor: pointer; border-radius: 8px; }
.croix:hover { color: var(--corail); }
.vide { font-size: 13.5px; color: var(--gris); padding: 2px 4px 6px; line-height: 1.5; }

/* ---- Suivi ---- */
.barres { display: flex; align-items: flex-end; gap: 5px; height: 130px; }
.col { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; height: 100%; }
.barre { border-radius: 4px 4px 0 0; background: var(--violet); min-height: 4px; }
.barre.faible { background: var(--violet-vif); opacity: .45; }
.barre.nulle { background: #DDD5F5; height: 4px; }
.jours-lbl { display: flex; gap: 5px; margin-top: 7px; }
.jours-lbl span { flex: 1; text-align: center; font-size: 10px; color: var(--gris); font-weight: 600; }
.stats { display: flex; gap: 9px; margin-top: 16px; }
.stat { flex: 1; background: var(--blanc); border: 1px solid var(--trait); border-radius: 14px; padding: 13px; }
.stat b { display: block; font-size: 26px; font-weight: 500; letter-spacing: -.02em; color: var(--violet); }
.stat span { font-size: 11px; color: var(--gris); }
.grille-h { display: flex; align-items: center; gap: 10px; padding: 11px 0; border-bottom: 1px solid var(--trait); }
.pile { display: flex; flex-direction: column; width: 100%; border-radius: 4px 4px 0 0; overflow: hidden; min-height: 5px; }
.part-reste { background: #DED7F7; min-height: 0; }
.part-faite { background: var(--violet); min-height: 0; }
.equilibre { margin-top: 16px; }
.equilibre-barre { display: flex; height: 12px; border-radius: 6px; overflow: hidden; background: #DED7F7; }
.part-pro { background: var(--violet); }
.part-perso { background: var(--corail); }
.equilibre-lbl { display: flex; gap: 16px; margin-top: 8px; font-size: 12px; color: var(--gris); font-weight: 600; }
.equilibre-lbl span { display: flex; align-items: center; gap: 6px; }
.point-pro, .point-perso { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
.point-pro { background: var(--violet); }
.point-perso { background: var(--corail); }
.btn-reporter {
  flex: none; padding: 7px 11px; border-radius: 10px; border: 1.5px solid var(--trait);
  background: #fff; font: inherit; font-size: 12px; font-weight: 700; color: var(--violet); cursor: pointer;
}
.btn-reporter:active { background: #EEE9FE; }
.grille-h .lbl { flex: 1; font-size: 13.5px; font-weight: 500; min-width: 0; }
.points { display: flex; gap: 4px; }
.pt { width: 14px; height: 14px; border-radius: 5px; background: #DED7F7; }
.pt.on { background: var(--violet); }

/* ---- R\xE9glages ---- */
.carte { background: var(--blanc); border: 1px solid var(--trait); border-radius: 16px; padding: 11px; margin-bottom: 8px; }
.btn-plein { flex: 1; padding: 13px; border-radius: 12px; border: 0; background: var(--violet); color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
.btn-plein:disabled { background: #CFC7EC; }
.btn-vide { flex: 1; padding: 12px; border-radius: 12px; border: 1.5px solid var(--trait); background: #fff; font: inherit; font-weight: 600; color: var(--gris); cursor: pointer; }

/* ---- Barre du bas ---- */
.onglets { flex: none; display: flex; gap: 4px; background: #fff; border-top: 1px solid var(--trait); padding: 7px 10px calc(7px + env(safe-area-inset-bottom)); }
.onglet { flex: 1; padding: 10px 4px; border: 0; background: none; font: inherit; font-size: 13px; font-weight: 600; color: var(--gris); cursor: pointer; border-radius: 11px; }
.onglet.on { color: var(--violet); background: #EEE9FE; }

.alerte { margin: 14px 0 0; padding: 11px 13px; border-radius: 12px; background: #FFE6DF; color: #A82C0C; font-size: 12.5px; }
button:focus-visible, input:focus-visible { outline: 2.5px solid var(--violet-vif); outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) {
  .seg, .barre, .case, .jour-btn, .onglet { transition: background-color .2s ease, color .2s ease; }
}
`;
  function MaRoutine() {
    const [todayKey] = useState(() => toKey(/* @__PURE__ */ new Date()));
    const [decalage, setDecalage] = useState(0);
    const [habits, setHabits] = useState(DEFAULT_HABITS);
    const [days, setDays] = useState({});
    const [vue, setVue] = useState("jour");
    const [pret, setPret] = useState(false);
    const [souci, setSouci] = useState("");
    const [maintenant, setMaintenant] = useState(() => /* @__PURE__ */ new Date());
    const premier = useRef(true);
    const dateKey = shiftKey(todayKey, decalage);
    useEffect(() => {
      (async () => {
        try {
          const r = await window.storage.get("routine:config");
          const c = r ? JSON.parse(r.value) : null;
          if (c?.habits?.length) setHabits(c.habits);
        } catch (e) {
        }
        try {
          const r = await window.storage.get("routine:days");
          if (r) setDays(JSON.parse(r.value) || {});
        } catch (e) {
        }
        setPret(true);
      })();
    }, []);
    useEffect(() => {
      if (!pret) return;
      if (premier.current) {
        premier.current = false;
        return;
      }
      const t = setTimeout(async () => {
        try {
          const cles = Object.keys(days).sort().slice(-150);
          const compact = {};
          cles.forEach((k) => {
            compact[k] = days[k];
          });
          await window.storage.set("routine:days", JSON.stringify(compact));
          await window.storage.set("routine:config", JSON.stringify({ habits }));
          setSouci("");
        } catch (e) {
          setSouci("La sauvegarde a \xE9chou\xE9. Tes coches restent affich\xE9es mais risquent d'\xEAtre perdues.");
        }
      }, 500);
      return () => clearTimeout(t);
    }, [days, habits, pret]);
    useEffect(() => {
      const t = setInterval(() => setMaintenant(/* @__PURE__ */ new Date()), 6e4);
      return () => clearInterval(t);
    }, []);
    const day = days[dateKey] || emptyDay();
    const items = useMemo(() => itemsOfDay(day, habits), [day, habits]);
    const pct = useMemo(() => pctOfDay(day, habits), [day, habits]);
    const faits = items.filter(Boolean).length;
    const serie = useMemo(() => computeStreak(days, habits, todayKey), [days, habits, todayKey]);
    const majJour = (patch) => setDays((prev) => ({ ...prev, [dateKey]: { ...prev[dateKey] || emptyDay(), ...patch } }));
    const restant = () => {
      const h = maintenant.getHours() + maintenant.getMinutes() / 60;
      const reste = 24 - h;
      if (reste <= 0.05) return null;
      const hh = Math.floor(reste);
      const mm = Math.round((reste - hh) * 60);
      return hh >= 1 ? `encore ${hh} h ${pad(mm)} avant minuit` : `encore ${mm} min avant minuit`;
    };
    const rituels = useMemo(
      () => [...habits].sort((a, b) => (a.time || "").localeCompare(b.time || "")),
      [habits]
    );
    const prevus = (day.priorities || []).length + (day.tasks || []).length;
    return /* @__PURE__ */ React.createElement("div", { className: "app" }, /* @__PURE__ */ React.createElement("style", null, CSS), vue === "jour" ? /* @__PURE__ */ React.createElement("header", { className: "panneau" }, /* @__PURE__ */ React.createElement("div", { className: "panneau-inner" }, /* @__PURE__ */ React.createElement("div", { className: "jours-nav" }, [[-1, "Hier"], [0, "Aujourd'hui"], [1, "Demain"]].map(([v, txt]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: v,
        className: `jour-btn ${decalage === v ? "on" : ""}`,
        onClick: () => setDecalage(v)
      },
      txt
    ))), /* @__PURE__ */ React.createElement("div", { className: "panneau-date" }, dateLongue(dateKey)), decalage === 1 ? /* @__PURE__ */ React.createElement("p", { className: "demain-note" }, prevus === 0 ? "Rien de pr\xE9vu pour l'instant. Pose ici tes priorit\xE9s et tes t\xE2ches avant d'aller dormir." : `${prevus} ${prevus > 1 ? "choses pr\xEAtes" : "chose pr\xEAte"} pour demain. Tes rituels s'ajouteront automatiquement.`) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "panneau-corps" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "pct serif" }, pct, "%"), /* @__PURE__ */ React.createElement("div", { className: "pct-sous" }, items.length === 0 ? "rien \xE0 cocher" : `${faits} sur ${items.length}${decalage === 0 && restant() ? " \xB7 " + restant() : ""}`)), serie > 0 && /* @__PURE__ */ React.createElement("div", { className: "badge-serie" }, /* @__PURE__ */ React.createElement("b", null, serie), serie > 1 ? "jours de suite" : "jour de suite")), items.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "rail" }, items.map((ok, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `seg ${ok ? "on" : ""}` })))))) : /* @__PURE__ */ React.createElement("header", { className: "panneau", style: { paddingBottom: 18 } }, /* @__PURE__ */ React.createElement("div", { className: "panneau-inner" }, /* @__PURE__ */ React.createElement("div", { className: "pct serif", style: { fontSize: 30 } }, vue === "suivi" ? "Mon suivi" : "Mes rituels"), /* @__PURE__ */ React.createElement("div", { className: "pct-sous" }, vue === "suivi" ? "Ta r\xE9gularit\xE9 sur les derni\xE8res semaines" : "La base qui revient chaque jour"))), /* @__PURE__ */ React.createElement("div", { className: "scroll" }, /* @__PURE__ */ React.createElement("div", { className: "wrap" }, souci && /* @__PURE__ */ React.createElement("p", { className: "alerte" }, souci), vue === "jour" && /* @__PURE__ */ React.createElement(
      VueJour,
      {
        day,
        rituels,
        majJour,
        futur: decalage === 1,
        pret
      }
    ), vue === "suivi" && /* @__PURE__ */ React.createElement(VueSuivi, { days, habits, todayKey, serie, setDays }), vue === "rituels" && /* @__PURE__ */ React.createElement(VueRituels, { habits, setHabits, setDays }))), /* @__PURE__ */ React.createElement("nav", { className: "onglets" }, [["jour", "Ma journ\xE9e"], ["suivi", "Suivi"], ["rituels", "Rituels"]].map(([id, txt]) => /* @__PURE__ */ React.createElement("button", { key: id, className: `onglet ${vue === id ? "on" : ""}`, onClick: () => setVue(id) }, txt))));
  }
  function VueJour({ day, rituels, majJour, futur, pret }) {
    const [prio, setPrio] = useState("");
    const [prioTag, setPrioTag] = useState("pro");
    const [tache, setTache] = useState("");
    const [tacheTag, setTacheTag] = useState("pro");
    const priorites = day.priorities || [];
    const taches = day.tasks || [];
    const ajouterPrio = () => {
      const v = prio.trim();
      if (!v || priorites.length >= 3) return;
      majJour({ priorities: [...priorites, { id: uid(), label: v, done: false, tag: prioTag }] });
      setPrio("");
    };
    const ajouterTache = () => {
      const v = tache.trim();
      if (!v) return;
      majJour({ tasks: [...taches, { id: uid(), label: v, done: false, tag: tacheTag }] });
      setTache("");
    };
    const basculer = (liste, cle, id) => majJour({ [cle]: liste.map((x) => x.id === id ? { ...x, done: !x.done } : x) });
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Mes 3 priorit\xE9s"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, priorites.length, "/3")), priorites.length < 3 && /* @__PURE__ */ React.createElement("div", { className: "bloc-saisie" }, /* @__PURE__ */ React.createElement("div", { className: "choix" }, ["pro", "perso"].map((k) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        className: `choix-btn ${k} ${prioTag === k ? "on" : ""}`,
        onClick: () => setPrioTag(k)
      },
      KIND_LABEL[k]
    ))), /* @__PURE__ */ React.createElement("div", { className: "rangee" }, /* @__PURE__ */ React.createElement("span", { className: `picto ${prioTag}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(prio, prioTag), size: 20 })), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "champ",
        value: prio,
        onChange: (e) => setPrio(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && ajouterPrio(),
        placeholder: `Priorit\xE9 ${priorites.length + 1}`
      }
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-ajout", onClick: ajouterPrio, disabled: !prio.trim(), "aria-label": "Ajouter la priorit\xE9" }, /* @__PURE__ */ React.createElement(Plus, { size: 20 })))), priorites.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Les trois choses qui feront que la journ\xE9e compte. Pas quatre."), priorites.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: p.id, className: `ligne ${p.tag || "pro"} ${p.done ? "faite" : ""}` }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `case ${p.tag || "pro"} ${p.done ? "on" : ""}`,
        "aria-label": p.done ? "D\xE9cocher" : "Cocher",
        onClick: () => basculer(priorites, "priorities", p.id)
      },
      p.done && /* @__PURE__ */ React.createElement(Check, { size: 15, strokeWidth: 3.5 })
    ), /* @__PURE__ */ React.createElement("span", { className: `picto ${p.tag || "pro"}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(p.label, p.tag), size: 20 }), /* @__PURE__ */ React.createElement("span", { className: "num" }, i + 1)), /* @__PURE__ */ React.createElement("div", { className: "corps" }, /* @__PURE__ */ React.createElement("div", { className: `txt ${p.done ? "on" : ""}` }, p.label), /* @__PURE__ */ React.createElement("div", { className: "meta" }, /* @__PURE__ */ React.createElement("span", { className: `pastille ${p.tag || "pro"}` }, KIND_LABEL[p.tag || "pro"]))), /* @__PURE__ */ React.createElement("button", { className: "croix", "aria-label": "Retirer", onClick: () => majJour({ priorities: priorites.filter((x) => x.id !== p.id) }) }, /* @__PURE__ */ React.createElement(X, { size: 17 }))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Ma to-do list"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, taches.filter((t) => t.done).length, "/", taches.length)), /* @__PURE__ */ React.createElement("div", { className: "bloc-saisie" }, /* @__PURE__ */ React.createElement("div", { className: "choix" }, ["pro", "perso"].map((k) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        className: `choix-btn ${k} ${tacheTag === k ? "on" : ""}`,
        onClick: () => setTacheTag(k)
      },
      KIND_LABEL[k]
    ))), /* @__PURE__ */ React.createElement("div", { className: "rangee" }, /* @__PURE__ */ React.createElement("span", { className: `picto ${tacheTag}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(tache, tacheTag), size: 20 })), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "champ",
        value: tache,
        onChange: (e) => setTache(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && ajouterTache(),
        placeholder: "Ajouter une t\xE2che"
      }
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-ajout", onClick: ajouterTache, disabled: !tache.trim(), "aria-label": "Ajouter la t\xE2che" }, /* @__PURE__ */ React.createElement(Plus, { size: 20 })))), taches.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Vide-toi la t\xEAte ici : tout ce qui tra\xEEne, en vrac."), taches.map((t) => /* @__PURE__ */ React.createElement("div", { key: t.id, className: `ligne ${t.tag || "pro"} ${t.done ? "faite" : ""}` }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `case ${t.tag || "pro"} ${t.done ? "on" : ""}`,
        "aria-label": t.done ? "D\xE9cocher" : "Cocher",
        onClick: () => basculer(taches, "tasks", t.id)
      },
      t.done && /* @__PURE__ */ React.createElement(Check, { size: 15, strokeWidth: 3.5 })
    ), /* @__PURE__ */ React.createElement("span", { className: `picto ${t.tag || "pro"}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(t.label, t.tag), size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "corps" }, /* @__PURE__ */ React.createElement("div", { className: `txt ${t.done ? "on" : ""}` }, t.label), /* @__PURE__ */ React.createElement("div", { className: "meta" }, /* @__PURE__ */ React.createElement("span", { className: `pastille ${t.tag || "pro"}` }, KIND_LABEL[t.tag || "pro"]))), /* @__PURE__ */ React.createElement("button", { className: "croix", "aria-label": "Retirer", onClick: () => majJour({ tasks: taches.filter((x) => x.id !== t.id) }) }, /* @__PURE__ */ React.createElement(X, { size: 17 }))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Le fil de la journ\xE9e"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, futur ? "demain" : `${rituels.filter((h) => day.checks?.[h.id]).length}/${rituels.length}`)), futur && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Ces rituels se cocheront demain, ils sont l\xE0 pour te projeter."), rituels.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Aucun rituel. Ajoute-les dans l'onglet \xAB Rituels \xBB."), rituels.map((h) => {
      const ok = !!day.checks?.[h.id];
      const kind = h.kind || "pro";
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: h.id,
          className: `ligne ${kind} ${ok ? "faite" : ""} ${futur ? "" : "cliquable"}`,
          disabled: futur,
          style: futur ? { opacity: 0.6 } : void 0,
          onClick: () => !futur && majJour({ checks: { ...day.checks || {}, [h.id]: !ok } })
        },
        /* @__PURE__ */ React.createElement("span", { className: `case ${kind} ${ok ? "on" : ""}` }, ok && /* @__PURE__ */ React.createElement(Check, { size: 15, strokeWidth: 3.5 })),
        /* @__PURE__ */ React.createElement("span", { className: `picto ${kind}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(h.label, kind), size: 20 })),
        /* @__PURE__ */ React.createElement("span", { className: "corps" }, /* @__PURE__ */ React.createElement("span", { className: `txt ${ok ? "on" : ""}` }, h.label), /* @__PURE__ */ React.createElement("span", { className: "meta" }, /* @__PURE__ */ React.createElement("span", { className: "heure" }, h.time || "\u2014"), /* @__PURE__ */ React.createElement("span", { className: `pastille ${kind}` }, KIND_LABEL[kind])))
      );
    })), !pret && /* @__PURE__ */ React.createElement("p", { className: "vide", style: { marginTop: 16 } }, "Chargement de tes journ\xE9es\u2026"));
  }
  function VueSuivi({ days, habits, todayKey, serie, setDays }) {
    const derniers = useMemo(() => {
      const out = [];
      for (let i = 13; i >= 0; i--) {
        const k = shiftKey(todayKey, -i);
        const d = days[k];
        const taches = d?.tasks || [];
        const prios = d?.priorities || [];
        out.push({
          key: k,
          date: fromKey(k),
          pct: d ? pctOfDay(d, habits) : null,
          creees: taches.length,
          faites: taches.filter((t) => t.done).length,
          prios: prios.length,
          priosFaites: prios.filter((p) => p.done).length
        });
      }
      return out;
    }, [days, habits, todayKey]);
    const remplis = derniers.filter((d) => d.pct !== null);
    const moyenne = remplis.length ? Math.round(remplis.reduce((s, d) => s + d.pct, 0) / remplis.length) : 0;
    const bonnes = remplis.filter((d) => d.pct >= SEUIL_SERIE).length;
    const bilan = useMemo(() => {
      let creees = 0, faites = 0, proF = 0, persoF = 0;
      let prios = 0, priosFaites = 0, joursAvecPrios = 0, joursTroisPrios = 0;
      derniers.forEach((d) => {
        creees += d.creees;
        faites += d.faites;
        prios += d.prios;
        priosFaites += d.priosFaites;
        if (d.prios > 0) joursAvecPrios++;
        if (d.prios > 0 && d.priosFaites === d.prios) joursTroisPrios++;
        const jour = days[d.key];
        (jour?.tasks || []).forEach((t) => {
          if (t.done) {
            if (t.tag === "perso") persoF++;
            else proF++;
          }
        });
      });
      return {
        creees,
        faites,
        proF,
        persoF,
        prios,
        priosFaites,
        joursAvecPrios,
        joursTroisPrios,
        taux: creees ? Math.round(faites / creees * 100) : 0,
        tauxPrios: prios ? Math.round(priosFaites / prios * 100) : 0
      };
    }, [derniers, days]);
    const maxTaches = Math.max(1, ...derniers.map((d) => d.creees));
    const enAttente = useMemo(() => {
      const out = [];
      for (let i = 7; i >= 1; i--) {
        const k = shiftKey(todayKey, -i);
        const d = days[k];
        if (!d) continue;
        (d.priorities || []).forEach((p) => {
          if (!p.done) out.push({ ...p, jour: k, source: "priorities" });
        });
        (d.tasks || []).forEach((t) => {
          if (!t.done) out.push({ ...t, jour: k, source: "tasks" });
        });
      }
      return out;
    }, [days, todayKey]);
    const reporter = (item) => {
      setDays((prev) => {
        const source = prev[item.jour] || emptyDay();
        const cible = prev[todayKey] || emptyDay();
        return {
          ...prev,
          [item.jour]: { ...source, [item.source]: (source[item.source] || []).filter((x) => x.id !== item.id) },
          [todayKey]: {
            ...cible,
            tasks: [...cible.tasks || [], { id: uid(), label: item.label, done: false, tag: item.tag || "pro" }]
          }
        };
      });
    };
    const reporterTout = () => enAttente.forEach((item) => reporter(item));
    const sept = useMemo(() => {
      const out = [];
      for (let i = 6; i >= 0; i--) out.push(shiftKey(todayKey, -i));
      return out;
    }, [todayKey]);
    const totalFait = bilan.proF + bilan.persoF;
    const partPro = totalFait ? Math.round(bilan.proF / totalFait * 100) : 0;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Les 14 derniers jours"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, "moyenne ", moyenne, "%")), /* @__PURE__ */ React.createElement("div", { className: "barres" }, derniers.map((d) => /* @__PURE__ */ React.createElement("div", { className: "col", key: d.key }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `barre ${d.pct === null ? "nulle" : d.pct >= SEUIL_SERIE ? "" : "faible"}`,
        style: { height: d.pct === null ? 4 : `${Math.max(5, d.pct)}%` },
        title: `${d.date.toLocaleDateString("fr-FR")} \u2014 ${d.pct === null ? "pas de donn\xE9es" : d.pct + "%"}`
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "jours-lbl" }, derniers.map((d) => /* @__PURE__ */ React.createElement("span", { key: d.key }, JOURS[d.date.getDay()][0].toUpperCase()))), /* @__PURE__ */ React.createElement("div", { className: "stats" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, moyenne, "%"), /* @__PURE__ */ React.createElement("span", null, "moyenne sur 14 jours")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, bonnes), /* @__PURE__ */ React.createElement("span", null, "jours au-dessus de ", SEUIL_SERIE, "%")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, serie), /* @__PURE__ */ React.createElement("span", null, "jours de suite")))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Ma to-do list"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, bilan.faites, "/", bilan.creees, " sur 14 jours")), bilan.creees === 0 ? /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Aucune t\xE2che enregistr\xE9e sur les deux derni\xE8res semaines. Le suivi appara\xEEtra d\xE8s que tu en ajoutes.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "barres" }, derniers.map((d) => /* @__PURE__ */ React.createElement("div", { className: "col", key: d.key }, d.creees === 0 ? /* @__PURE__ */ React.createElement("div", { className: "barre nulle" }) : /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "pile",
        style: { height: `${Math.max(8, d.creees / maxTaches * 100)}%` },
        title: `${d.date.toLocaleDateString("fr-FR")} \u2014 ${d.faites} sur ${d.creees}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "part-reste", style: { flexGrow: d.creees - d.faites } }),
      /* @__PURE__ */ React.createElement("div", { className: "part-faite", style: { flexGrow: d.faites } })
    )))), /* @__PURE__ */ React.createElement("div", { className: "jours-lbl" }, derniers.map((d) => /* @__PURE__ */ React.createElement("span", { key: d.key }, d.creees || "\xB7"))), /* @__PURE__ */ React.createElement("div", { className: "stats" }, /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, bilan.taux, "%"), /* @__PURE__ */ React.createElement("span", null, "des t\xE2ches termin\xE9es")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, bilan.tauxPrios, "%"), /* @__PURE__ */ React.createElement("span", null, "des priorit\xE9s tenues")), /* @__PURE__ */ React.createElement("div", { className: "stat" }, /* @__PURE__ */ React.createElement("b", { className: "serif" }, bilan.joursTroisPrios), /* @__PURE__ */ React.createElement("span", null, "jours 100% priorit\xE9s"))), totalFait > 0 && /* @__PURE__ */ React.createElement("div", { className: "equilibre" }, /* @__PURE__ */ React.createElement("div", { className: "equilibre-barre" }, /* @__PURE__ */ React.createElement("div", { className: "part-pro", style: { width: `${partPro}%` } }), /* @__PURE__ */ React.createElement("div", { className: "part-perso", style: { width: `${100 - partPro}%` } })), /* @__PURE__ */ React.createElement("div", { className: "equilibre-lbl" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "point-pro" }), " ", bilan.proF, " pro"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("i", { className: "point-perso" }), " ", bilan.persoF, " perso"))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Rest\xE9 en plan"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, enAttente.length)), enAttente.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Rien ne tra\xEEne sur les 7 derniers jours. C'est le bon signe.") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Non fait les jours pr\xE9c\xE9dents. Un appui le remet dans ta to-do d'aujourd'hui."), enAttente.slice(0, 12).map((item) => /* @__PURE__ */ React.createElement("div", { className: `ligne ${item.tag || "pro"}`, key: item.source + item.id }, /* @__PURE__ */ React.createElement("span", { className: `picto ${item.tag || "pro"}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(item.label, item.tag), size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "corps" }, /* @__PURE__ */ React.createElement("div", { className: "txt" }, item.label), /* @__PURE__ */ React.createElement("div", { className: "meta" }, /* @__PURE__ */ React.createElement("span", { className: "heure" }, dateCourte(item.jour)), item.source === "priorities" && /* @__PURE__ */ React.createElement("span", { className: `pastille ${item.tag || "pro"}` }, "Priorit\xE9"))), /* @__PURE__ */ React.createElement("button", { className: "btn-reporter", onClick: () => reporter(item) }, "Reporter"))), enAttente.length > 12 && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "et ", enAttente.length - 12, " autres."), /* @__PURE__ */ React.createElement("button", { className: "btn-vide", style: { width: "100%", marginTop: 6 }, onClick: reporterTout }, "Tout reporter \xE0 aujourd'hui"))), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Rituel par rituel"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, "7 derniers jours")), habits.map((h) => /* @__PURE__ */ React.createElement("div", { className: "grille-h", key: h.id }, /* @__PURE__ */ React.createElement("span", { className: `picto ${h.kind || "pro"}`, style: { width: 30, height: 30, borderRadius: 10 } }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(h.label, h.kind), size: 17 })), /* @__PURE__ */ React.createElement("div", { className: "lbl" }, h.label), /* @__PURE__ */ React.createElement("div", { className: "points" }, sept.map((k, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: `pt ${days[k]?.checks?.[h.id] ? "on" : ""}` }))))), habits.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Ajoute des rituels pour voir ton suivi.")), /* @__PURE__ */ React.createElement("p", { className: "vide", style: { marginTop: 20 } }, "Regarde la moyenne, pas la journ\xE9e d'hier. Une routine se juge sur deux semaines."));
  }
  function VueRituels({ habits, setHabits, setDays }) {
    const [label, setLabel] = useState("");
    const [time, setTime] = useState("09:00");
    const [kind, setKind] = useState("pro");
    const [confirme, setConfirme] = useState(false);
    const ajouter = () => {
      const v = label.trim();
      if (!v) return;
      setHabits([...habits, { id: uid(), label: v, time, kind }]);
      setLabel("");
    };
    const remiseAZero = async () => {
      setDays({});
      setHabits(DEFAULT_HABITS);
      setConfirme(false);
      try {
        await window.storage.delete("routine:days");
        await window.storage.delete("routine:config");
      } catch (e) {
      }
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Ajouter un rituel")), /* @__PURE__ */ React.createElement("div", { className: "bloc-saisie" }, /* @__PURE__ */ React.createElement("div", { className: "choix" }, ["ancre", "pro", "perso"].map((k) => /* @__PURE__ */ React.createElement("button", { key: k, className: `choix-btn ${k} ${kind === k ? "on" : ""}`, onClick: () => setKind(k) }, KIND_LABEL[k]))), /* @__PURE__ */ React.createElement("div", { className: "rangee", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { className: `picto ${kind}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(label, kind), size: 20 })), /* @__PURE__ */ React.createElement("input", { className: "champ heure-champ", type: "time", value: time, onChange: (e) => setTime(e.target.value) })), /* @__PURE__ */ React.createElement("div", { className: "rangee", style: { marginBottom: 8 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "champ",
        value: label,
        onChange: (e) => setLabel(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && ajouter(),
        placeholder: "Ex. 20 min de marche"
      }
    )), /* @__PURE__ */ React.createElement("button", { className: "btn-plein", style: { width: "100%" }, onClick: ajouter, disabled: !label.trim() }, "Ajouter le rituel")), /* @__PURE__ */ React.createElement("p", { className: "vide" }, "Une ancre structure la journ\xE9e (r\xE9veil, coucher). Le reste se r\xE9partit entre pro et perso.")), /* @__PURE__ */ React.createElement("section", { className: "section" }, /* @__PURE__ */ React.createElement("div", { className: "section-tete" }, /* @__PURE__ */ React.createElement("h2", null, "Mes rituels quotidiens"), /* @__PURE__ */ React.createElement("span", { className: "compteur" }, habits.length)), habits.map((h) => /* @__PURE__ */ React.createElement("div", { className: "carte", key: h.id }, /* @__PURE__ */ React.createElement("div", { className: "rangee", style: { marginBottom: 9 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "champ heure-champ",
        type: "time",
        value: h.time || "",
        onChange: (e) => setHabits(habits.map((x) => x.id === h.id ? { ...x, time: e.target.value } : x))
      }
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "champ",
        value: h.label,
        onChange: (e) => setHabits(habits.map((x) => x.id === h.id ? { ...x, label: e.target.value } : x))
      }
    ), /* @__PURE__ */ React.createElement("button", { className: "croix", "aria-label": `Supprimer ${h.label}`, onClick: () => setHabits(habits.filter((x) => x.id !== h.id)) }, /* @__PURE__ */ React.createElement(Trash2, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "rangee" }, /* @__PURE__ */ React.createElement("span", { className: `picto ${h.kind || "pro"}` }, /* @__PURE__ */ React.createElement(Picto, { nom: pictoDe(h.label, h.kind), size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "choix", style: { marginBottom: 0, flex: 1 } }, ["ancre", "pro", "perso"].map((k) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        className: `choix-btn ${k} ${h.kind === k ? "on" : ""}`,
        onClick: () => setHabits(habits.map((x) => x.id === h.id ? { ...x, kind: k } : x))
      },
      KIND_LABEL[k]
    ))))))), /* @__PURE__ */ React.createElement("section", { className: "section" }, !confirme ? /* @__PURE__ */ React.createElement("button", { className: "btn-vide", style: { width: "100%" }, onClick: () => setConfirme(true) }, "Tout effacer et repartir de z\xE9ro") : /* @__PURE__ */ React.createElement("div", { className: "carte" }, /* @__PURE__ */ React.createElement("p", { style: { margin: "2px 0 11px", fontSize: 13.5 } }, "\xC7a supprime tout ton historique et remet les rituels d'origine. C'est d\xE9finitif."), /* @__PURE__ */ React.createElement("div", { className: "rangee" }, /* @__PURE__ */ React.createElement("button", { className: "btn-vide", onClick: () => setConfirme(false) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { className: "btn-plein", onClick: remiseAZero }, "Effacer")))));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(MaRoutine));
})();
