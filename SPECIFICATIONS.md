# SPÉCIFICATIONS COMPLÈTES - SITE RÉNOVATION QUÉBÉCOIS

## 🏢 CONTEXTE ENTREPRISE
Tu développes pour un **entrepreneur en rénovation québécois** qui veut un site web pour **capturer des leads qualifiés** avec estimation automatique par IA. Le site doit permettre aux clients d'uploader des photos, recevoir une transformation IA réaliste, et obtenir une estimation précise basée sur l'analyse intelligente de l'image transformée.

## 🎯 OBJECTIF BUSINESS
- **Clients** uploadent photos de leur pièce + remplissent formulaire spécialisé
- **IA analyse et transforme** les photos selon le style choisi
- **Estimation automatique** basée sur l'analyse de l'image transformée
- **Entrepreneur reçoit lead qualifié** avec budget précis et besoins détaillés
- **Différenciation concurrentielle** par la technologie IA avancée

## 🚨 PROBLÈMES CRITIQUES ACTUELS À CORRIGER

### PROBLÈME 1 : WORKFLOW DE TRANSFORMATION COMPLÈTEMENT CASSÉ
- **Photos d'inspiration** = images Picsum aléatoires (montagnes/vélos pour "cuisine moderne")
- **Impossible de sélectionner** une inspiration cohérente avec le type de pièce
- **Google AI Studio** reçoit des prompts incohérents avec images non-pertinentes
- **Résultat** : Transformations n'importe quoi, workflow inutilisable

### PROBLÈME 2 : RÉFÉRENCES "BANANA AI" PARTOUT
- **Interface client** affiche "Banana AI", "nano-banana-fallback", émojis 🍌
- **Messages incohérents** et non-professionnels pour les clients
- **Logs de debug** avec références Banana dans le code de production
- **Branding cassé** qui nuit à la crédibilité

### PROBLÈME 3 : ESTIMATIONS COMPLÈTEMENT DÉBILES
- **300 000$ pour une salle de bain** (prix complètement fous)
- **Calculs basés sur fourchettes** trop élevées et déconnectées du marché québécois
- **Pas d'analyse intelligente** des matériaux réellement nécessaires
- **Clients fuient** à cause des prix irréalistes

### PROBLÈME 4 : APIS CASSÉES OU MANQUANTES
- **`/api/inspiration`** : Retourne Picsum aléatoire au lieu de vraies photos
- **`/api/google-ai-transform`** : Fallbacks avec images incohérentes
- **`/api/photo-analysis`** : Pas configuré pour analyser images transformées
- **`/api/cost-estimation`** : Prix fous non-basés sur analyse réelle
- **APIs client manquantes** : Google Places, validation, lead capture

## 🎯 SPÉCIFICATIONS EXACTES REQUISES

### WORKFLOW COMPLET ATTENDU
```
1. Client sélectionne TYPE DE PROJET (6 options avec formulaires spécialisés)
2. Formulaire spécialisé selon le type choisi
3. Upload photos de la pièce actuelle (obligatoire pour transformation)
4. Choix STYLE (moderne, scandinave, industriel, classique, minimaliste)
5. GALERIE INSPIRATION → 6 vraies photos du même type de pièce + style
6. SÉLECTION INSPIRATION → Bordure bleue + bouton "Continuer"
7. GOOGLE AI STUDIO transforme photo client selon inspiration sélectionnée
8. GPT VISION analyse l'image TRANSFORMÉE (pas l'originale)
9. CALCUL COÛTS intelligent basé sur matériaux détectés + temps + taux québécois
10. RÉSULTATS avec avant/après + estimation réaliste + capture de lead
```

### FORMULAIRE MULTI-ÉTAPES SPÉCIALISÉ

#### ÉTAPE 1 : SÉLECTION TYPE DE PROJET (6 OPTIONS)
```
🏠 Transformation de Pièces → Galerie inspiration + transformation IA
🚿 Plomberie → Diagnostic photo + estimation réparation
⚡ Électricité → Mise aux normes + sécurité
🌡️ Thermopompe → Évaluation énergétique + subventions
💨 Ventilation/CVC → Qualité air + efficacité énergétique
🔧 Maintenance Générale → Multi-spécialités + contrats
```

#### ÉTAPE 2 : INFORMATIONS CLIENT
```
- Prénom + Nom (obligatoire)
- Email (validation format, obligatoire)
- Téléphone québécois (validation 514/438/450/819/873, obligatoire)
- Adresse avec autocomplétion Google Places (obligatoire)
- Type propriété : Maison, Condo, Duplex, Triplex
```

#### ÉTAPE 3 : FORMULAIRE SPÉCIALISÉ PAR TYPE

