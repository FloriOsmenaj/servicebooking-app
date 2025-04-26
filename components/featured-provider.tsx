import Link from "next/link"
import Image from "next/image"
import { MapPin, Star } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeaturedProviderProps {
  name: string
  category: string
  rating: number
  reviewCount: number
  location: string
  image: string
  href: string
}

export function FeaturedProvider({
  name,
  category,
  rating,
  reviewCount,
  location,
  image,
  href,
}: FeaturedProviderProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-sm">
          <Star className="h-3 w-3 fill-booksy-500 text-booksy-500" />
          {rating} ({reviewCount})
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{category}</p>
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={href} className="w-full">
          <Button variant="outline" className="w-full border-salon-600 text-salon-600 hover:bg-salon-50">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
