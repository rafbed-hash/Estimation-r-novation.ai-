# PROMPT COMPLET POUR CLAUDE CODING

Salut Claude Coding ! 👋

Je reprends un projet Next.js de site de rénovation québécois qui a de nombreux problèmes critiques. J'ai besoin que tu le corriges complètement pour en faire un site professionnel fonctionnel.

## 🎯 CONTEXTE
- **Projet** : Site web pour entrepreneur en rénovation québécois
- **Objectif** : Capturer des leads qualifiés avec estimation IA automatique
- **Repo** : https://github.com/rafbed-hash/Estimation-r-novation.ai-
- **Branche de travail** : `claude-coding-rebuild` (déjà créée pour toi)
- **Stack** : Next.js 14 + TypeScript + Tailwind + shadcn/ui

## 🚨 PROBLÈMES CRITIQUES À CORRIGER

### 1. WORKFLOW DE TRANSFORMATION CASSÉ
- Photos d'inspiration = Picsum aléatoire (montagnes pour "cuisine")
- Impossible de sélectionner une inspiration cohérente
- Google AI Studio reçoit des prompts incohérents
- Résultat : Transformations inutilisables

### 2. BRANDING CASSÉ - "BANANA AI" PARTOUT
- Interface affiche "Banana AI", "nano-banana-fallback", émojis 🍌
- Messages non-professionnels pour les clients
- Doit être remplacé par "Google AI Studio" partout

### 3. ESTIMATIONS DÉBILES
- 300 000$ pour une salle de bain (complètement fou)
- Prix déconnectés du marché québécois
- Pas d'analyse intelligente des matériaux

### 4. APIS CASSÉES/MANQUANTES
- `/api/inspiration` : Retourne Picsum au lieu de vraies photos
- `/api/photo-analysis` : Pas configuré pour analyser images transformées
- APIs client manquantes : Google Places, validation, capture leads

## 🎯 CE QUE JE VEUX (SPÉCIFICATIONS COMPLÈTES)

### WORKFLOW ATTENDU
```
1. Client sélectionne TYPE DE PROJET (6 options avec formulaires spécialisés)
2. Formulaire spécialisé selon le type choisi
3. Upload photos pièce actuelle (obligatoire pour transformation)
4. Choix STYLE (moderne, scandinave, industriel, classique, minimaliste)
5. GALERIE INSPIRATION → 6 vraies photos du même type de pièce + style
6. SÉLECTION INSPIRATION → Bordure bleue + bouton "Continuer"
7. GOOGLE AI STUDIO transforme photo client selon inspiration sélectionnée
8. GPT VISION analyse l'image TRANSFORMÉE (pas l'originale)
9. CALCUL COÛTS intelligent basé sur matériaux détectés + taux québécois
10. RÉSULTATS avec avant/après + estimation réaliste + capture lead
```

### FORMULAIRES SPÉCIALISÉS (6 TYPES)
```
🏠 Transformation de Pièces → Galerie inspiration + transformation IA
🚿 Plomberie → Diagnostic photo + estimation réparation
⚡ Électricité → Mise aux normes + sécurité
🌡️ Thermopompe → Évaluation énergétique + subventions
💨 Ventilation/CVC → Qualité air + efficacité énergétique
🔧 Maintenance Générale → Multi-spécialités + contrats
```

### PHOTOS D'INSPIRATION FIXES (JAMAIS PICSUM)
```javascript
const inspirationUrls = {
  'cuisine': {
    'moderne': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      // ... 3 autres vraies cuisines modernes
    ]
  },
  'salle-bain': {
    'moderne': [
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
      // ... 3 autres vraies salles de bain modernes
    ]
  }
  // Continuer pour tous types de pièces et styles
};
```

