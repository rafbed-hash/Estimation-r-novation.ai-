'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Home, Calendar, Building, Building2 } from "lucide-react"

interface HouseInfoFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function HouseInfoForm({ data, onUpdate, onNext }: HouseInfoFormProps) {
  const [formData, setFormData] = useState({
    constructionYear: data.house?.constructionYear || '',
    propertyType: data.house?.propertyType || '',
    surface: data.house?.surface || '',
    rooms: data.house?.rooms || '',
    floors: data.house?.floors || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const propertyTypes = [
    { id: 'appartement', label: 'Appartement', icon: Building },
    { id: 'condo', label: 'Condo', icon: Building2 },
    { id: 'jumele', label: 'Maison jumelée', icon: Home },
    { id: 'detache', label: 'Maison détachée', icon: Home }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.constructionYear) {
      newErrors.constructionYear = 'L\'année de construction est requise'
    } else {
      const year = parseInt(formData.constructionYear)
      if (year < 1800 || year > new Date().getFullYear()) {
        newErrors.constructionYear = 'Année de construction invalide'
      }
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Le type de propriété est requis'
    }

    if (!formData.surface) {
      newErrors.surface = 'La superficie est requise'
    } else if (parseInt(formData.surface) <= 0) {
      newErrors.surface = 'La superficie doit être supérieure à 0'
    }

    if (!formData.rooms) {
      newErrors.rooms = 'Le nombre de pièces est requis'
    } else if (parseInt(formData.rooms) <= 0) {
      newErrors.rooms = 'Le nombre de pièces doit être supérieur à 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ house: formData })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Informations sur votre propriété</h3>
        <p className="text-muted-foreground">
          Ces détails nous aident à mieux comprendre votre projet et à personnaliser nos recommandations.
        </p>
      </div>

      <div className="space-y-6">
        {/* Type de propriété */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Type de propriété *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {propertyTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.propertyType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('propertyType', type.id)}
              >
                <CardContent className="p-4 text-center">
                  <type.icon className={`h-8 w-8 mx-auto mb-2 ${
                    formData.propertyType === type.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className={`text-sm font-medium ${
                    formData.propertyType === type.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {type.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.propertyType && (
            <p className="text-sm text-red-500">{errors.propertyType}</p>
          )}
        </div>

        {/* Année de construction */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Année de construction *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="number"
              value={formData.constructionYear}
              onChange={(e) => handleInputChange('constructionYear', e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.constructionYear ? 'border-red-500' : 'border-border'
              }`}
              placeholder="2020"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
          {errors.constructionYear && (
            <p className="text-sm text-red-500">{errors.constructionYear}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Superficie */}
          <div className="space-y-2">
            <Label htmlFor="surface">Surface habitable (pi²)</Label>
            <Input
              id="surface"
              type="number"
              placeholder="Ex: 1200"
              value={formData.surface}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              className={errors.surface ? 'border-red-500' : ''}
            />
            {errors.surface && <p className="text-sm text-red-500">{errors.surface}</p>}
          </div>

          {/* Nombre de pièces */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nombre de pièces *
            </label>
            <input
              type="number"
              value={formData.rooms}
              onChange={(e) => handleInputChange('rooms', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.rooms ? 'border-red-500' : 'border-border'
              }`}
              placeholder="5"
              min="1"
            />
            {errors.rooms && (
              <p className="text-sm text-red-500">{errors.rooms}</p>
            )}
          </div>
        </div>

        {/* Nombre d'étages (optionnel) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nombre d'étages (optionnel)
          </label>
          <input
            type="number"
            value={formData.floors}
            onChange={(e) => handleInputChange('floors', e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="2"
            min="1"
          />
        </div>
      </div>

      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Pourquoi ces informations ?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ces détails nous permettent de calculer plus précisément les coûts de matériaux et de main-d'œuvre, 
                et d'adapter nos recommandations de style selon le type et l'âge de votre propriété.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
        >
          Continuer
        </Button>
      </div>
    </div>
  )
}