**SI TRANSFORMATION DE PIÈCES :**
```
- Sélection pièce(s) : Cuisine, Salle-bain, Salon, Chambre, Bureau, Sous-sol
- Upload 3-4 photos actuelles (OBLIGATOIRE, validation côté client)
- Style désiré : Moderne, Scandinave, Industriel, Classique, Minimaliste
- Budget approximatif : <10k, 10-20k, 20-35k, 35k+
- Urgence : Urgent (1 mois), Normal (3 mois), Planifié (6+ mois)
```

**SI PLOMBERIE :**
```
- Type problème : Fuite, Installation, Rénovation, Urgence, Diagnostic
- Localisation : Cuisine, Salle de bain, Sous-sol, Extérieur, Toute la maison
- Photos du problème (optionnel, max 3)
- Description détaillée (texte libre, 500 caractères max)
- Urgence : 24h, 1 semaine, Planifié
```

**SI ÉLECTRICITÉ :**
```
- Type travaux : Mise aux normes, Ajout prises, Éclairage, Panneau électrique
- Nombre de pièces concernées (slider 1-10)
- Photos installation actuelle (optionnel, max 3)
- Problèmes actuels : Disjoncteurs, Prises défaillantes, Éclairage, Sécurité
- Urgence : Sécuritaire (urgent), Normal, Planifié
```

**SI THERMOPOMPE :**
```
- Type installation : Nouvelle installation, Remplacement, Maintenance
- Superficie à chauffer/climatiser (slider 500-5000 pi²)
- Système actuel : Électrique, Gaz, Mazout, Aucun
- Intérêt subventions gouvernementales : Oui/Non
- Photos maison extérieur (optionnel, max 2)
```

**SI VENTILATION/CVC :**
```
- Type système : VMC, Climatisation, Échangeur d'air, Purification, Autre
- Problèmes actuels : Humidité, Odeurs, Température, Qualité air, Bruit
- Superficie maison (slider 500-5000 pi²)
- Système existant : Oui/Non
- Photos des problèmes (optionnel, max 3)
```

**SI MAINTENANCE GÉNÉRALE :**
```
- Domaines concernés : Plomberie, Électricité, Chauffage, Général, Extérieur
- Type maintenance : Préventive, Corrective, Contrat annuel, Inspection
- Fréquence souhaitée : Mensuelle, Trimestrielle, Semestrielle, Annuelle
- Problèmes actuels (checkboxes multiples)
- Photos des problèmes (optionnel, max 4)
```

### SYSTÈME DE TRANSFORMATION INTELLIGENT

#### GALERIE D'INSPIRATION FONCTIONNELLE
```javascript
// URLs Unsplash SPÉCIFIQUES par type de pièce et style - JAMAIS de Picsum
const inspirationUrls = {
  'cuisine': {
    'moderne': [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&brightness=10',
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&contrast=10',
      'https://images.unsplash.com/photo-1556909085-f3d0c4d5f5d7?w=400&h=300&fit=crop&sat=10'
    ],
    'scandinave': [
      'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&h=300&fit=crop&sat=-20',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&sat=-30',
      // ... 4 autres vraies cuisines scandinaves
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

#### PROCESSUS DE TRANSFORMATION
```
1. Client upload photo de sa cuisine actuelle
2. Client choisit style "moderne"
3. API /api/inspiration retourne 6 vraies cuisines modernes Unsplash
4. Client clique sur celle avec îlot blanc + comptoir noir
5. Feedback visuel : bordure bleue + bouton "Transformer ma pièce"
6. Google AI Studio reçoit prompt intelligent :
   "Transforme cette cuisine en style moderne en t'inspirant de cette image de référence. 
   Garde les dimensions et structure générale, mais applique les éléments de design de l'inspiration : 
   îlot central blanc, comptoir noir, armoires modernes, éclairage LED."
7. Résultat : Image transformée réaliste et cohérente
```

### SYSTÈME DE CALCUL DE PRIX INTELLIGENT

#### WORKFLOW ANALYSE ET COÛTS
```
1. Google AI Studio génère image transformée
2. API /api/photo-analysis analyse l'image TRANSFORMÉE avec GPT Vision
3. Prompt GPT Vision :
   "Analyse cette image de [pièce] transformée et détecte précisément :
   - Matériaux utilisés (armoires, comptoir, carrelage, peinture, etc.)
   - Dimensions approximatives de chaque élément
   - Éléments ajoutés/modifiés par rapport à une pièce standard
   - Complexité des travaux (low/medium/high)
   - Temps estimé par corps de métier (menuiserie, plomberie, électricité)
   - Retourne JSON structuré avec tous les détails"

