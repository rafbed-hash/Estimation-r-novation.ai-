'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Phone, MapPin } from "lucide-react"
import { SmartAddressForm } from './smart-address-form'
// import { GooglePlacesAutocomplete } from './google-places-autocomplete'
// import { SimpleAddressForm } from './simple-address-form'

interface ClientInfoFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function ClientInfoForm({ data, onUpdate, onNext }: ClientInfoFormProps) {
  const [formData, setFormData] = useState({
    firstName: data.client?.firstName || '',
    lastName: data.client?.lastName || '',
    email: data.client?.email || '',
    phone: data.client?.phone || '',
    address: data.client?.address || '',
    city: data.client?.city || '',
    postalCode: data.client?.postalCode || '',
    budget: data.client?.budget || '',
    urgency: data.client?.urgency || '',
    bestCallTime: data.client?.bestCallTime || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '')
    
    // Formater selon le pattern québécois (XXX) XXX-XXXX
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value
    
    // Formater automatiquement le numéro de téléphone
    if (field === 'phone') {
      processedValue = formatPhoneNumber(value)
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePlaceSelected = (place: {
    address: string
    city: string
    postalCode: string
    country: string
  }) => {
    // Remplir automatiquement les champs avec les données Google
    setFormData(prev => ({
      ...prev,
      address: place.address,
      city: place.city,
      postalCode: place.postalCode
    }))
    
    // Effacer les erreurs des champs remplis automatiquement
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors.address
      delete newErrors.city
      delete newErrors.postalCode
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise'
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ client: formData })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Vos informations personnelles</h3>
        <p className="text-muted-foreground">
          Ces informations nous permettront de vous contacter et de personnaliser votre devis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Prénom *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.firstName ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Votre prénom"
            />
          </div>
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nom *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.lastName ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Votre nom"
            />
          </div>
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-border'
              }`}
              placeholder="votre@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Téléphone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.phone ? 'border-red-500' : 'border-border'
              }`}
              placeholder="514-123-4567"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <SmartAddressForm
            address={formData.address}
            city={formData.city}
            postalCode={formData.postalCode}
            onAddressChange={(value) => handleInputChange('address', value)}
            onCityChange={(value) => handleInputChange('city', value)}
            onPostalCodeChange={(value) => handleInputChange('postalCode', value)}
            onPlaceSelected={handlePlaceSelected}
            errors={{
              address: errors.address,
              city: errors.city,
              postalCode: errors.postalCode
            }}
          />
        </div>

        {/* Section budget supprimée selon demande utilisateur */}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Urgence du projet
          </label>
          <select
            value={formData.urgency}
            onChange={(e) => handleInputChange('urgency', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-border"
          >
            <option value="">Quand souhaitez-vous commencer ?</option>
            <option value="asap">Dès que possible</option>
            <option value="1-3-months">Dans 1-3 mois</option>
            <option value="3-6-months">Dans 3-6 mois</option>
            <option value="later">Plus tard</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Meilleur moment pour vous appeler
          </label>
          <select
            value={formData.bestCallTime}
            onChange={(e) => handleInputChange('bestCallTime', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-border"
          >
            <option value="">Choisissez un créneau</option>
            <option value="morning">Matin (9h-12h)</option>
            <option value="afternoon">Après-midi (14h-17h)</option>
            <option value="evening">Soir (18h-20h)</option>
            <option value="anytime">N'importe quand</option>
          </select>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Confidentialité assurée</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vos informations personnelles sont protégées et ne seront utilisées que pour ce projet de rénovation. 
                Nous ne les partagerons jamais avec des tiers sans votre consentement.
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
