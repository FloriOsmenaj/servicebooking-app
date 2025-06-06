import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  provider: string
  price: number
  duration: number
  rating: number
  reviewCount: number
  image: string
  href: string
}

export function ServiceCard({ title, provider, price, duration, rating, reviewCount, image, href }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
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
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{provider}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{duration} min</span>
            </div>
            <div className="font-semibold text-booksy-700">${price}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={href} className="w-full">
          <Button className="w-full gap-2 bg-booksy-600 hover:bg-booksy-700">
            <CalendarDays className="h-4 w-4" />
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
