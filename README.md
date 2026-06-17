# Elio - Landing page VivaTech

Landing page mobile-first pour la capture de leads au salon VivaTech 2026.

---

## Setup local

```bash
npm install
# .env.local est déjà créé, remplir les valeurs (voir ci-dessous)
npm run dev   # http://localhost:3000
```

---

## Variables d'environnement

| Variable | Requis | Description |
|---|---|---|
| `RESEND_API_KEY` | Oui | Clé API Resend — via Vercel Marketplace (recommandé) ou [resend.com](https://resend.com) |
| `LEAD_NOTIFY_EMAIL` | Oui | Email de notification (`contact@elio-robot.fr`) |
| `NEXT_PUBLIC_CALENDLY_URL` | Non | URL Calendly (ex: `https://calendly.com/elio/30min`) |

**Prérequis Resend:** le domaine `elio-robot.fr` doit être vérifié dans le dashboard Resend avant l'envoi depuis `contact@elio-robot.fr`. Voir "Resend via Vercel Marketplace" ci-dessous.

---

## Vidéos de démonstration

Les vidéos sont intégrées directement dans `app/components/VideoTabs.tsx` avec 5 onglets:

| Onglet | Description | ID YouTube |
|---|---|---|
| Propreté | Nettoyage autonome | `fBUd3LGrbX8` |
| Logistique | AMR entrepôt | `RHblO-snwsc` |
| Hôtellerie | Livraison en chambre | `b24OS_03ISs` |
| Accueil | Réception et guidage | `iXXamxae2vg` |
| Humanoïde | Robot polyvalent | `A6vH-QyBTIw` |

Pour modifier une vidéo ou ajouter un onglet, éditez le tableau `TABS` dans ce fichier.

---

## Resend via Vercel Marketplace (recommandé)

Plutôt que de gérer la clé API manuellement, installez l'intégration Resend directement depuis Vercel:

1. Dans le dashboard Vercel, ouvrir **Marketplace** et chercher "Resend"
2. Installer l'intégration sur le projet `elio-robot`
3. Resend ajoute automatiquement `RESEND_API_KEY` à l'environnement
4. Dans le dashboard Resend, vérifier le domaine `elio-robot.fr` (ajout d'un enregistrement DNS TXT)
5. Créer l'adresse `contact@elio-robot.fr` comme expéditeur autorisé

---

## Déployer sur Vercel

### 1. Installer la Vercel CLI (si besoin)
```bash
npm i -g vercel
```

### 2. Lier le projet au projet Vercel existant
```bash
vercel link
```

### 3. Configurer les variables d'environnement sur Vercel
```bash
vercel env add RESEND_API_KEY
vercel env add LEAD_NOTIFY_EMAIL
vercel env add NEXT_PUBLIC_CALENDLY_URL
vercel env add NEXT_PUBLIC_DEMO_VIDEO
```

### 4. Déployer en production
```bash
vercel --prod
```

Le domaine `elio-robot.fr` est à configurer dans **Project Settings > Domains** dans le dashboard Vercel.

---

## Logique de qualification des leads

Chaque soumission de formulaire déclenche un email de notification avec un tier calculé automatiquement:

| Surface déclarée | Tier |
|---|---|
| 1 000 m² et plus | **Viable** |
| Moins de 1 000 m² | A écarter (surface insuffisante) |

Sujet de l'email: `Lead VivaTech: {Société} ({Secteur}, {Surface}m²) - {Tier}`
