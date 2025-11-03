'use client'

import { MapPin } from 'lucide-react'

interface SimpleAddressFormProps {
  address: string
  city: string
  postalCode: string
  onAddressChange: (value: string) => void
  onCityChange: (value: string) => void
  onPostalCodeChange: (value: string) => void
  errors?: {
    address?: string
    city?: string
    postalCode?: string
  }
}

export function SimpleAddressForm({
  address,
  city,
  postalCode,
  onAddressChange,
  onCityChange,
  onPostalCodeChange,
  errors = {}
}: SimpleAddressFormProps) {
  return (
    <div className="space-y-4">
      {/* Adresse */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Adresse *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.address ? 'border-red-500' : 'border-border'
            }`}
            placeholder="123 Rue Saint-Denis"
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address}</p>
        )}
      </div>

      {/* Ville et Code postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Ville *
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.city ? 'border-red-500' : 'border-border'
            }`}
            placeholder="Montréal"
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
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.postalCode ? 'border-red-500' : 'border-border'
            }`}
            placeholder="H1A 1A1"
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500">{errors.postalCode}</p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        📍 Saisissez votre adresse québécoise complète
      </p>
    </div>
  )
}
