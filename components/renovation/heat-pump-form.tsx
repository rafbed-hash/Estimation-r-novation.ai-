'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Thermometer, Home, Zap } from "lucide-react"

interface HeatPumpFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function HeatPumpForm({ data, onUpdate, onNext }: HeatPumpFormProps) {
  const [formData, setFormData] = useState({
    installationType: data.project?.installationType || '',
    wallPhotos: data.project?.wallPhotos || [],
    currentHeating: data.project?.currentHeating || '',
    homeSize: data.project?.homeSize || '',
    installationPreferences: data.project?.installationPreferences || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const installationTypes = [
    { id: 'murale', label: 'Thermopompe murale', icon: '🏠', desc: 'Installation sur mur intérieur' },
    { id: 'centrale', label: 'Système central', icon: '🏢', desc: 'Système pour toute la maison' },
    { id: 'portable', label: 'Unité portable', icon: '📦', desc: 'Solution temporaire ou d\'appoint' }
  ]

  const currentHeatingSystems = [
    { id: 'electrique', label: 'Chauffage électrique', icon: '⚡' },
    { id: 'gaz', label: 'Chauffage au gaz', icon: '🔥' },
    { id: 'mazout', label: 'Chauffage au mazout', icon: '🛢️' },
    { id: 'bois', label: 'Chauffage au bois', icon: '🪵' },
    { id: 'aucun', label: 'Aucun système', icon: '❄️' }
  ]

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
      wallPhotos: [...prev.wallPhotos, ...newPhotos]
    }))
    setUploadingPhotos(false)
  }

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      wallPhotos: prev.wallPhotos.filter((photo: any) => photo.id !== photoId)
    }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.installationType) {
      newErrors.installationType = 'Veuillez sélectionner le type d\'installation'
    }

    if (formData.wallPhotos.length === 0) {
      newErrors.wallPhotos = 'Au moins une photo du mur d\'installation est requise'
    }

    if (!formData.currentHeating) {
      newErrors.currentHeating = 'Veuillez indiquer votre système de chauffage actuel'
    }

    if (!formData.homeSize) {
      newErrors.homeSize = 'Veuillez indiquer la superficie à chauffer'
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
          <Thermometer className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Installation de thermopompe</h3>
        <p className="text-muted-foreground">
          Aidez-nous à planifier l'installation de votre thermopompe en nous montrant l'espace disponible.
        </p>
      </div>

      <div className="space-y-6">
        {/* Type d'installation */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Type d'installation souhaité *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {installationTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.installationType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('installationType', type.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <p className={`font-medium text-sm mb-1 ${
                    formData.installationType === type.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.installationType && (
            <p className="text-sm text-red-500">{errors.installationType}</p>
          )}
        </div>

        {/* Photos du mur d'installation */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Photos du mur d'installation *
          </label>
          <p className="text-sm text-muted-foreground">
            Montrez-nous le mur où vous souhaitez installer la thermopompe (intérieur et extérieur si possible)
          </p>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="wall-photos"
            />
            <label
              htmlFor="wall-photos"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Cliquez pour ajouter des photos</span>
              <span className="text-xs text-muted-foreground">PNG, JPG jusqu'à 10MB chacune</span>
            </label>
          </div>

          {/* Aperçu des photos */}
          {formData.wallPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.wallPhotos.map((photo: any) => (
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
          
          {errors.wallPhotos && (
            <p className="text-sm text-red-500">{errors.wallPhotos}</p>
          )}
        </div>

        {/* Système de chauffage actuel */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Système de chauffage actuel *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentHeatingSystems.map((system) => (
              <Card
                key={system.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.currentHeating === system.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('currentHeating', system.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{system.icon}</div>
                  <p className={`text-sm font-medium ${
                    formData.currentHeating === system.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {system.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.currentHeating && (
            <p className="text-sm text-red-500">{errors.currentHeating}</p>
          )}
        </div>

        {/* Superficie à chauffer */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Superficie à chauffer (pi²) *
          </label>
          <input
            type="number"
            value={formData.homeSize}
            onChange={(e) => handleInputChange('homeSize', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
              errors.homeSize ? 'border-red-500' : 'border-border'
            }`}
            placeholder="Ex: 1200"
          />
          {errors.homeSize && (
            <p className="text-sm text-red-500">{errors.homeSize}</p>
          )}
        </div>

        {/* Préférences d'installation */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Préférences d'installation (optionnel)
          </label>
          <textarea
            value={formData.installationPreferences}
            onChange={(e) => handleInputChange('installationPreferences', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-border"
            placeholder="Ex: Préférence pour une installation discrète, contraintes d'accès, etc."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          disabled={uploadingPhotos}
        >
          {uploadingPhotos ? 'Upload en cours...' : 'Continuer'}
        </Button>
      </div>
    </div>
  )
}
