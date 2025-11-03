'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Home, Sparkles, Eye } from "lucide-react"

interface RoomTransformationFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function RoomTransformationForm({ data, onUpdate, onNext }: RoomTransformationFormProps) {
  const [formData, setFormData] = useState({
    selectedRooms: data.project?.selectedRooms || [],
    currentPhotos: data.project?.currentPhotos || [],
    selectedStyle: data.project?.selectedStyle || '',
    inspirationPhotos: data.project?.inspirationPhotos || [],
    transformationGoals: data.project?.transformationGoals || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [loadingInspiration, setLoadingInspiration] = useState(false)

  const roomTypes = [
    { id: 'cuisine', label: 'Cuisine', icon: '🍳', desc: 'Rénovation complète de cuisine' },
    { id: 'salle-bain', label: 'Salle de bain', icon: '🛁', desc: 'Transformation de salle de bain' },
    { id: 'chambre', label: 'Chambre à coucher', icon: '🛏️', desc: 'Réaménagement de chambre' },
    { id: 'salon', label: 'Salon', icon: '🛋️', desc: 'Rénovation d\'espace de vie' },
    { id: 'bureau', label: 'Bureau', icon: '💻', desc: 'Aménagement d\'espace de travail' },
    { id: 'sous-sol', label: 'Sous-sol', icon: '🏠', desc: 'Finition ou rénovation de sous-sol' }
  ]

  const styleOptions = [
    { id: 'moderne', label: 'Moderne', color: '#2563eb' },
    { id: 'scandinave', label: 'Scandinave', color: '#f8fafc' },
    { id: 'industriel', label: 'Industriel', color: '#374151' },
    { id: 'classique', label: 'Classique', color: '#d97706' },
    { id: 'rustique', label: 'Rustique', color: '#92400e' },
    { id: 'minimaliste', label: 'Minimaliste', color: '#ffffff' }
  ]

  const handleRoomSelection = (roomId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedRooms: prev.selectedRooms.includes(roomId)
        ? prev.selectedRooms.filter((id: string) => id !== roomId)
        : [...prev.selectedRooms, roomId]
    }))
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingPhotos(true)
    const newPhotos: Array<{id: number, url: string, file: File, name: string}> = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const photoUrl = URL.createObjectURL(file)
      newPhotos.push({
        id: Date.now() + i,
        url: photoUrl,
        file: file,
        name: file.name
      })
    }

    setFormData(prev => ({
      ...prev,
      currentPhotos: [...prev.currentPhotos, ...newPhotos]
    }))
    setUploadingPhotos(false)
  }

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      currentPhotos: prev.currentPhotos.filter((photo: any) => photo.id !== photoId)
    }))
  }

  const loadInspirationPhotos = async (style: string) => {
    if (!style || formData.selectedRooms.length === 0) return

    setLoadingInspiration(true)
    try {
      const allPhotos: any[] = []
      
      // Pour chaque pièce sélectionnée, récupérer des photos spécifiques
      for (const room of formData.selectedRooms) {
        const roomNames = {
          'cuisine': 'cuisine',
          'salle-bain': 'salle-de-bain', 
          'chambre': 'chambre',
          'salon': 'salon',
          'bureau': 'bureau',
          'sous-sol': 'sous-sol'
        }
        
        const roomType = roomNames[room as keyof typeof roomNames] || room
        
        // Utiliser l'API GET avec des paramètres
        const url = `/api/inspiration/photos?roomType=${encodeURIComponent(roomType)}&style=${encodeURIComponent(style)}&count=6`
        const roomResponse = await fetch(url)
        
        if (roomResponse.ok) {
          const roomData = await roomResponse.json()
          console.log(`Photos pour ${room} (${roomType}):`, roomData.photos)
          
          // Ajouter les photos avec le nom de la pièce
          const photosWithRoom = roomData.photos.map((photo: any) => ({
            ...photo,
            roomName: room,
            roomType: roomType
          }))
          
          allPhotos.push(...photosWithRoom)
        }
        
        // Petit délai entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      console.log('Toutes les photos reçues:', allPhotos)
      setFormData(prev => ({
        ...prev,
        inspirationPhotos: allPhotos
      }))
      
    } catch (error) {
      console.error('Erreur lors du chargement des photos d\'inspiration:', error)
      setFormData(prev => ({
        ...prev,
        inspirationPhotos: []
      }))
    }
    setLoadingInspiration(false)
  }

  const handleStyleSelection = (styleId: string) => {
    setFormData(prev => ({ ...prev, selectedStyle: styleId }))
    loadInspirationPhotos(styleId)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.selectedRooms.length === 0) {
      newErrors.selectedRooms = 'Veuillez sélectionner au moins une pièce à transformer'
    }

    if (formData.currentPhotos.length === 0) {
      newErrors.currentPhotos = 'Au moins une photo de l\'état actuel est requise'
    }

    if (!formData.selectedStyle) {
      newErrors.selectedStyle = 'Veuillez sélectionner un style'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onUpdate({ project: formData })
      onNext()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Transformation de pièces</h3>
        <p className="text-muted-foreground">
          Sélectionnez les pièces à transformer et le style souhaité pour générer des inspirations personnalisées.
        </p>
      </div>

      <div className="space-y-6">
        {/* Sélection des pièces */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Pièces à transformer *
          </label>
          <p className="text-sm text-muted-foreground">
            Sélectionnez une ou plusieurs pièces (vous pouvez en choisir plusieurs)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {roomTypes.map((room) => (
              <Card
                key={room.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.selectedRooms.includes(room.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleRoomSelection(room.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{room.icon}</div>
                  <p className={`font-medium text-sm mb-1 ${
                    formData.selectedRooms.includes(room.id) ? 'text-primary' : 'text-foreground'
                  }`}>
                    {room.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{room.desc}</p>
                  {formData.selectedRooms.includes(room.id) && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary text-primary-foreground">
                        ✓ Sélectionné
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.selectedRooms && (
            <p className="text-sm text-red-500">{errors.selectedRooms}</p>
          )}
        </div>

        {/* Photos actuelles */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Photos de l'état actuel *
          </label>
          <p className="text-sm text-muted-foreground">
            Ajoutez des photos des pièces dans leur état actuel pour la transformation IA
          </p>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="current-photos"
            />
            <label
              htmlFor="current-photos"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Cliquez pour ajouter des photos</span>
              <span className="text-xs text-muted-foreground">PNG, JPG jusqu'à 10MB chacune</span>
            </label>
          </div>

          {/* Aperçu des photos */}
          {formData.currentPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.currentPhotos.map((photo: any) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {errors.currentPhotos && (
            <p className="text-sm text-red-500">{errors.currentPhotos}</p>
          )}
        </div>

        {/* Sélection du style */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Style souhaité *
          </label>
          <p className="text-sm text-muted-foreground">
            Choisissez le style pour générer des inspirations personnalisées
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {styleOptions.map((style) => (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.selectedStyle === style.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleStyleSelection(style.id)}
              >
                <CardContent className="p-4 text-center">
                  <div 
                    className="w-12 h-12 rounded-lg mx-auto mb-2 border"
                    style={{ backgroundColor: style.color }}
                  />
                  <p className={`font-medium text-sm ${
                    formData.selectedStyle === style.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {style.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.selectedStyle && (
            <p className="text-sm text-red-500">{errors.selectedStyle}</p>
          )}
        </div>

        {/* Photos d'inspiration générées */}
        {formData.inspirationPhotos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <label className="text-sm font-medium text-foreground">
                Photos d'inspiration générées
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Inspirations {formData.selectedStyle} pour vos pièces sélectionnées
            </p>
            
            {/* Grouper les photos par pièce */}
            {formData.selectedRooms.map((room: string) => {
              const roomPhotos = formData.inspirationPhotos.filter((photo: any) => photo.roomName === room)
              if (roomPhotos.length === 0) return null
              
              const roomLabels = {
                'cuisine': 'Cuisine',
                'salle-bain': 'Salle de bain',
                'chambre': 'Chambre à coucher',
                'salon': 'Salon',
                'bureau': 'Bureau',
                'sous-sol': 'Sous-sol'
              }
              
              return (
                <div key={room} className="space-y-2">
                  <h4 className="font-medium text-foreground flex items-center space-x-2">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                    <span>{roomLabels[room as keyof typeof roomLabels] || room}</span>
                    <span className="text-xs text-muted-foreground">({roomPhotos.length} inspirations)</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {roomPhotos.map((photo: any, index: number) => (
                      <div key={`${room}-${index}`} className="relative group">
                        <img
                          src={photo.src?.medium || photo.url}
                          alt={photo.alt || `${room} inspiration ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {photo.photographer || 'Pexels'}
                        </div>
                        <div className="absolute top-1 right-1 bg-primary/80 text-white text-xs px-1.5 py-0.5 rounded">
                          {formData.selectedStyle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {loadingInspiration && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Génération des inspirations...</p>
          </div>
        )}

        {/* Objectifs de transformation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Objectifs de transformation (optionnel)
          </label>
          <textarea
            value={formData.transformationGoals}
            onChange={(e) => handleInputChange('transformationGoals', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-border"
            placeholder="Ex: Agrandir visuellement l'espace, créer plus de rangement, moderniser le look..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          disabled={uploadingPhotos || loadingInspiration}
        >
          {uploadingPhotos ? 'Upload en cours...' : 
           loadingInspiration ? 'Génération...' : 'Continuer vers la transformation IA'}
        </Button>
      </div>
    </div>
  )
}
