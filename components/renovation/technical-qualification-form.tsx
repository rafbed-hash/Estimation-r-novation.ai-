'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  X, 
  Camera, 
  AlertCircle, 
  CheckCircle,
  Droplets,
  Thermometer,
  Zap,
  Wind,
  Wrench
} from "lucide-react"

interface TechnicalQualificationFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

interface DiagnosticPhoto {
  id: string
  file: File
  preview: string
  name: string
  description: string
}

export function TechnicalQualificationForm({ data, onUpdate, onNext }: TechnicalQualificationFormProps) {
  const [photos, setPhotos] = useState<DiagnosticPhoto[]>([])
  const [formData, setFormData] = useState({
    urgency: data.technicalData?.urgency || '',
    problemDescription: data.technicalData?.problemDescription || '',
    symptoms: data.technicalData?.symptoms || [],
    accessibility: data.technicalData?.accessibility || '',
    preferredTime: data.technicalData?.preferredTime || '',
    budget: data.technicalData?.budget || ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const projectType = data.projectType || 'plomberie'

  // Configuration par type de projet
  const projectConfig = {
    plomberie: {
      icon: Droplets,
      color: 'text-cyan-600',
      title: 'Diagnostic Plomberie',
      symptoms: [
        'Fuite d\'eau visible',
        'Pression d\'eau faible',
        'Évacuation lente',
        'Bruit dans les canalisations',
        'Eau chaude insuffisante',
        'Odeurs désagréables'
      ],
      photoTips: [
        'Photographiez la zone du problème',
        'Montrez les traces d\'humidité',
        'Capturez les compteurs/installations',
        'Documentez l\'accès aux canalisations'
      ]
    },
    thermopompe: {
      icon: Thermometer,
      color: 'text-orange-600',
      title: 'Évaluation Thermopompe',
      symptoms: [
        'Chauffage inefficace',
        'Consommation élevée',
        'Bruit anormal',
        'Givre excessif',
        'Arrêts fréquents',
        'Température irrégulière'
      ],
      photoTips: [
        'Photo de l\'unité extérieure',
        'Unité intérieure/thermostat',
        'Espace disponible installation',
        'Tableau électrique existant'
      ]
    },
    electricite: {
      icon: Zap,
      color: 'text-yellow-600',
      title: 'Diagnostic Électrique',
      symptoms: [
        'Disjoncteur qui saute',
        'Prises qui chauffent',
        'Éclairage défaillant',
        'Installation ancienne',
        'Besoin prises supplémentaires',
        'Mise aux normes'
      ],
      photoTips: [
        'Tableau électrique principal',
        'Prises/interrupteurs concernés',
        'Zone à équiper',
        'Compteur électrique'
      ]
    },
    ventilation: {
      icon: Wind,
      color: 'text-green-600',
      title: 'Diagnostic Ventilation',
      symptoms: [
        'Air vicié/humidité',
        'Condensation excessive',
        'Odeurs persistantes',
        'Ventilation bruyante',
        'Mauvaise circulation air',
        'Moisissures'
      ],
      photoTips: [
        'Système ventilation actuel',
        'Zones humides/moisissures',
        'Grilles d\'aération',
        'Espace technique disponible'
      ]
    },
    maintenance: {
      icon: Wrench,
      color: 'text-gray-600',
      title: 'Diagnostic Maintenance',
      symptoms: [
        'Équipement défaillant',
        'Usure visible',
        'Performance dégradée',
        'Entretien nécessaire',
        'Réparation urgente',
        'Remplacement à prévoir'
      ],
      photoTips: [
        'Équipement concerné',
        'Signes d\'usure/dommages',
        'Environnement installation',
        'Accès pour intervention'
      ]
    }
  }

  const config = projectConfig[projectType as keyof typeof projectConfig] || projectConfig.plomberie
  const Icon = config.icon

  const handleFileUpload = async (files: FileList) => {
    const newPhotos: DiagnosticPhoto[] = []

    for (let i = 0; i < files.length && photos.length + newPhotos.length < 8; i++) {
      const file = files[i]
      
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue // 10MB max

      // Compression de l'image si nécessaire
      try {
        const compressedFile = await compressImage(file)
        
        const photo: DiagnosticPhoto = {
          id: `${Date.now()}-${i}`,
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
          name: file.name,
          description: ''
        }
        
        newPhotos.push(photo)
      } catch (error) {
        console.error('Erreur compression image:', error)
      }
    }

    setPhotos(prev => [...prev, ...newPhotos])
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        const maxWidth = 1200
        const maxHeight = 800
        
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, { 
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        }, 'image/jpeg', 0.8)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== photoId)
      const photoToRemove = prev.find(photo => photo.id === photoId)
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview)
      }
      return updated
    })
  }

  const updatePhotoDescription = (photoId: string, description: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, description } : photo
    ))
  }

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s: string) => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.urgency) {
      newErrors.urgency = 'Veuillez indiquer l\'urgence'
    }
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = 'Veuillez décrire le problème'
    }
    if (formData.symptoms.length === 0) {
      newErrors.symptoms = 'Sélectionnez au moins un symptôme'
    }
    if (photos.length === 0) {
      newErrors.photos = 'Ajoutez au moins une photo de diagnostic'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    // Convertir les photos en base64
    const photoData = await Promise.all(
      photos.map(async (photo) => {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(photo.file)
        })
        
        return {
          id: photo.id,
          data: base64,
          name: photo.name,
          description: photo.description
        }
      })
    )

    onUpdate({
      technicalData: formData,
      diagnosticPhotos: photoData
    })
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto`}>
          <Icon className={`h-8 w-8 ${config.color}`} />
        </div>
        <h3 className="text-2xl font-semibold">{config.title}</h3>
        <p className="text-muted-foreground">
          Aidez-nous à qualifier votre projet avec des photos et informations précises
        </p>
      </div>

      {/* Upload de photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Photos de diagnostic</span>
            <Badge variant="outline">Obligatoire</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">Ajoutez vos photos</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Glissez-déposez ou cliquez pour sélectionner (max 8 photos)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              {config.photoTips.map((tip, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />

          {errors.photos && (
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.photos}
            </p>
          )}

          {/* Grille des photos */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={photo.preview}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder="Description (optionnel)"
                    value={photo.description}
                    onChange={(e) => updatePhotoDescription(photo.id, e.target.value)}
                    className="w-full mt-2 px-2 py-1 text-xs border rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Qualification du problème */}
      <Card>
        <CardHeader>
          <CardTitle>Qualification du problème</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Urgence */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Urgence *</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Pas urgent', color: 'border-green-200 text-green-700' },
                { id: 'medium', label: 'Modéré', color: 'border-orange-200 text-orange-700' },
                { id: 'high', label: 'Urgent', color: 'border-red-200 text-red-700' }
              ].map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, urgency: level.id }))}
                  className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    formData.urgency === level.id 
                      ? `${level.color} bg-opacity-10` 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            {errors.urgency && <p className="text-sm text-red-500">{errors.urgency}</p>}
          </div>

          {/* Symptômes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Symptômes observés *</label>
            <div className="grid grid-cols-2 gap-2">
              {config.symptoms.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-3 border rounded-lg text-sm text-left transition-all ${
                    formData.symptoms.includes(symptom)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded border-2 mr-2 flex items-center justify-center ${
                      formData.symptoms.includes(symptom) ? 'border-primary bg-primary' : 'border-gray-300'
                    }`}>
                      {formData.symptoms.includes(symptom) && (
                        <CheckCircle className="h-3 w-3 text-white" />
                      )}
                    </div>
                    {symptom}
                  </div>
                </button>
              ))}
            </div>
            {errors.symptoms && <p className="text-sm text-red-500">{errors.symptoms}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description détaillée *</label>
            <textarea
              value={formData.problemDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, problemDescription: e.target.value }))}
              placeholder="Décrivez le problème en détail..."
              rows={4}
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.problemDescription && <p className="text-sm text-red-500">{errors.problemDescription}</p>}
          </div>

          {/* Accessibilité */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Accessibilité de la zone</label>
            <select
              value={formData.accessibility}
              onChange={(e) => setFormData(prev => ({ ...prev, accessibility: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionnez...</option>
              <option value="easy">Facile d'accès</option>
              <option value="moderate">Accès modéré</option>
              <option value="difficult">Accès difficile</option>
              <option value="very-difficult">Très difficile d'accès</option>
            </select>
          </div>

          {/* Budget estimé */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Budget estimé</label>
            <select
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionnez une fourchette...</option>
              <option value="0-700">Moins de 700$ CAD</option>
              <option value="700-2000">700$ - 2 000$ CAD</option>
              <option value="2000-7000">2 000$ - 7 000$ CAD</option>
              <option value="7000-20000">7 000$ - 20 000$ CAD</option>
              <option value="20000+">Plus de 20 000$ CAD</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          disabled={photos.length === 0}
        >
          Continuer avec le diagnostic
        </Button>
      </div>
    </div>
  )
}
