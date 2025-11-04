# INSTRUCTIONS POUR CLAUDE CODING - SITE RÉNOVATION QUÉBÉCOIS

## 🎯 CONTEXTE
Tu reprends un projet Next.js de site de rénovation québécois qui a de nombreux problèmes.
L'objectif est de créer un site professionnel pour capturer des leads qualifiés avec estimation IA.

## 📋 PROBLÈMES ACTUELS À CORRIGER
1. **Photos d'inspiration aléatoires** - API retourne Picsum au lieu de vraies photos
2. **Références "Banana AI" partout** - Interface non-professionnelle  
3. **Estimations débiles** - 300k$ pour une salle de bain
4. **Workflow transformation cassé** - Impossible de sélectionner inspiration
5. **APIs manquantes** - Google Places, validation client, capture leads

## 🚀 SETUP TECHNIQUE
- **Repo** : https://github.com/rafbed-hash/Estimation-r-novation.ai-
- **Branche de travail** : `claude-coding-rebuild` (créée pour toi)
- **Déploiement** : Vercel automatique depuis `main`
- **Stack** : Next.js 14 + TypeScript + Tailwind + shadcn/ui

## 📝 WORKFLOW RECOMMANDÉ
1. Développe sur la branche `claude-coding-rebuild`
2. Teste localement avec `npm run dev`
3. Commits réguliers avec messages clairs
4. Montre le résultat fonctionnel avant merge

## 🔑 VARIABLES D'ENVIRONNEMENT NÉCESSAIRES
```env
GOOGLE_AI_STUDIO_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here  
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
PEXELS_API_KEY=your_key_here
NEXT_PUBLIC_MAKE_WEBHOOK_URL=your_webhook_here
```

## 📄 SPÉCIFICATIONS COMPLÈTES
Voir le prompt détaillé dans le fichier SPECIFICATIONS.md que je vais créer.

## ✅ CRITÈRES DE SUCCÈS
- ZÉRO image Picsum aléatoire
- ZÉRO référence "Banana AI"  
- Prix réalistes québécois (< 50k$)
- Workflow complet fonctionnel
- Interface professionnelle

Bonne chance ! 🚀
