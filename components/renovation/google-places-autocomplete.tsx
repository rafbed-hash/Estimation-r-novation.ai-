'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'

interface GooglePlacesAutocompleteProps {
  onPlaceSelected: (place: {
    address: string
    city: string
    postalCode: string
    country: string
  }) => void
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}

declare global {
  interface Window {
    google: any
    initGooglePlaces: () => void
  }
}

export function GooglePlacesAutocomplete({
  onPlaceSelected,
  value,
  onChange,
  error,
  placeholder = "Tapez votre adresse..."
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Charger l'API Google Places si pas déjà chargée
    if (!window.google) {
      loadGooglePlacesScript()
    } else {
      initializeAutocomplete()
    }
  }, [])

  const loadGooglePlacesScript = () => {
    // Créer une fonction globale pour l'initialisation
    window.initGooglePlaces = () => {
      setIsLoaded(true)
      initializeAutocomplete()
    }

    // Charger le script Google Places
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initGooglePlaces`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return

    // Créer l'instance d'autocomplétion
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'CA' }, // Limiter au Canada
        fields: ['address_components', 'formatted_address', 'geometry'],
        // Préférer les résultats du Québec
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(45.0, -79.0), // Sud-Ouest du Québec
          new window.google.maps.LatLng(62.0, -57.0)  // Nord-Est du Québec
        ),
        strictBounds: false
      }
    )

    // Écouter la sélection d'une adresse
    autocompleteRef.current.addListener('place_changed', handlePlaceSelect)
  }

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace()
    
    if (!place.address_components) {
      return
    }

    // Extraire les composants de l'adresse
    let address = ''
    let city = ''
    let postalCode = ''
    let country = ''

    place.address_components.forEach((component: any) => {
      const types = component.types

      if (types.includes('street_number') || types.includes('route')) {
        address += component.long_name + ' '
      }
      
      if (types.includes('locality')) {
        city = component.long_name
      } else if (types.includes('administrative_area_level_1') && component.short_name === 'QC') {
        // S'assurer qu'on est bien au Québec
      } else if (types.includes('administrative_area_level_2') && !city) {
        city = component.long_name
      }
      
      if (types.includes('postal_code')) {
        postalCode = component.long_name
      }
      
      if (types.includes('country')) {
        country = component.long_name
      }
    })

    // Nettoyer l'adresse
    address = address.trim()
    
    // Si pas d'adresse détaillée, utiliser l'adresse formatée
    if (!address) {
      address = place.formatted_address || ''
    }

    // Mettre à jour les champs
    onChange(place.formatted_address || '')
    
    // Notifier le parent avec les données structurées
    onPlaceSelected({
      address: address,
      city: city,
      postalCode: postalCode,
      country: country
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Adresse *
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          className={`w-full pl-11 pr-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
            error ? 'border-red-500' : 'border-border'
          }`}
          placeholder={placeholder}
        />
        {!isLoaded && window.google === undefined && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">
        🇨🇦 Tapez votre adresse québécoise pour l'autocomplétion
      </p>
    </div>
  )
}
