# Application de Rénovation avec IA - RénoLuxe

Cette application permet aux clients de visualiser leur projet de rénovation grâce à l'intelligence artificielle et d'obtenir une estimation automatique des coûts.

## 🚀 Fonctionnalités

### Formulaire Multi-étapes
1. **Informations Client** - Nom, email, téléphone, adresse
2. **Informations Maison** - Type, année, superficie, nombre de pièces
3. **Sélection des Pièces** - Choix des espaces à rénover
4. **Upload de Photos** - Minimum 3 photos de la pièce
5. **Choix du Style** - Styles prédéfinis ou personnalisé
6. **Résultats IA** - Visualisations et estimation des coûts

### Intégrations IA
- **Google AI Gemini 2.0** - Transformation visuelle des photos
- **OpenAI GPT-4** - Estimation intelligente des coûts
- **Make.com** - Automatisation et envoi des leads

## 🛠️ Configuration

### 1. Variables d'environnement

Copiez le fichier `env.example` vers `.env.local` et remplissez les valeurs :

```bash
cp env.example .env.local
```

```env
# Google AI Gemini 2.0 API
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# OpenAI API pour l'estimation des coûts
OPENAI_API_KEY=your_openai_api_key_here

# Make.com Webhook URL
NEXT_PUBLIC_MAKE_WEBHOOK_URL=https://hook.make.com/your-webhook-url-here

# Make.com API Key (optionnel)
MAKE_API_KEY=your_make_api_key_here
```

### 2. Obtenir les clés API

#### Google AI Gemini 2.0
1. Allez sur [Google AI Studio](https://aistudio.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Gemini 2.0
4. Créez une clé API et copiez-la dans `GOOGLE_AI_API_KEY`

#### OpenAI
1. Allez sur [OpenAI Platform](https://platform.openai.com/)
2. Créez un compte ou connectez-vous
3. Allez dans API Keys et créez une nouvelle clé
4. Copiez la clé dans `OPENAI_API_KEY`

#### Make.com
1. Créez un compte sur [Make.com](https://make.com/)
2. Créez un nouveau scénario
3. Ajoutez un trigger "Webhook"
4. Copiez l'URL du webhook dans `NEXT_PUBLIC_MAKE_WEBHOOK_URL`

### 3. Installation et démarrage

```bash
# Installer les dépendances
pnpm install

# Démarrer en mode développement
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du projet

```
app/
├── renovation/
│   └── page.tsx                    # Page principale de l'application
├── api/
│   └── renovation/
│       └── process/
│           └── route.ts            # API pour traiter les demandes
components/
└── renovation/
    ├── client-info-form.tsx        # Formulaire informations client
    ├── house-info-form.tsx         # Formulaire informations maison
    ├── room-selection-form.tsx     # Sélection des pièces
    ├── photo-upload-form.tsx       # Upload de photos
    ├── style-selection-form.tsx    # Choix du style
    └── results-display.tsx         # Affichage des résultats
lib/
└── services/
    ├── google-ai.ts                # Service Google AI Gemini
    ├── openai-cost-estimation.ts   # Service OpenAI
    └── make-webhook.ts             # Service Make.com
```

## 🔧 Test des services

Pour tester la connectivité des services, visitez :
```
GET http://localhost:3000/api/renovation/process
```

Cette route retourne le statut de chaque service (Google AI, OpenAI, Make.com).

## 🎨 Personnalisation

### Styles de rénovation
Les styles sont définis dans `style-selection-form.tsx`. Pour ajouter de nouveaux styles :

1. Ajoutez le style dans la fonction `getStylesForRoom()`
2. Ajoutez la description dans `getStyleDescription()` (google-ai.ts)
3. Ajoutez le multiplicateur de coût dans `getStyleMultiplier()` (openai-cost-estimation.ts)

### Types de pièces
Les pièces sont définies dans `room-selection-form.tsx`. Modifiez le tableau `rooms` pour ajouter/supprimer des options.

## 📊 Make.com - Configuration du scénario

### Données reçues
Le webhook Make.com reçoit ces données :

```json
{
  "client": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "postalCode": "string"
  },
  "house": {
    "propertyType": "string",
    "constructionYear": "string",
    "surface": "string",
    "rooms": "string"
  },
  "project": {
    "selectedRooms": ["string"],
    "selectedStyle": "string",
    "photosCount": "number"
  },
  "aiResults": {
    "confidence": "number",
    "processingTime": "number"
  },
  "costEstimation": {
    "totalCost": {
      "min": "number",
      "max": "number",
      "average": "number"
    },
    "timeline": "string"
  },
  "enriched": {
    "priorityScore": "number",
    "marketSegment": "string",
    "tags": ["string"]
  }
}
```

### Actions recommandées
1. **Email au client** - Confirmation de réception
2. **CRM** - Créer un lead avec toutes les informations
3. **Notification équipe** - Slack/Teams avec résumé du projet
4. **Calendrier** - Programmer un rappel pour suivi

## 🚨 Dépannage

### Erreur "Configuration API manquante"
- Vérifiez que toutes les variables d'environnement sont définies dans `.env.local`
- Redémarrez le serveur après modification des variables

### Erreur Google AI
- Vérifiez que la clé API est valide
- Assurez-vous que l'API Gemini 2.0 est activée
- Vérifiez les quotas et limites de votre compte

### Erreur OpenAI
- Vérifiez que vous avez des crédits sur votre compte OpenAI
- Assurez-vous que la clé API a les bonnes permissions

### Erreur Make.com
- Vérifiez que l'URL du webhook est correcte
- Testez le webhook directement depuis Make.com

## 📈 Monitoring et Analytics

L'application envoie automatiquement des métriques enrichies à Make.com :
- Score de priorité du lead
- Segment de marché (Budget/Standard/Premium/Luxe)
- Tags pour segmentation
- Données géographiques

Utilisez ces données pour optimiser vos campagnes et le suivi commercial.

## 🔒 Sécurité

- Les clés API sont stockées côté serveur uniquement
- Les photos sont traitées temporairement et non stockées
- Validation des données à chaque étape
- Gestion d'erreur robuste avec fallbacks

## 📞 Support

Pour toute question technique :
1. Vérifiez les logs de la console navigateur
2. Consultez les logs du serveur Next.js
3. Testez la connectivité des services via l'API de status

---

**Version :** 1.0.0  
**Dernière mise à jour :** Septembre 2024