### SYSTÈME DE PRIX INTELLIGENT
```
WORKFLOW PRIX :
1. Google AI Studio transforme la photo
2. GPT Vision analyse l'image TRANSFORMÉE 
3. Détecte matériaux + dimensions + complexité
4. Calcul automatique :
   - Matériaux = Prix réels selon détection
   - Main d'œuvre = Heures × Taux québécois
   - Taxes = 14.975% (TPS+TVQ)
   - Contingence = 10%

PRIX RÉALISTES QUÉBÉCOIS :
- Cuisine : 8 000$ - 18 000$
- Salle de bain : 5 000$ - 12 000$
- Salon : 4 000$ - 10 000$
- Chambre : 3 000$ - 8 000$

TAUX HORAIRES :
- Électricien : 85$/h
- Plombier : 90$/h
- Menuisier : 65$/h
- Peintre : 45$/h
```

### APIS À IMPLÉMENTER/CORRIGER

#### `/api/inspiration` - PHOTOS PAR TYPE+STYLE
```typescript
// Retourner URLs Unsplash spécifiques selon roomType + style
// JAMAIS de Picsum aléatoire
// Structure JSON cohérente
```

#### `/api/google-ai-transform` - TRANSFORMATION INTELLIGENTE
```typescript
// Prompt intelligent pour Google AI Studio
// Fallbacks avec vraies images
// Gestion d'erreurs robuste
```

#### `/api/photo-analysis` - ANALYSE GPT VISION
```typescript
// Analyser image TRANSFORMÉE avec GPT Vision
// Détecter matériaux, dimensions, complexité
// Retourner JSON structuré pour calcul coûts
```

#### `/api/cost-estimation` - CALCUL RÉALISTE
```typescript
// Calcul basé sur analyse GPT Vision réelle
// Prix matériaux selon détection
// Taux horaires québécois
// Taxes + contingence
```

#### APIS CLIENT À CRÉER
```typescript
// /api/google-places - Autocomplétion adresses québécoises
// /api/client-validation - Validation email/téléphone/code postal
// /api/lead-capture - Email entrepreneur + webhook Make.com
```

### BRANDING COHÉRENT
```
✅ UTILISER PARTOUT :
- "Google AI Studio" ou "IA Google"
- "Estimation IA"
- Émojis : 🤖 🎨 🏠 ⚡ 🔧

❌ JAMAIS UTILISER :
- "Banana AI" ou "Nano Banana"
- "nano-banana-fallback"
- Émojis 🍌
```

### VARIABLES D'ENVIRONNEMENT
```env
GOOGLE_AI_STUDIO_API_KEY=your_key
OPENAI_API_KEY=your_key
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_key
PEXELS_API_KEY=your_key
NEXT_PUBLIC_MAKE_WEBHOOK_URL=your_webhook
```

## 🎯 CRITÈRES DE SUCCÈS
- ✅ ZÉRO image Picsum aléatoire
- ✅ ZÉRO référence "Banana AI"
- ✅ Prix réalistes québécois (< 50k$)
- ✅ Workflow complet fonctionnel
- ✅ Interface professionnelle

## 📋 PLAN DE TRAVAIL RECOMMANDÉ
1. **Corriger API inspiration** → Vraies photos par type+style
2. **Nettoyer branding** → Remplacer toutes références Banana
3. **Fixer estimations** → Prix réalistes québécois
4. **Implémenter workflow transformation** → Galerie → Sélection → Transformation → Analyse → Coûts
5. **Créer APIs client** → Google Places, validation, capture leads
6. **Tester workflow complet** → De bout en bout
7. **Interface professionnelle** → Cohérente et moderne

## 🚀 INSTRUCTIONS TECHNIQUES
- **Développe sur branche** : `claude-coding-rebuild`
- **Teste localement** : `npm run dev`
- **Commits réguliers** avec messages clairs
- **Montre le résultat** fonctionnel avant merge
- **Base de code** : Corriger l'existant, ne pas repartir de zéro

## 📄 DOCUMENTATION COMPLÈTE
Consulte le fichier `SPECIFICATIONS.md` pour tous les détails techniques complets.

**🎯 OBJECTIF FINAL : Site web professionnel prêt à capturer de vrais leads clients avec estimations IA précises et workflow transformation intelligent complet.**

Peux-tu prendre en charge ce projet et le corriger de A à Z ? 🚀