4. GPT Vision retourne :
   {
     "materials": ["armoires blanches", "comptoir quartz noir", "dosseret subway", "spots LED"],
     "dimensions": "îlot 3m x 1.5m, comptoir 4m linéaire",
     "complexity": "medium",
     "estimatedWork": {
       "menuiserie": 24,  // heures
       "electricite": 8,  // heures
       "plomberie": 4     // heures
     },
     "materialsCost": {
       "armoires": 3500,
       "comptoir": 2800,
       "electricite": 1200,
       "plomberie": 600
     }
   }

5. Fonction calculateCostsFromAnalysis() calcule :
   - Matériaux : Basé sur détection GPT Vision
   - Main d'œuvre : Heures × taux horaires québécois
   - Taxes : 14.975% (TPS + TVQ)
   - Contingence : 10%
```

#### ESTIMATIONS RÉALISTES QUÉBÉCOISES 2024
```
PRIX PAR TYPE DE PIÈCE (fourchettes réalistes) :
- Cuisine : 8 000$ - 18 000$ (rénovation partielle à complète)
- Salle de bain : 5 000$ - 12 000$ (standard québécoise)
- Salon : 4 000$ - 10 000$ (peinture, plancher, éclairage)
- Chambre : 3 000$ - 8 000$ (peinture + plancher + électricité)
- Bureau : 2 500$ - 6 000$ (espace plus petit)
- Sous-sol : 6 000$ - 15 000$ (finition de sous-sol)

TAUX HORAIRES QUÉBÉCOIS 2024 :
- Électricien : 85$/heure
- Plombier : 90$/heure
- Menuisier : 65$/heure
- Carreleur : 70$/heure
- Peintre : 45$/heure
- Général : 55$/heure

PRIX MATÉRIAUX MOYENS QUÉBEC :
- Armoires cuisine : 150$/pied linéaire
- Comptoir quartz : 80$/pi²
- Carrelage céramique : 8$/pi²
- Peinture premium : 50$/gallon
- Plancher stratifié : 4$/pi²
- Plancher bois franc : 12$/pi²

TAXES ET FRAIS :
- TPS + TVQ : 14.975%
- Contingence recommandée : 10%
- Transport/déplacement : 50-100$ selon distance
```

### APIS À IMPLÉMENTER/CORRIGER

#### API INSPIRATION - /api/inspiration
```typescript
// CORRIGER COMPLÈTEMENT - Plus jamais de Picsum
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomType = searchParams.get('roomType') || 'cuisine';
  const style = searchParams.get('style') || 'moderne';
  const count = parseInt(searchParams.get('count') || '6');

  // Retourner URLs Unsplash spécifiques selon roomType + style
  // Structure JSON cohérente avec métadonnées
  // JAMAIS de Picsum aléatoire
}
```

#### API TRANSFORMATION - /api/google-ai-transform
```typescript
// Prompt intelligent pour Google AI Studio
export async function POST(request: NextRequest) {
  const { originalPhoto, inspirationPhoto, roomType, style } = await request.json();
  
  const prompt = `Transforme cette ${roomType} dans le style ${style} en t'inspirant de cette image de référence. 
  Garde les dimensions et la structure générale de la pièce originale, 
  mais applique les éléments de design, couleurs et matériaux de l'inspiration. 
  Le résultat doit être réaliste et réalisable avec un budget raisonnable.`;
  
  // Appel Google AI Studio avec prompt structuré
  // Fallbacks avec vraies images, pas Picsum
  // Gestion d'erreurs robuste
}
```

#### API ANALYSE PHOTO - /api/photo-analysis
```typescript
// Analyser image TRANSFORMÉE avec GPT Vision
export async function POST(request: NextRequest) {
  const { transformedImageUrl, roomType, style } = await request.json();
  
  const prompt = `Analyse cette image de ${roomType} transformée en style ${style} et détecte :
  - Matériaux utilisés précisément
  - Dimensions approximatives des éléments
  - Complexité des travaux nécessaires
  - Temps estimé par corps de métier
  Retourne un JSON structuré avec tous les détails pour calcul de coûts.`;
  
  // Appel GPT Vision avec image transformée
  // Parsing intelligent de la réponse
  // Structure JSON pour calcul coûts
}
```

#### API CALCUL COÛTS - /api/cost-estimation
```typescript
// Calcul basé sur analyse GPT Vision réelle
export async function POST(request: NextRequest) {
  const { analysis, roomType, projectDetails } = await request.json();
  
  // Extraire matériaux détectés par GPT Vision
  // Calculer prix matériaux selon détection réelle
  // Calculer heures main d'œuvre selon complexité
  // Appliquer taux horaires québécois
  // Ajouter taxes + contingence
  // Retourner estimation détaillée et réaliste
}
```

#### APIS CLIENT À IMPLÉMENTER

**API Google Places - /api/google-places**
```typescript
// Autocomplétion adresses québécoises
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input');
  
  // Appel Google Places API
  // Filtrer résultats Québec seulement
  // Validation code postal québécois (H1A 1A1)
  // Retourner suggestions formatées
}
```

**API Validation Client - /api/client-validation**
```typescript
// Validation données client en temps réel
export async function POST(request: NextRequest) {
  const clientData = await request.json();
  
  // Valider email format
  // Valider téléphone québécois (514/438/450/819/873/etc.)
  // Valider code postal québécois
  // Vérifier champs obligatoires
  // Retourner erreurs spécifiques
}
```

**API Capture Lead - /api/lead-capture**
```typescript
// Envoi lead complet entrepreneur + client
export async function POST(request: NextRequest) {
  const { clientData, projectData, estimation } = await request.json();
  
  // Combiner toutes les données
  // Email entrepreneur avec lead structuré
  // Webhook Make.com pour CRM
  // Email confirmation client
  // Sauvegarde pour suivi
}
```

### BRANDING ET INTERFACE COHÉRENTS

#### TERMINOLOGIE CORRECTE PARTOUT
```
✅ UTILISER :
- "Google AI Studio" ou "IA Google"
- "Intelligence Artificielle"
- "Estimation IA"
- "Analyse intelligente"
- Émojis : 🤖 🎨 🏠 ⚡ 🔧

