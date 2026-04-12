# Jujugre — suivi produit / UI

## Récemment traité

- **Error log — rangée d’actions** : le bouton « Mark reviewed » débordait de la carte (mélange `flex` + `w-full` sur un seul enfant). Corrigé avec `grid` + `min-w-0` (`app/error-log/page.tsx`). Même schéma aligné sur **Topic mastery** (`app/topic-mastery/page.tsx`).

## À garder en tête (layout)

- Éviter `w-full` sur un bouton frère d’un `flex-1` sans colonne dédiée : préférer `grid grid-cols-1 sm:grid-cols-2` + `min-w-0` sur les liens pour les rangées de CTA dans les cartes.
