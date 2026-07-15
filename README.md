# Empire Nita — Frontend

Frontend web pour **Empire Nita Beauty** (salon de coiffure) et **Nita Cosmétics** (cosmétiques & formations), construit sur Next.js 14 App Router + Tailwind CSS, consommant les API du backend Supabase.

---

## 🚀 Lancer le projet en local

### 1. Prérequis

- Node.js v18+
- Un projet Supabase configuré (voir la section suivante)

### 2. Variables d'environnement

Copier le fichier exemple et renseigner les valeurs :

```bash
cp .env.local.example .env.local
```

Puis éditer `.env.local` :

```env
# Supabase (Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # jamais exposé côté client

# WhatsApp (bouton flottant)
NEXT_PUBLIC_WHATSAPP_NUMBER=22871127271

# Passerelle Mobile Money (optionnel en V1)
MOBILE_MONEY_API_KEY=
MOBILE_MONEY_API_SECRET=
MOBILE_MONEY_WEBHOOK_SECRET=
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Initialiser la base de données Supabase

1. Aller dans le **SQL Editor** de votre projet Supabase
2. Exécuter le contenu de `supabase/schema.sql`
3. Dans **Authentication > Users**, créer un compte pour la gérante
4. Dans **Table Editor > profiles**, ajouter une ligne avec l'`id` de ce compte et `role = admin`

### 5. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur **http://localhost:3000**

---

## 📂 Structure des pages

### Pages publiques

| URL | Description |
|-----|-------------|
| `/` | Accueil — présentation des deux marques |
| `/services` | Catalogue des prestations salon (tresses, wig, make-up…) |
| `/services/reserver` | Formulaire de prise de rendez-vous |
| `/boutique` | Boutique cosmétiques avec panier et tunnel de commande |
| `/formations` | Sessions de formation + inscription en ligne |
| `/contact` | Localisation, carte Google Maps, réseaux sociaux |

### Back-office Admin

| URL | Description |
|-----|-------------|
| `/admin/login` | Connexion sécurisée (email + mot de passe) |
| `/admin` | Tableau de bord — KPIs et résumés |
| `/admin/rendez-vous` | Liste et gestion des RDV (confirmer, annuler) |
| `/admin/commandes` | Gestion des commandes (statut livraison et paiement) |
| `/admin/services` | CRUD des prestations salon |
| `/admin/produits` | CRUD des produits cosmétiques |
| `/admin/formations` | Créer des sessions + voir la liste des inscrits |

---

## 🔐 Authentification Admin

- La connexion se fait via `POST /api/admin/login`
- Le token JWT est stocké **en mémoire** (React Context) — non persistant au rechargement de page
- Toutes les requêtes admin passent le header `Authorization: Bearer <token>`
- Un rechargement de page redirige automatiquement vers `/admin/login`

---

## 💳 Mobile Money

Si `MOBILE_MONEY_API_KEY` n'est pas configuré, le site fonctionne normalement :
- Les commandes sont créées avec statut `non_configure`
- Un message clair invite l'utilisateur à payer à la livraison ou à contacter la gérante via WhatsApp

---

## 🎨 Design & Identité visuelle

| Marque | Couleurs | Ambiance |
|--------|----------|----------|
| Empire Nita Beauty | Rose (`#E11D48`), Bordeaux (`#881337`), Doré (`#F59E0B`) | Chic, affirmée |
| Nita Cosmétics | Cuivré (`#B45309`), Rose doux (`#F472B6`) | Soin, douceur |

- Polices : **Playfair Display** (titres) + **Plus Jakarta Sans** (contenu)
- Glassmorphisme sur la Navbar
- Bouton WhatsApp flottant animé sur toutes les pages publiques

---

## 📞 Contact & Localisation

- 📍 Agoè Atigangomé, Lomé, Togo
- 📱 WhatsApp : [+228 71 12 72 71](https://wa.me/22871127271)
- 🎵 TikTok Salon : [@bunnygirl](https://www.tiktok.com/@bunnygirl)
- 🎵 TikTok Cosmétics : [Mlle NITA Best soap](https://www.tiktok.com/@mlle_nita_best_soap)
