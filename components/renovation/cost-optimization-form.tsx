'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { 
  Calculator, 
  TrendingDown, 
  Lightbulb, 
  DollarSign, 
  Clock, 
  Wrench,
  Palette,
  ShoppingCart,
  AlertTriangle
} from "lucide-react"

interface CostOptimizationFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function CostOptimizationForm({ data, onUpdate, onNext }: CostOptimizationFormProps) {
  const [budget, setBudget] = useState(data.budget || [15000])
  const [selectedOptimizations, setSelectedOptimizations] = useState(data.optimizations || [])
  const [priorityLevel, setPriorityLevel] = useState(data.priorityLevel || 'économique')
  const [budgetPriorities, setBudgetPriorities] = useState(data.budgetPriorities || {})
  const [selectedBudgetProfile, setSelectedBudgetProfile] = useState(data.budgetProfile || 'equilibre')

  // Options d'optimisation des coûts
  const optimizationOptions = [
    {
      id: 'diy',
      title: 'Travaux DIY (Faites-le vous-même)',
      description: 'Réalisez certains travaux vous-même pour économiser sur la main-d\'œuvre',
      savings: '30-50%',
      difficulty: 'Moyen',
      timeImpact: '+2-4 semaines',
      icon: Wrench,
      category: 'main-oeuvre'
    },
    {
      id: 'materials-alternatives',
      title: 'Matériaux alternatifs',
      description: 'Optez pour des matériaux similaires mais moins coûteux',
      savings: '20-40%',
      difficulty: 'Facile',
      timeImpact: 'Aucun',
      icon: ShoppingCart,
      category: 'materiaux'
    },
    {
      id: 'phased-renovation',
      title: 'Rénovation par phases',
      description: 'Étalez les travaux sur plusieurs mois/années',
      savings: '15-25%',
      difficulty: 'Facile',
      timeImpact: '+6-12 mois',
      icon: Clock,
      category: 'planification'
    },
    {
      id: 'seasonal-timing',
      title: 'Timing saisonnier',
      description: 'Planifiez les travaux en basse saison (automne/hiver)',
      savings: '10-20%',
      difficulty: 'Facile',
      timeImpact: 'Variable',
      icon: TrendingDown,
      category: 'planification'
    },
    {
      id: 'bulk-purchase',
      title: 'Achats groupés',
      description: 'Négociez des prix de gros avec d\'autres propriétaires',
      savings: '15-30%',
      difficulty: 'Moyen',
      timeImpact: '+2-6 semaines',
      icon: DollarSign,
      category: 'materiaux'
    },
    {
      id: 'refurbished-appliances',
      title: 'Électroménager reconditionné',
      description: 'Choisissez des appareils reconditionnés ou d\'exposition',
      savings: '25-45%',
      difficulty: 'Facile',
      timeImpact: 'Aucun',
      icon: Lightbulb,
      category: 'equipements'
    }
  ]

  // Alternatives économiques par style
  const economicAlternatives: Record<string, { expensive: string; alternative: string; savings: string }> = {
    'moderne': {
      expensive: 'Plan de travail en quartz',
      alternative: 'Plan de travail en stratifié effet quartz',
      savings: '60-70%'
    },
    'scandinave': {
      expensive: 'Parquet en chêne massif',
      alternative: 'Sol stratifié effet bois',
      savings: '50-60%'
    },
    'industriel': {
      expensive: 'Briques apparentes authentiques',
      alternative: 'Papier peint effet brique',
      savings: '80-90%'
    },
    'classique': {
      expensive: 'Moulures en bois massif',
      alternative: 'Moulures en MDF peint',
      savings: '70-80%'
    },
    'campagne': {
      expensive: 'Poutres en chêne ancien',
      alternative: 'Poutres décoratives en polyuréthane',
      savings: '75-85%'
    },
    'spa': {
      expensive: 'Carrelage en pierre naturelle',
      alternative: 'Carrelage grès cérame effet pierre',
      savings: '40-60%'
    }
  }

