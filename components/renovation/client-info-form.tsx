'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Phone, MapPin } from "lucide-react"

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
    postalCode: data.client?.postalCode || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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
              placeholder="01 23 45 67 89"
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-foreground">
            Adresse *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                errors.address ? 'border-red-500' : 'border-border'
              }`}
              placeholder="123 Rue de la Paix"
            />
          </div>
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Ville *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.city ? 'border-red-500' : 'border-border'
            }`}
            placeholder="Paris"
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Code postal *
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.postalCode ? 'border-red-500' : 'border-border'
            }`}
            placeholder="75001"
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500">{errors.postalCode}</p>
          )}
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
