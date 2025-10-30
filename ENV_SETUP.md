# Configuration des Variables d'Environnement

## Pour Vercel

Ajoutez ces variables d'environnement dans votre dashboard Vercel :

### Variables requises :

```bash
# Google AI Studio (Gemini) - OBLIGATOIRE pour l'analyse IA
GOOGLE_AI_API_KEY=votre_cle_google_ai_studio

# Google Places API - pour l'autocomplétion d'adresse
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=votre_cle_google_places

# Pexels API - pour les photos d'inspiration
PEXELS_API_KEY=votre_cle_pexels

# Make.com - pour l'envoi des leads
NEXT_PUBLIC_MAKE_WEBHOOK_URL=votre_webhook_make
MAKE_API_KEY=votre_cle_make

# OpenAI - optionnel (fallback pour l'estimation des coûts)
OPENAI_API_KEY=votre_cle_openai
```

## Comment obtenir les clés API :

### 1. Google AI Studio (OBLIGATOIRE)
1. Allez sur https://aistudio.google.com/
2. Créez un compte Google
3. Générez une clé API
4. Activez l'accès à Gemini 2.5 Flash

### 2. Google Places API (Recommandé pour UX)
1. Allez sur https://console.cloud.google.com/
2. Créez un projet ou sélectionnez un existant
3. Activez l'API "Places API"
4. Générez une clé API
5. Restreignez la clé aux domaines autorisés

### 3. Pexels API (Recommandé)
1. Allez sur https://www.pexels.com/api/
2. Créez un compte gratuit
3. Générez une clé API

### 3. Make.com (Pour les leads)
1. Créez un compte sur https://make.com
2. Créez un scénario avec webhook
3. Copiez l'URL du webhook

## Configuration dans Vercel :

1. Allez dans votre projet Vercel
2. Settings > Environment Variables
3. Ajoutez chaque variable avec sa valeur
4. Redéployez votre application

## Mode Fallback :

L'application fonctionne même sans clés API avec des résultats simulés, mais pour une expérience complète, configurez au minimum `GOOGLE_AI_API_KEY`.
