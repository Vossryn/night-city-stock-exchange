import {
  Building2,
  Car,
  CircuitBoard,
  Cpu,
  Crosshair,
  Landmark,
  Truck,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface CompanyLogoProps {
  image?: string
  name: string
  types: Array<string>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
}

const ICON_SIZE_CLASSES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
}

function getIconForTypes(types: Array<string>) {
  const typesLower = types.map((t) => t.toLowerCase())

  // Taxi company -> Car icon
  if (typesLower.some((t) => t.includes('taxi'))) {
    return Car
  }

  // Vehicle manufacturer -> Truck icon
  if (typesLower.some((t) => t.includes('vehicle'))) {
    return Truck
  }

  // Weapons/Arms Manufacturer -> Crosshair icon
  if (typesLower.some((t) => t.includes('weapon') || t.includes('arms'))) {
    return Crosshair
  }

  // Banking -> Landmark icon
  if (
    typesLower.some((t) => t.includes('banking') || t.includes('insurance'))
  ) {
    return Landmark
  }

  // Cyberware -> CircuitBoard icon
  if (
    typesLower.some((t) => t.includes('cyberware') || t.includes('cybernetic'))
  ) {
    return CircuitBoard
  }

  // Electronics -> Cpu icon
  if (typesLower.some((t) => t.includes('electronics'))) {
    return Cpu
  }

  // Default -> Building2 icon
  return Building2
}

export function CompanyLogo({
  image,
  name,
  types,
  size = 'md',
  className,
}: CompanyLogoProps) {
  const sizeClass = SIZE_CLASSES[size]
  const iconSizeClass = ICON_SIZE_CLASSES[size]

  // If image exists and is not empty, show image
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn(sizeClass, 'object-contain', className)}
      />
    )
  }

  // Fallback to icon
  const IconComponent = getIconForTypes(types)

  return (
    <div
      className={cn(
        sizeClass,
        'flex items-center justify-center rounded border border-cyan-500/50 bg-black/50 shadow-[0_0_8px_rgba(0,255,255,0.3)]',
        className,
      )}
    >
      <IconComponent className={cn(iconSizeClass, 'text-cyan-400')} />
    </div>
  )
}
