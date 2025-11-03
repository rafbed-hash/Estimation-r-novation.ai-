'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Calculator } from "lucide-react"

interface Piece {
  nom: string
  longueur: number | string
  largeur: number | string
  hauteur?: number | string
}

interface DimensionFieldsProps {
  pieces: Piece[]
  onChange: (pieces: Piece[]) => void
  errors?: Record<string, any>
}

export function DimensionFields({ pieces, onChange, errors }: DimensionFieldsProps) {
  const addPiece = () => {
    const newPiece: Piece = {
      nom: '',
      longueur: '',
      largeur: '',
      hauteur: 8
    }
    onChange([...pieces, newPiece])
  }

  const removePiece = (index: number) => {
    const newPieces = pieces.filter((_, i) => i !== index)
    onChange(newPieces)
  }

  const updatePiece = (index: number, field: keyof Piece, value: string | number) => {
    const newPieces = [...pieces]
    newPieces[index] = { ...newPieces[index], [field]: value }
    onChange(newPieces)
  }

  const calculateSuperficie = (longueur: number | string, largeur: number | string): string => {
    const l = typeof longueur === 'string' ? parseFloat(longueur) : longueur
    const w = typeof largeur === 'string' ? parseFloat(largeur) : largeur
    
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) {
      return '—'
    }
    
    return `${(l * w).toFixed(1)} pi²`
  }

  const getTotalSuperficie = (): string => {
    let total = 0
    let hasValidPieces = false

    pieces.forEach(piece => {
      const l = typeof piece.longueur === 'string' ? parseFloat(piece.longueur) : piece.longueur
      const w = typeof piece.largeur === 'string' ? parseFloat(piece.largeur) : piece.largeur
      
      if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
        total += l * w
        hasValidPieces = true
      }
    })

    return hasValidPieces ? `${total.toFixed(1)} pi²` : '—'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Dimensions des pièces</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Ajoutez les dimensions de chaque pièce à rénover
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPiece}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter une pièce</span>
        </Button>
      </div>

      {pieces.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Cliquez sur « Ajouter une pièce » pour commencer
            </p>
          </CardContent>
        </Card>
      )}

      {pieces.map((piece, index) => (
        <Card key={index} className="relative">
          <CardContent className="p-6">
            {pieces.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                onClick={() => removePiece(index)}
                aria-label="Retirer cette pièce"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <div className="space-y-4">
              {/* Nom de la pièce */}
              <div>
                <Label htmlFor={`piece-nom-${index}`} className="text-sm font-medium">
                  Nom de la pièce <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`piece-nom-${index}`}
                  placeholder="ex. Salle de bain principale"
                  value={piece.nom}
                  onChange={(e) => updatePiece(index, 'nom', e.target.value)}
                  className={errors?.[`pieces.${index}.nom`] ? 'border-destructive' : ''}
                />
                {errors?.[`pieces.${index}.nom`] && (
                  <p className="mt-1 text-sm text-destructive">
                    {errors[`pieces.${index}.nom`]}
                  </p>
                )}
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`piece-longueur-${index}`} className="text-sm font-medium">
                    Longueur (pi) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`piece-longueur-${index}`}
                    type="number"
                    step="0.1"
                    placeholder="12"
                    value={piece.longueur}
                    onChange={(e) => updatePiece(index, 'longueur', e.target.value)}
                    className={errors?.[`pieces.${index}.longueur`] ? 'border-destructive' : ''}
                  />
                  {errors?.[`pieces.${index}.longueur`] && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors[`pieces.${index}.longueur`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`piece-largeur-${index}`} className="text-sm font-medium">
                    Largeur (pi) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`piece-largeur-${index}`}
                    type="number"
                    step="0.1"
                    placeholder="10"
                    value={piece.largeur}
                    onChange={(e) => updatePiece(index, 'largeur', e.target.value)}
                    className={errors?.[`pieces.${index}.largeur`] ? 'border-destructive' : ''}
                  />
                  {errors?.[`pieces.${index}.largeur`] && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors[`pieces.${index}.largeur`]}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`piece-hauteur-${index}`} className="text-sm font-medium">
                    Hauteur (pi)
                  </Label>
                  <Input
                    id={`piece-hauteur-${index}`}
                    type="number"
                    step="0.1"
                    placeholder="8"
                    value={piece.hauteur || ''}
                    onChange={(e) => updatePiece(index, 'hauteur', e.target.value)}
                  />
                </div>
              </div>

              {/* Calcul superficie */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Superficie de cette pièce :
                </span>
                <span className="text-sm font-medium text-primary">
                  {calculateSuperficie(piece.longueur, piece.largeur)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Total superficie */}
      {pieces.length > 1 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">
                Superficie totale du projet :
              </span>
              <span className="text-lg font-bold text-primary">
                {getTotalSuperficie()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
