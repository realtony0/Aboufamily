# 🔧 Configuration des Variables d'Environnement sur Vercel

## 📋 Variables Requises

Pour que le panel admin fonctionne correctement, tu dois configurer ces variables dans Vercel :

### 1. DATABASE_URL (OBLIGATOIRE)
```
postgresql://neondb_owner:npg_cPt3Ykrjuh0B@ep-snowy-glitter-agbn65r9-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. ADMIN_USERNAME
```
aboubcfm
```

### 3. ADMIN_PASSWORD
```
kinderelnutella1
```

## 🚀 Comment les Ajouter sur Vercel

1. **Va sur ton projet Vercel** : https://vercel.com/dashboard
2. **Sélectionne ton projet** "AbouFamily" ou "abou-business"
3. **Va dans Settings** (Paramètres)
4. **Clique sur "Environment Variables"** (Variables d'environnement)
5. **Ajoute chaque variable** :
   - Clique sur "Add New"
   - **Key** : `DATABASE_URL`
   - **Value** : (colle ta connection string Neon ci-dessus)
   - **Environments** : Sélectionne tout (Production, Preview, Development)
   - Clique sur "Save"
   
   Répète pour `ADMIN_USERNAME` et `ADMIN_PASSWORD`

6. **Redéploie ton site** :
   - Va dans l'onglet "Deployments"
   - Clique sur les 3 points (...) du dernier déploiement
   - Sélectionne "Redeploy"

## ✅ Vérification

Après avoir ajouté les variables et redéployé :
1. Va sur `/aboubcfm`
2. Connecte-toi avec `aboubcfm` / `kinderelnutella1`
3. Essaie d'importer les produits

Si ça ne fonctionne toujours pas :
- Vérifie que les variables sont bien dans tous les environnements (Production, Preview, Development)
- Vérifie que le schéma SQL a été exécuté dans Neon (table `products` existe)
- Vérifie la console du navigateur pour plus de détails

## 🔗 Liens Utiles

- **Neon Dashboard** : https://console.neon.tech
- **Vercel Dashboard** : https://vercel.com/dashboard
