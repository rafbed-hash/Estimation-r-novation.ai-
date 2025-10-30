'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Home, 
  Wrench, 
  Zap, 
  Droplets, 
  Thermometer, 
  Wind,
  ArrowRight,
  Camera
} from "lucide-react"

interface ProjectTypeSelectionProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function ProjectTypeSelection({ data, onUpdate, onNext }: ProjectTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState(data.projectType || '')

  const projectTypes = [
    {
      id: 'renovation',
      name: 'Rénovation Complète',
      description: 'Transformation d\'espaces avec design et IA',
      icon: Home,
      color: 'bg-blue-500',
      features: ['Design IA', 'Visualisation 3D', 'Estimation détaillée'],
      leadValue: 'Standard'
    },
    {
      id: 'plomberie',
      name: 'Plomberie',
      description: 'Installation, réparation, diagnostic plomberie',
      icon: Droplets,
      color: 'bg-cyan-500',
      features: ['Diagnostic photo', 'Devis rapide', 'Intervention urgente'],
      leadValue: 'Élevé'
    },
    {
      id: 'thermopompe',
      name: 'Thermopompe',
      description: 'Installation et maintenance thermopompes',
      icon: Thermometer,
      color: 'bg-orange-500',
      features: ['Évaluation énergétique', 'Subventions', 'Installation pro'],
      leadValue: 'Premium'
    },
    {
      id: 'electricite',
      name: 'Électricité',
      description: 'Installation électrique et mise aux normes',
      icon: Zap,
      color: 'bg-yellow-500',
      features: ['Diagnostic sécurité', 'Mise aux normes', 'Domotique'],
      leadValue: 'Élevé'
    },
    {
      id: 'ventilation',
      name: 'Ventilation/CVC',
      description: 'Systèmes de ventilation et climatisation',
      icon: Wind,
      color: 'bg-green-500',
      features: ['Qualité air', 'Économies énergie', 'Confort optimal'],
      leadValue: 'Premium'
    },
    {
      id: 'maintenance',
      name: 'Maintenance Générale',
      description: 'Réparations et entretien général',
      icon: Wrench,
      color: 'bg-gray-500',
      features: ['Intervention rapide', 'Multi-spécialités', 'Contrat entretien'],
      leadValue: 'Standard'
    }
  ]

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId)
  }

  const handleSubmit = () => {
    if (!selectedType) return

    onUpdate({ 
      projectType: selectedType,
      projectName: projectTypes.find(t => t.id === selectedType)?.name || selectedType
    })
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Wrench className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Type de projet</h3>
        <p className="text-muted-foreground">
          Sélectionnez le type de service dont vous avez besoin pour une qualification optimale
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType === type.id
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => handleTypeSelect(type.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-lg ${type.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant={type.leadValue === 'Premium' ? 'default' : type.leadValue === 'Élevé' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {type.leadValue}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{type.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {type.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {type.id !== 'renovation' && (
                    <div className="flex items-center text-xs text-blue-600 font-medium">
                      <Camera className="h-3 w-3 mr-1" />
                      Diagnostic photo inclus
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedType && (
        <div className="text-center">
          <div className="bg-primary/5 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">
                Projet sélectionné : {projectTypes.find(t => t.id === selectedType)?.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedType !== 'renovation' 
                ? 'Vous pourrez ajouter des photos de diagnostic à l\'étape suivante'
                : 'Vous pourrez télécharger vos photos d\'inspiration à l\'étape suivante'
              }
            </p>
          </div>

          <Button 
            onClick={handleSubmit}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          >
            Continuer avec ce type de projet
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
