# 🎛️ Configuration du Panel Admin - Abou Family

## 📋 Prérequis

1. **Compte Neon** : Créez un compte sur [neon.tech](https://neon.tech)
2. **Base de données** : Créez une nouvelle base de données PostgreSQL sur Neon

## 🔧 Étapes de Configuration

### 1. Créer la Base de Données sur Neon

1. Connectez-vous à [console.neon.tech](https://console.neon.tech)
2. Créez un nouveau projet
3. Copiez votre **Connection String** (il ressemble à : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### 2. Configurer les Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Neon Database (remplacez par votre Connection String)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Admin Credentials (changez ces valeurs !)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=VotreMotDePasseSecurise123
```

### 3. Initialiser la Base de Données

Exécutez le fichier `schema.sql` dans votre console Neon SQL Editor ou via psql :

```bash
psql "votre-connection-string" < schema.sql
```

Ou copiez-collez le contenu de `schema.sql` dans l'éditeur SQL de Neon.

### 4. Synchroniser les Produits Existants

Pour importer vos produits actuels depuis `data/products.ts` dans la base de données, vous pouvez :

1. Utiliser l'interface admin (une fois connecté)
2. Ou créer un script de migration (optionnel)

## 🚀 Utilisation

1. **Accéder au Panel Admin** : Allez sur `http://localhost:3000/admin`
2. **Se connecter** : Utilisez les identifiants définis dans `.env.local`
3. **Gérer les produits** : Ajoutez, modifiez ou supprimez des produits directement depuis l'interface

## 🔐 Sécurité

⚠️ **Important** : 
- Changez les identifiants admin par défaut
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- En production, utilisez des variables d'environnement sécurisées

## 📊 Fonctionnalités

- ✅ Authentification sécurisée
- ✅ CRUD complet sur les produits
- ✅ Statistiques en temps réel
- ✅ Gestion du stock
- ✅ Marquer les produits comme "vedettes"

## 🆘 Dépannage

**Erreur "DATABASE_URL is not set"** :
- Vérifiez que `.env.local` existe et contient `DATABASE_URL`

**Erreur de connexion à la base** :
- Vérifiez que votre Connection String est correcte
- Assurez-vous que le schéma SQL a été exécuté

**Produits non affichés** :
- Les produits doivent être importés depuis `data/products.ts` ou ajoutés manuellement via l'admin
