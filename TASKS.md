# Jujugre — suivi produit / UI

## Récemment traité

- **Stitch « Jujugre Editorial » (implémentation code)** : surfaces `--surface-canvas` / `--surface-nest`, `surface-quiet` tonal + ring léger, `shadow-paper`, progress « trait » (piste `progress-track`, remplissage `accent`), bouton primaire léger `bg-linear-to-b`, cartes adoucies, inputs fond `secondary` + focus sauge, `PageShell` sur canvas. Voir `app/globals.css` + `components/ui/*`.
- **Typographie** : **Helvetica / Helvetica Neue / Arial** (pile système) pour l’UI ; **Newsreader** seulement sur `h1`, citations, titres coach markdown, et titres explicitement `font-serif` / `font-display`. Chiffres = `text-stat` / `text-stat-lg` (sans + `tabular-nums`). **Mono** réservé aux blocs `<pre>` coach et aux traces `error-boundary`.
- **Error log — rangée d’actions** : grille CTA + `min-w-0` (plus de débordement « Mark reviewed »).

## À garder en tête (layout)

- Éviter `w-full` sur un bouton frère d’un `flex-1` sans colonne dédiée : préférer `grid grid-cols-1 sm:grid-cols-2` + `min-w-0` sur les liens pour les rangées de CTA dans les cartes.
