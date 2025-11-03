'use client'

import { useState, useEffect } from 'react'
import { GooglePlacesAutocomplete } from './google-places-autocomplete'
import { SimpleAddressForm } from './simple-address-form'

interface SmartAddressFormProps {
  address: string
  city: string
  postalCode: string
  onAddressChange: (value: string) => void
  onCityChange: (value: string) => void
  onPostalCodeChange: (value: string) => void
  onPlaceSelected?: (place: {
    address: string
    city: string
    postalCode: string
    country: string
  }) => void
  errors?: {
    address?: string
    city?: string
    postalCode?: string
  }
}

export function SmartAddressForm({
  address,
  city,
  postalCode,
  onAddressChange,
  onCityChange,
  onPostalCodeChange,
  onPlaceSelected,
  errors = {}
}: SmartAddressFormProps) {
  const [useGooglePlaces, setUseGooglePlaces] = useState(true)
  const [googlePlacesError, setGooglePlacesError] = useState(false)

  // Vérifier si Google Places API est disponible
  useEffect(() => {
    const checkGooglePlaces = () => {
      if (typeof window !== 'undefined') {
        // Vérifier si la clé API est configurée
        const hasApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
        if (!hasApiKey) {
          console.log('Google Places API key not configured, using simple form')
          setUseGooglePlaces(false)
          return
        }

        // Attendre que Google Places soit chargé
        let attempts = 0
        const maxAttempts = 10
        
        const checkInterval = setInterval(() => {
          attempts++
          
          if (window.google?.maps?.places) {
            console.log('Google Places API loaded successfully')
            setUseGooglePlaces(true)
            setGooglePlacesError(false)
            clearInterval(checkInterval)
          } else if (attempts >= maxAttempts) {
            console.log('Google Places API failed to load, falling back to simple form')
            setUseGooglePlaces(false)
            setGooglePlacesError(true)
            clearInterval(checkInterval)
          }
        }, 1000)

        return () => clearInterval(checkInterval)
      }
    }

    checkGooglePlaces()
  }, [])

  const handlePlaceSelected = (place: any) => {
    onAddressChange(place.address)
    onCityChange(place.city)
    onPostalCodeChange(place.postalCode)
    
    if (onPlaceSelected) {
      onPlaceSelected(place)
    }
  }

  // Si Google Places n'est pas disponible ou a échoué, utiliser le formulaire simple
  if (!useGooglePlaces || googlePlacesError) {
    return (
      <div className="space-y-4">
        {googlePlacesError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Autocomplétion temporairement indisponible. Saisissez votre adresse manuellement.
            </p>
          </div>
        )}
        <SimpleAddressForm
          address={address}
          city={city}
          postalCode={postalCode}
          onAddressChange={onAddressChange}
          onCityChange={onCityChange}
          onPostalCodeChange={onPostalCodeChange}
          errors={errors}
        />
      </div>
    )
  }

  // Utiliser Google Places Autocomplete
  return (
    <div className="space-y-4">
      <GooglePlacesAutocomplete
        value={address}
        onChange={onAddressChange}
        onPlaceSelected={handlePlaceSelected}
        error={errors.address}
        placeholder="123 Rue Saint-Denis, Montréal, QC"
      />
      
      {/* Champs ville et code postal (remplis automatiquement par Google Places) */}
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
    </div>
  )
}