❌ JAMAIS UTILISER :
- "Banana AI" ou "Nano Banana"
- "nano-banana-fallback"
- Émojis 🍌
- Références à d'autres services IA
```

#### MESSAGES CLIENT PROFESSIONNELS
```
Interface client :
- "Analyse IA de votre projet"
- "Transformation par Google AI Studio"
- "Estimation basée sur l'analyse intelligente"
- "Technologie : Google AI Studio v2.1"

Logs développeur :
- "🤖 Transformation IA demandée"
- "🎨 Analyse Google AI Studio terminée"
- "💰 Calcul coûts basé sur analyse IA"
```

### VARIABLES D'ENVIRONNEMENT REQUISES
```env
# Google AI Studio pour transformation d'images
GOOGLE_AI_STUDIO_API_KEY=your_google_ai_key_here

# OpenAI GPT Vision pour analyse d'images
OPENAI_API_KEY=your_openai_api_key_here

# Google Places pour autocomplétion adresses
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_key_here

# Pexels pour photos d'inspiration (backup)
PEXELS_API_KEY=your_pexels_api_key_here

# Make.com pour capture de leads
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url
MAKE_API_KEY=your_make_api_key_here

# SMTP pour envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# URL de base pour les APIs internes
NEXTAUTH_URL=https://your-domain.vercel.app
```

### STRUCTURE TECHNIQUE
```
Stack : Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
Déploiement : Vercel
Base de code : Corriger le code existant, ne pas repartir de zéro

Architecture APIs :
/api/inspiration → Photos par type + style
/api/google-ai-transform → Transformation intelligente
/api/photo-analysis → Analyse GPT Vision
/api/cost-estimation → Calcul coûts réalistes
/api/google-places → Autocomplétion adresses
/api/client-validation → Validation données
/api/lead-capture → Envoi leads entrepreneur

Composants React :
- Formulaire multi-étapes avec validation
- Galerie inspiration avec sélection visuelle
- Affichage avant/après transformation
- Estimation détaillée avec breakdown
- Interface professionnelle et moderne
```

### VALIDATION ET TESTS REQUIS
```
Tests fonctionnels obligatoires :
1. Sélection type projet → Formulaire spécialisé s'affiche
2. Upload photos → Validation côté client
3. Galerie inspiration → Vraies photos par type + style
4. Sélection inspiration → Feedback visuel + bouton
5. Transformation → Image cohérente générée
6. Analyse IA → Détection matériaux correcte
7. Calcul coûts → Prix réalistes québécois
8. Capture lead → Email entrepreneur + confirmation client

Critères de succès :
- ZÉRO image Picsum aléatoire
- ZÉRO référence "Banana AI"
- Prix toujours < 50k$ pour projets résidentiels
- Workflow complet fonctionnel de bout en bout
- Interface professionnelle prête pour clients réels
```

### LIVRABLES FINAUX ATTENDUS
```
1. Site web complet fonctionnel
2. 6 formulaires spécialisés opérationnels
3. Galerie inspiration avec vraies photos
4. Système transformation IA intelligent
5. Calcul coûts basé sur analyse réelle
6. Capture leads automatique
7. Interface professionnelle cohérente
8. Documentation technique complète
9. Variables d'environnement configurées
10. Tests validés et fonctionnels
```

**🎯 OBJECTIF : Site web professionnel prêt à capturer de vrais leads clients avec estimations IA précises et workflow transformation intelligent complet.**
