'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Wrench, Zap, AlertTriangle } from "lucide-react"

interface PlumbingElectricalFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  projectType: 'plomberie' | 'electricite'
}

export function PlumbingElectricalForm({ data, onUpdate, onNext, projectType }: PlumbingElectricalFormProps) {
  const [formData, setFormData] = useState({
    problemDescription: data.project?.problemDescription || '',
    problemPhotos: data.project?.problemPhotos || [],
    urgencyLevel: data.project?.urgencyLevel || '',
    accessDetails: data.project?.accessDetails || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingPhotos, setUploadingPhotos] = useState(false)

  const problemTypes = {
    plomberie: [
      { id: 'fuite', label: 'Fuite d\'eau', icon: '💧' },
      { id: 'bouchon', label: 'Drain bouché', icon: '🚿' },
      { id: 'pression', label: 'Problème de pression', icon: '🔧' },
      { id: 'chauffe-eau', label: 'Chauffe-eau défaillant', icon: '🔥' },
      { id: 'toilette', label: 'Problème de toilette', icon: '🚽' },
      { id: 'autre-plomberie', label: 'Autre problème', icon: '⚠️' }
    ],
    electricite: [
      { id: 'panne', label: 'Panne électrique', icon: '⚡' },
      { id: 'disjoncteur', label: 'Disjoncteur qui saute', icon: '🔌' },
      { id: 'prise', label: 'Prise défectueuse', icon: '🔌' },
      { id: 'eclairage', label: 'Problème d\'éclairage', icon: '💡' },
      { id: 'installation', label: 'Nouvelle installation', icon: '🔧' },
      { id: 'autre-electricite', label: 'Autre problème', icon: '⚠️' }
    ]
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingPhotos(true)
    const newPhotos: Array<{id: number, url: string, file: File, name: string}> = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      // Créer une URL temporaire pour l'aperçu
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
      problemPhotos: [...prev.problemPhotos, ...newPhotos]
    }))
    setUploadingPhotos(false)
  }

  const removePhoto = (photoId: number) => {
    setFormData(prev => ({
      ...prev,
      problemPhotos: prev.problemPhotos.filter((photo: any) => photo.id !== photoId)
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

    if (!formData.problemDescription) {
      newErrors.problemDescription = 'Veuillez décrire le problème'
    }

    if (formData.problemPhotos.length === 0) {
      newErrors.problemPhotos = 'Au moins une photo du problème est requise'
    }

    if (!formData.urgencyLevel) {
      newErrors.urgencyLevel = 'Veuillez indiquer le niveau d\'urgence'
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

  const currentProblems = problemTypes[projectType]
  const icon = projectType === 'plomberie' ? Wrench : Zap
  const title = projectType === 'plomberie' ? 'Problème de plomberie' : 'Problème électrique'
  const IconComponent = icon

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">
          Décrivez votre problème et ajoutez des photos pour nous aider à mieux comprendre la situation.
        </p>
      </div>

      <div className="space-y-6">
        {/* Type de problème */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Type de problème *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentProblems.map((problem) => (
              <Card
                key={problem.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.problemDescription === problem.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('problemDescription', problem.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{problem.icon}</div>
                  <p className={`text-sm font-medium ${
                    formData.problemDescription === problem.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {problem.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.problemDescription && (
            <p className="text-sm text-red-500">{errors.problemDescription}</p>
          )}
        </div>

        {/* Upload photos du problème */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Photos du problème *
          </label>
          <p className="text-sm text-muted-foreground">
            Ajoutez des photos claires du problème pour nous aider à évaluer la situation
          </p>
          
          <div className="border-2 border-dashed border-border rounded-lg p-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="problem-photos"
            />
            <label
              htmlFor="problem-photos"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm font-medium">Cliquez pour ajouter des photos</span>
              <span className="text-xs text-muted-foreground">PNG, JPG jusqu'à 10MB chacune</span>
            </label>
          </div>

          {/* Aperçu des photos */}
          {formData.problemPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.problemPhotos.map((photo: any) => (
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
          
          {errors.problemPhotos && (
            <p className="text-sm text-red-500">{errors.problemPhotos}</p>
          )}
        </div>

        {/* Niveau d'urgence */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Niveau d'urgence *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'faible', label: 'Faible', desc: 'Peut attendre quelques semaines', color: 'green' },
              { id: 'moyen', label: 'Moyen', desc: 'À régler dans les prochains jours', color: 'yellow' },
              { id: 'urgent', label: 'Urgent', desc: 'Nécessite une intervention rapide', color: 'red' }
            ].map((urgency) => (
              <Card
                key={urgency.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.urgencyLevel === urgency.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleInputChange('urgencyLevel', urgency.id)}
              >
                <CardContent className="p-4 text-center">
                  <AlertTriangle className={`h-6 w-6 mx-auto mb-2 ${
                    urgency.color === 'red' ? 'text-red-500' :
                    urgency.color === 'yellow' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <p className={`font-medium text-sm ${
                    formData.urgencyLevel === urgency.id ? 'text-primary' : 'text-foreground'
                  }`}>
                    {urgency.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{urgency.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {errors.urgencyLevel && (
            <p className="text-sm text-red-500">{errors.urgencyLevel}</p>
          )}
        </div>

        {/* Détails d'accès */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Détails d'accès (optionnel)
          </label>
          <textarea
            value={formData.accessDetails}
            onChange={(e) => handleInputChange('accessDetails', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all border-border"
            placeholder="Ex: Sous-sol accessible par l'extérieur, compteur électrique dans le garage..."
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
