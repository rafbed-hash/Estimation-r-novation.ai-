'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Home, Building2, Building } from 'lucide-react'

interface PropertyTypeStepProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}

export function PropertyTypeStep({ data, onUpdate, onNext }: PropertyTypeStepProps) {
  const [propertyType, setPropertyType] = useState<string>(data.house?.propertyType || '')
  const [error, setError] = useState<string>('')

  const types = [
    { id: 'detache', label: 'Maison détachée', icon: Home },
    { id: 'jumele', label: 'Maison jumelée', icon: Building2 },
    { id: 'appartement', label: 'Appartement', icon: Building }
  ]

  const submit = () => {
    if (!propertyType) {
      setError('Veuillez choisir un type de propriété')
      return
    }
    onUpdate({ house: { ...(data.house || {}), propertyType } })
    onNext()
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map(t => (
          <Card
            key={t.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              propertyType === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onClick={() => { setPropertyType(t.id); setError('') }}
          >
            <CardContent className="p-6 text-center space-y-2">
              <t.icon className={`h-8 w-8 mx-auto ${propertyType === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="font-medium">{t.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex justify-center">
        <Button onClick={submit} className="bg-primary text-primary-foreground">Continuer</Button>
      </div>
    </div>
  )
}
