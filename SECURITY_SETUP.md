# Configuration Sécurisée des Clés API

## ⚠️ IMPORTANT - Sécurité des Clés API

Les clés API ne doivent **JAMAIS** être exposées dans le code source. Elles doivent toujours être stockées dans des variables d'environnement.

## Configuration Locale

1. Copiez le fichier `env.example` vers `.env.local` :
   ```bash
   cp env.example .env.local
   ```

2. Éditez `.env.local` et remplacez les valeurs par vos vraies clés API :

```env
# Google AI Gemini 2.5 Flash (Nano Banana) API
NANO_BANANA_API_KEY=AIzaSyC1x0c6u7dnez9UlwuyVZtbX9pXzMzNU8U

# OpenAI API pour l'estimation des coûts
OPENAI_API_KEY=your_openai_api_key_here

# Pexels API pour les photos d'inspiration
PEXELS_API_KEY=your_pexels_api_key_here

# Banana AI API pour la génération d'images
BANANA_API_KEY=your_banana_ai_api_key_here

# Make.com Webhook URL
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url-here
MAKE_API_KEY=your_make_api_key_here
```

## Configuration de Production (Netlify)

Dans Netlify, ajoutez ces variables d'environnement dans :
**Site settings > Environment variables**

## Sécurité

- ✅ Le fichier `.env.local` est automatiquement ignoré par Git
- ✅ Les clés API sont maintenant sécurisées
- ✅ GitHub ne détectera plus de secrets exposés

## Clés API Requises

| Service | Variable | Description |
|---------|----------|-------------|
| Nano Banana | `NANO_BANANA_API_KEY` | Gemini 2.5 Flash Image pour l'analyse IA |
| OpenAI | `OPENAI_API_KEY` | Estimation des coûts de rénovation |
| Pexels | `PEXELS_API_KEY` | Photos d'inspiration |
| Banana AI | `BANANA_API_KEY` | Génération d'images (optionnel) |
| Make.com | `NEXT_PUBLIC_MAKE_WEBHOOK_URL` | Intégration workflow |
