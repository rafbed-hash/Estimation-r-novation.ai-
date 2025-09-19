'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Home,
  ChefHat,
  Bath,
  Bed,
  Sofa,
  Briefcase,
  Car,
  Utensils,
  Ruler
} from "lucide-react"

interface RoomSelectionFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function RoomSelectionForm({ data, onUpdate, onNext }: RoomSelectionFormProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>(data.rooms || [])
  const [roomDimensions, setRoomDimensions] = useState<Record<string, {width: string, length: string, height: string}>>(data.roomDimensions || {})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const rooms = [
    { id: 'cuisine', label: 'Cuisine', icon: ChefHat, description: 'Espace culinaire' },
    { id: 'salle-de-bain', label: 'Salle de bain', icon: Bath, description: 'Salle de bain principale' },
    { id: 'salon', label: 'Salon', icon: Sofa, description: 'Espace de vie principal' },
    { id: 'chambre-principale', label: 'Chambre principale', icon: Bed, description: 'Chambre des maîtres' },
    { id: 'chambre', label: 'Chambre', icon: Bed, description: 'Chambre secondaire' },
    { id: 'salle-a-manger', label: 'Salle à manger', icon: Utensils, description: 'Espace repas' },
    { id: 'bureau', label: 'Bureau', icon: Briefcase, description: 'Espace de travail' },
    { id: 'salle-de-bain-secondaire', label: 'Salle de bain secondaire', icon: Bath, description: 'Salle d\'eau' },
    { id: 'entree', label: 'Entrée', icon: Home, description: 'Hall d\'entrée' },
    { id: 'garage', label: 'Garage', icon: Car, description: 'Espace véhicules' }
  ]

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomId)) {
        // Remove room and its dimensions
        const newDimensions = { ...roomDimensions }
        delete newDimensions[roomId]
        setRoomDimensions(newDimensions)
        return prev.filter(id => id !== roomId)
      } else {
        // Add room with default dimensions
        setRoomDimensions(prev => ({
          ...prev,
          [roomId]: { width: '', length: '', height: '8' }
        }))
        return [...prev, roomId]
      }
    })
    
    // Clear errors when user makes a selection
    if (errors.rooms) {
      setErrors(prev => ({ ...prev, rooms: '' }))
    }
  }

  const updateRoomDimension = (roomId: string, dimension: 'width' | 'length' | 'height', value: string) => {
    setRoomDimensions(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        [dimension]: value
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (selectedRooms.length === 0) {
      newErrors.rooms = 'Veuillez sélectionner au moins une pièce à rénover'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ 
        rooms: selectedRooms,
        roomDimensions: roomDimensions
      })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Quelles pièces souhaitez-vous rénover ?</h3>
        <p className="text-muted-foreground">
          Sélectionnez toutes les pièces que vous envisagez de rénover. Vous pourrez choisir une pièce spécifique pour la visualisation IA à l'étape suivante.
        </p>
      </div>

      {selectedRooms.length > 0 && (
        <div className="text-center">
          <Badge className="bg-primary text-primary-foreground">
            {selectedRooms.length} pièce{selectedRooms.length > 1 ? 's' : ''} sélectionnée{selectedRooms.length > 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => {
          const isSelected = selectedRooms.includes(room.id)
          return (
            <Card
              key={room.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => toggleRoom(room.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <room.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {room.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {room.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {errors.rooms && (
        <div className="text-center">
          <p className="text-sm text-red-500">{errors.rooms}</p>
        </div>
      )}

      {/* Dimensions des pièces sélectionnées */}
      {selectedRooms.length > 0 && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Ruler className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-lg font-semibold">Dimensions des pièces</h4>
            <p className="text-sm text-muted-foreground">
              Ajoutez les dimensions pour une estimation plus précise et des transformations IA adaptées
            </p>
          </div>

          <div className="grid gap-6">
            {selectedRooms.map((roomId) => {
              const room = rooms.find(r => r.id === roomId)
              const dimensions = roomDimensions[roomId] || { width: '', length: '', height: '8' }
              
              if (!room) return null
              
              return (
                <Card key={roomId} className="border-secondary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <room.icon className="h-5 w-5 text-primary" />
                      <h5 className="font-semibold">{room.label}</h5>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`width-${roomId}`}>Largeur (pi)</Label>
                        <Input
                          id={`width-${roomId}`}
                          type="number"
                          placeholder="12"
                          value={dimensions.width}
                          onChange={(e) => updateRoomDimension(roomId, 'width', e.target.value)}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`length-${roomId}`}>Longueur (pi)</Label>
                        <Input
                          id={`length-${roomId}`}
                          type="number"
                          placeholder="15"
                          value={dimensions.length}
                          onChange={(e) => updateRoomDimension(roomId, 'length', e.target.value)}
                          className="text-center"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`height-${roomId}`}>Hauteur (pi)</Label>
                        <Input
                          id={`height-${roomId}`}
                          type="number"
                          placeholder="8"
                          value={dimensions.height}
                          onChange={(e) => updateRoomDimension(roomId, 'height', e.target.value)}
                          className="text-center"
                        />
                      </div>
                    </div>
                    
                    {dimensions.width && dimensions.length && (
                      <div className="mt-3 text-sm text-muted-foreground text-center">
                        Surface: {Math.round(parseFloat(dimensions.width) * parseFloat(dimensions.length))} pi²
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Conseil de nos experts</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rénover plusieurs pièces en même temps peut vous faire économiser jusqu'à 20% sur les coûts totaux 
                grâce aux économies d'échelle sur les matériaux et la main-d'œuvre.
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
          disabled={selectedRooms.length === 0}
        >
          Continuer avec {selectedRooms.length} pièce{selectedRooms.length > 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
