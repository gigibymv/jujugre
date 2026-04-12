# Déployer Jujugre (Vercel)

## Ce qu’il faut

1. Compte [Vercel](https://vercel.com) (gratuit).
2. Le dépôt GitHub [gigibymv/jujugre](https://github.com/gigibymv/jujugre) (déjà public).
3. Variables d’environnement **côté Vercel** (pas `NEXT_PUBLIC_` pour la clé NVIDIA).

## Étapes (import GitHub)

1. Va sur [vercel.com/new](https://vercel.com/new).
2. **Import** le repo `gigibymv/jujugre`.
3. **Framework Preset** : Next.js (détecté automatiquement).
4. **Root Directory** : `.` (racine).
5. **Build & Output** : laisser par défaut, ou confirmer :
   - Install : `pnpm install --frozen-lockfile`
   - Build : `pnpm run build`
6. Avant **Deploy**, ouvre **Environment Variables** et ajoute :

| Name | Value | Environnements |
|------|--------|----------------|
| `NVIDIA_API_KEY` | ta clé `nvapi-...` | Production, Preview |
| `NVIDIA_MODEL` | `google/gemma-4-31b-it` | (optionnel, défaut dans le code) |
| `NVIDIA_ENABLE_THINKING` | `true` | (optionnel) |

Optionnel : `OPENAI_API_KEY` si tu veux un repli OpenAI sans NVIDIA.

7. Clique **Deploy**. À la fin, ouvre l’URL `*.vercel.app` : teste **Coach** et l’onboarding.

## Après le premier déploiement

- Chaque `git push` sur `main` redéploie **Production**.
- Les **Preview** sont créées pour les branches / PR.

## CLI (alternative)

```bash
pnpm dlx vercel login
cd /path/to/jujugre
pnpm dlx vercel link
pnpm dlx vercel env pull   # optionnel : récupérer les vars en local
pnpm dlx vercel --prod
```

## Notes

- **Supabase** : non requis pour l’app (localStorage côté client). Ajoute les vars `NEXT_PUBLIC_SUPABASE_*` seulement si tu branches la sync cloud.
- **Région** : `vercel.json` fixe `cdg1` (Paris). Tu peux la changer dans le dashboard Vercel si besoin.