  const budgetRanges = [
    { min: 5000, max: 15000, label: 'Budget serré', color: 'bg-red-100 text-red-800' },
    { min: 15000, max: 30000, label: 'Budget modéré', color: 'bg-yellow-100 text-yellow-800' },
    { min: 30000, max: 50000, label: 'Budget confortable', color: 'bg-green-100 text-green-800' },
    { min: 50000, max: 100000, label: 'Budget élevé', color: 'bg-blue-100 text-blue-800' }
  ]

  // Profils de budget prédéfinis pour guider l'IA
  const budgetProfiles = [
    {
      id: 'economique',
      title: 'Économique',
      description: 'Maximiser les économies, privilégier les alternatives abordables',
      icon: DollarSign,
      aiGuidelines: {
        materialQuality: 'basic',
        finishLevel: 'standard',
        brandPreference: 'generic',
        customization: 'minimal'
      },
      color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
      id: 'equilibre',
      title: 'Équilibré',
      description: 'Bon rapport qualité-prix, mix entre économies et qualité',
      icon: Calculator,
      aiGuidelines: {
        materialQuality: 'mid-range',
        finishLevel: 'good',
        brandPreference: 'mid-range',
        customization: 'moderate'
      },
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      id: 'qualite',
      title: 'Qualité Premium',
      description: 'Privilégier la qualité et la durabilité, budget plus flexible',
      icon: Palette,
      aiGuidelines: {
        materialQuality: 'premium',
        finishLevel: 'high-end',
        brandPreference: 'premium',
        customization: 'extensive'
      },
      color: 'bg-green-100 text-green-800 border-green-200'
    }
  ]

  // Priorités budgétaires pour guider l'IA dans l'allocation des ressources
  const budgetPriorityOptions = [
    { id: 'structure', label: 'Structure & Gros œuvre', description: 'Fondations, murs, toiture' },
    { id: 'isolation', label: 'Isolation & Étanchéité', description: 'Efficacité énergétique' },
    { id: 'plomberie', label: 'Plomberie & Électricité', description: 'Installations techniques' },
    { id: 'cuisine', label: 'Cuisine & Électroménager', description: 'Équipements de cuisine' },
    { id: 'salle-bain', label: 'Salle de bain', description: 'Sanitaires et carrelage' },
    { id: 'sols', label: 'Revêtements de sol', description: 'Parquet, carrelage, moquette' },
    { id: 'peinture', label: 'Peinture & Décoration', description: 'Finitions décoratives' },
    { id: 'mobilier', label: 'Mobilier intégré', description: 'Placards, dressings' }
  ]

  const getCurrentBudgetRange = () => {
    const currentBudget = budget[0]
    return budgetRanges.find(range => currentBudget >= range.min && currentBudget <= range.max) || budgetRanges[0]
  }

