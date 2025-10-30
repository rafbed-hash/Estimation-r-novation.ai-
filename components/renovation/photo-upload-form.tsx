'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Camera, AlertCircle, Loader2 } from "lucide-react"
import { ImageCompressor } from "@/lib/utils/image-compression"

interface PhotoUploadFormProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

interface PhotoFile {
  id: string
  file: File
  preview: string
  name: string
  size: number
}

export function PhotoUploadForm({ data, onUpdate, onNext }: PhotoUploadFormProps) {
  const [photos, setPhotos] = useState<PhotoFile[]>(data.photos || [])
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCompressing, setIsCompressing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxFiles = 10
  const maxFileSize = 10 * 1024 * 1024 // 10MB
  const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  const handleFiles = async (files: FileList) => {
    setIsCompressing(true)
    const newPhotos: PhotoFile[] = []
    const currentCount = photos.length
    const filesToProcess: File[] = []

    // First pass: validate files
    for (let i = 0; i < files.length && currentCount + newPhotos.length < maxFiles; i++) {
      const file = files[i]

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, fileType: `Format non supporté: ${file.name}` }))
        continue
      }

      // Validate file size (before compression)
      if (file.size > maxFileSize) {
        console.log(`📸 Large file detected: ${file.name} (${ImageCompressor.formatFileSize(file.size)}) - will compress`)
      }

      filesToProcess.push(file)
    }

    try {
      // Compress images for better performance
      console.log('🗜️ Compressing images for optimal performance...')
      const compressedFiles = await ImageCompressor.compressMultipleImages(filesToProcess, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        maxSizeMB: 2
      })

      // Create PhotoFile objects from compressed files
      compressedFiles.forEach((file, i) => {
        const photoFile: PhotoFile = {
          id: `${Date.now()}-${i}`,
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        }
        newPhotos.push(photoFile)
      })

      if (newPhotos.length > 0) {
        setPhotos(prev => [...prev, ...newPhotos])
        setErrors({}) // Clear errors on successful upload
        console.log(`✅ Successfully processed ${newPhotos.length} photos`)
      }
    } catch (error) {
      console.error('❌ Error processing images:', error)
      setErrors(prev => ({ ...prev, compression: 'Erreur lors du traitement des images' }))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removePhoto = (photoId: string) => {
    setPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== photoId)
      // Revoke object URL to prevent memory leaks
      const photoToRemove = prev.find(photo => photo.id === photoId)
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview)
      }
      return updated
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (photos.length < 3) {
      newErrors.minPhotos = 'Veuillez télécharger au moins 3 photos de la pièce'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        console.log(`✅ Photo converted to base64: ${file.name} (${result.length} chars)`)
        resolve(result)
      }
      reader.onerror = error => {
        console.error(`❌ Error converting ${file.name} to base64:`, error)
        reject(error)
      }
    })
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('📸 Converting photos to base64...', photos.length, 'photos')
      
      // Convert photos to base64 for API with better error handling
      const base64Photos = []
      
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        try {
          console.log(`📸 Converting photo ${i + 1}/${photos.length}: ${photo.name}`)
          const base64 = await convertToBase64(photo.file)
          
          // Validate base64 format
          if (!base64.startsWith('data:image/')) {
            throw new Error('Invalid base64 format')
          }
          
          base64Photos.push(base64)
          console.log(`✅ Photo ${i + 1} converted successfully`)
          
        } catch (error) {
          console.error(`❌ Failed to convert photo ${i + 1}:`, error)
          // Skip this photo instead of using blob URL
          alert(`Erreur lors du traitement de la photo "${photo.name}". Elle sera ignorée.`)
          continue
        }
      }
      
      if (base64Photos.length === 0) {
        alert('Aucune photo n\'a pu être traitée. Veuillez réessayer.')
        return
      }
      
      console.log(`✅ Successfully converted ${base64Photos.length}/${photos.length} photos`)
      onUpdate({ photos: base64Photos })
      onNext()
    }
  }

  const selectedRoom = data.rooms?.[0] || 'la pièce sélectionnée'

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Camera className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Photos de {selectedRoom}</h3>
        <p className="text-muted-foreground">
          Téléchargez au moins 3 photos de la pièce sous différents angles. Plus vous fournissez de photos, 
          plus notre IA pourra créer une visualisation précise de votre rénovation.
        </p>
      </div>

      {(photos.length > 0 || isCompressing) && (
        <div className="text-center">
          {isCompressing ? (
            <Badge className="bg-blue-500 text-white flex items-center space-x-2 mx-auto w-fit">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Optimisation des images...</span>
            </Badge>
          ) : (
            <Badge className="bg-primary text-primary-foreground">
              {photos.length} photo{photos.length > 1 ? 's' : ''} téléchargée{photos.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      )}

      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
              dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">
                {dragActive ? 'Déposez vos photos ici' : 'Téléchargez vos photos'}
              </h4>
              <p className="text-muted-foreground">
                Glissez-déposez vos photos ou cliquez pour parcourir
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Formats acceptés: JPG, PNG, WebP • Max 10MB par photo • Max {maxFiles} photos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                {Object.values(errors).map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error}</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <Card key={photo.id} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={photo.preview}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      removePhoto(photo.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{photo.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(photo.size)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Conseils pour de meilleures photos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Prenez des photos sous différents angles (vue d'ensemble, détails, coins)</li>
                <li>• Assurez-vous d'avoir un bon éclairage naturel</li>
                <li>• Évitez les photos floues ou trop sombres</li>
                <li>• Incluez les éléments existants que vous souhaitez conserver</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-3"
          disabled={photos.length < 3}
        >
          Continuer avec {photos.length} photo{photos.length > 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  )
}
