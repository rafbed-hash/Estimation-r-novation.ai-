// Image compression utility for better performance on Vercel
// Reduces image size before base64 conversion to prevent timeouts

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

export class ImageCompressor {
  static async compressImage(
    file: File, 
    options: CompressionOptions = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      maxSizeMB = 2
    } = options

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width *= ratio
            height *= ratio
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'))
                return
              }

              // Check if compressed size is acceptable
              const compressedSizeMB = blob.size / (1024 * 1024)
              
              if (compressedSizeMB > maxSizeMB) {
                console.warn(`⚠️ Compressed image still large: ${compressedSizeMB.toFixed(2)}MB`)
              }

              // Create new File object
              const compressedFile = new File(
                [blob], 
                file.name, 
                { 
                  type: blob.type,
                  lastModified: Date.now()
                }
              )

              console.log(`✅ Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`)
              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Failed to load image for compression'))
      }

      img.src = URL.createObjectURL(file)
    })
  }

  static async compressMultipleImages(
    files: File[],
    options?: CompressionOptions
  ): Promise<File[]> {
    const compressed = []
    
    for (let i = 0; i < files.length; i++) {
      try {
        console.log(`🗜️ Compressing image ${i + 1}/${files.length}: ${files[i].name}`)
        const compressedFile = await this.compressImage(files[i], options)
        compressed.push(compressedFile)
      } catch (error) {
        console.error(`❌ Failed to compress ${files[i].name}:`, error)
        // Keep original file if compression fails
        compressed.push(files[i])
      }
    }

    return compressed
  }

  static getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        reject(new Error('Failed to get image dimensions'))
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}