  const handleOptimizationToggle = (optionId: string) => {
    setSelectedOptimizations((prev: string[]) => 
      prev.includes(optionId) 
        ? prev.filter((id: string) => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleBudgetProfileChange = (profileId: string) => {
    setSelectedBudgetProfile(profileId)
    // Ajuster automatiquement le budget selon le profil
    const profile = budgetProfiles.find(p => p.id === profileId)
    if (profile && profileId === 'economique' && budget[0] > 25000) {
      setBudget([Math.min(budget[0], 25000)])
    } else if (profile && profileId === 'qualite' && budget[0] < 30000) {
      setBudget([Math.max(budget[0], 30000)])
    }
  }

  const handlePriorityToggle = (priorityId: string, level: 'high' | 'medium' | 'low') => {
    setBudgetPriorities((prev: any) => ({
      ...prev,
      [priorityId]: level
    }))
  }

  const calculatePotentialSavings = () => {
    const baseCost = budget[0]
    let totalSavingsPercent = 0
    
    selectedOptimizations.forEach((optId: string) => {
      const option = optimizationOptions.find(opt => opt.id === optId)
      if (option) {
        const savingsRange = option.savings.split('-')
        const avgSavings = (parseInt(savingsRange[0]) + parseInt(savingsRange[1])) / 2
        totalSavingsPercent += avgSavings
      }
    })

    // Cap à 70% d'économies maximum
    totalSavingsPercent = Math.min(totalSavingsPercent, 70)
    const savingsAmount = (baseCost * totalSavingsPercent) / 100
    
    return {
      percent: totalSavingsPercent,
      amount: savingsAmount,
      newTotal: baseCost - savingsAmount
    }
  }

  const handleSubmit = () => {
    const savings = calculatePotentialSavings()
    const selectedProfile = budgetProfiles.find(p => p.id === selectedBudgetProfile)
    
    onUpdate({
      budget: budget[0],
      optimizations: selectedOptimizations,
      priorityLevel,
      potentialSavings: savings,
      budgetProfile: selectedBudgetProfile,
      budgetPriorities,
      aiGuidelines: selectedProfile?.aiGuidelines || {},
      budgetConstraints: {
        maxBudget: budget[0],
        priorityAreas: Object.keys(budgetPriorities).filter(key => budgetPriorities[key] === 'high'),
        economyAreas: Object.keys(budgetPriorities).filter(key => budgetPriorities[key] === 'low'),
        qualityLevel: selectedProfile?.aiGuidelines.materialQuality || 'mid-range'
      }
    })
    onNext()
  }

  const selectedStyle: string = data.selectedStyle
  const currentRange = getCurrentBudgetRange()
  const savings = calculatePotentialSavings()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <TrendingDown className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold">Optimisation des coûts</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Réduisons le coût de votre rénovation sans compromettre la qualité. 
          Sélectionnez les options qui vous conviennent pour maximiser vos économies.
        </p>
      </div>

      {/* Budget actuel */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Votre budget</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget souhaité</span>
              <Badge className={currentRange.color}>
                {currentRange.label}
              </Badge>
            </div>
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={100000}
              min={5000}
              step={1000}
              className="w-full"
            />
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">
                {budget[0].toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>

          {savings.percent > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Économies potentielles</span>
                <Badge className="bg-green-100 text-green-800">
                  -{savings.percent.toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Économies estimées:</span>
                  <span className="font-semibold text-green-800">
                    -{savings.amount.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Nouveau budget:</span>
                  <span className="font-bold text-green-800">
                    {savings.newTotal.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profils de budget pour guider l'IA */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Profil de budget pour l'IA</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choisissez comment l'IA doit adapter le design selon votre budget
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {budgetProfiles.map((profile) => {
              const isSelected = selectedBudgetProfile === profile.id
              const IconComponent = profile.icon
              
              return (
                <Card 
                  key={profile.id}
                  className={`cursor-pointer transition-all border-2 ${
                    isSelected 
                      ? profile.color.replace('100', '200') + ' bg-opacity-50' 
                      : 'border-border hover:border-blue-300'
                  }`}
                  onClick={() => handleBudgetProfileChange(profile.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isSelected ? profile.color.split(' ')[0] : 'bg-muted'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isSelected ? profile.color.split(' ')[1] : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold">{profile.title}</h5>
                        <p className="text-sm text-muted-foreground">
                          {profile.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Badge className={profile.color}>
                          Sélectionné
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Priorités budgétaires */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Priorités budgétaires</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Indiquez où investir en priorité pour guider l'IA dans ses recommandations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {budgetPriorityOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h6 className="font-medium">{option.label}</h6>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <div className="flex space-x-2">
                  {['high', 'medium', 'low'].map((level) => (
                    <Button
                      key={level}
                      variant={budgetPriorities[option.id] === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePriorityToggle(option.id, level as 'high' | 'medium' | 'low')}
                      className={`text-xs px-2 py-1 ${
                        level === 'high' ? 'bg-green-500 hover:bg-green-600' :
                        level === 'medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                        'bg-red-500 hover:bg-red-600'
                      } ${budgetPriorities[option.id] === level ? 'text-white' : ''}`}
                    >
                      {level === 'high' ? 'Priorité' : level === 'medium' ? 'Moyen' : 'Économie'}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
            <h6 className="font-medium text-purple-800 mb-2">Guide pour l'IA :</h6>
            <div className="text-sm text-purple-700 space-y-1">
              <div><strong>Priorité :</strong> L'IA privilégiera la qualité et investira davantage</div>
              <div><strong>Moyen :</strong> L'IA maintiendra un équilibre qualité-prix</div>
              <div><strong>Économie :</strong> L'IA proposera des alternatives moins coûteuses</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options d'optimisation */}
      <div className="space-y-6">
        <h4 className="text-xl font-semibold">Options d'économies</h4>
        
        <div className="grid gap-4">
          {optimizationOptions.map((option) => {
            const isSelected = selectedOptimizations.includes(option.id)
            const IconComponent = option.icon
            
            return (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => handleOptimizationToggle(option.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => handleOptimizationToggle(option.id)}
                      className="mt-1"
                    />
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-green-500 text-white' : 'bg-muted'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-semibold">{option.title}</h5>
                        <Badge className="bg-green-100 text-green-800">
                          -{option.savings}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>Difficulté: {option.difficulty}</span>
                        <span>Impact temps: {option.timeImpact}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Alternatives économiques pour le style sélectionné */}
      {selectedStyle && economicAlternatives[selectedStyle] && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Lightbulb className="h-5 w-5" />
              <span>Alternative économique pour le style {selectedStyle}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h6 className="font-medium text-red-700">Option coûteuse</h6>
                  <p className="text-sm text-red-600">
                    {economicAlternatives[selectedStyle].expensive}
                  </p>
                </div>
                <div className="space-y-2">
                  <h6 className="font-medium text-green-700">Alternative économique</h6>
                  <p className="text-sm text-green-600">
                    {economicAlternatives[selectedStyle].alternative}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                  Économie: {economicAlternatives[selectedStyle].savings}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Impact des choix budgétaires sur l'IA */}
      {(selectedBudgetProfile || Object.keys(budgetPriorities).length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Lightbulb className="h-5 w-5" />
              <span>Impact de vos choix sur les recommandations IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedBudgetProfile && (
                <div>
                  <h6 className="font-medium text-blue-800 mb-2">
                    Profil sélectionné : {budgetProfiles.find(p => p.id === selectedBudgetProfile)?.title}
                  </h6>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Qualité des matériaux :</span>
                      <span className="ml-2 text-blue-700">
                        {budgetProfiles.find(p => p.id === selectedBudgetProfile)?.aiGuidelines.materialQuality}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Niveau de finition :</span>
                      <span className="ml-2 text-blue-700">
                        {budgetProfiles.find(p => p.id === selectedBudgetProfile)?.aiGuidelines.finishLevel}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Marques privilégiées :</span>
                      <span className="ml-2 text-blue-700">
                        {budgetProfiles.find(p => p.id === selectedBudgetProfile)?.aiGuidelines.brandPreference}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Personnalisation :</span>
                      <span className="ml-2 text-blue-700">
                        {budgetProfiles.find(p => p.id === selectedBudgetProfile)?.aiGuidelines.customization}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {Object.keys(budgetPriorities).length > 0 && (
                <div>
                  <h6 className="font-medium text-blue-800 mb-2">Répartition budgétaire :</h6>
                  <div className="space-y-2">
                    {Object.keys(budgetPriorities).filter(key => budgetPriorities[key] === 'high').length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">Priorité élevée</Badge>
                        <span className="text-sm">
                          {Object.keys(budgetPriorities)
                            .filter(key => budgetPriorities[key] === 'high')
                            .map(key => budgetPriorityOptions.find(opt => opt.id === key)?.label)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                    {Object.keys(budgetPriorities).filter(key => budgetPriorities[key] === 'low').length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-800">Économies ciblées</Badge>
                        <span className="text-sm">
                          {Object.keys(budgetPriorities)
                            .filter(key => budgetPriorities[key] === 'low')
                            .map(key => budgetPriorityOptions.find(opt => opt.id === key)?.label)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white border border-blue-300 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>L'IA adaptera automatiquement :</strong> Les matériaux proposés, 
                  les marques recommandées, le niveau de finition et les alternatives économiques 
                  en fonction de vos choix ci-dessus.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils d'expert */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Conseils pour économiser intelligemment</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ne lésinez jamais sur l'isolation et l'étanchéité - c'est un investissement à long terme</li>
                <li>• Les économies sur la plomberie et l'électricité peuvent coûter cher plus tard</li>
                <li>• Privilégiez la qualité pour les éléments très utilisés (robinetterie, poignées)</li>
                <li>• Les finitions décoratives sont parfaites pour les alternatives économiques</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-3"
        >
          Appliquer les optimisations
          {savings.percent > 0 && (
            <span className="ml-2">
              (Économie: -{savings.percent.toFixed(0)}%)
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}
