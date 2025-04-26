import Link from "next/link"
import { Dumbbell, Heart, PaintBucket, Pen, Scissors, Sparkles, Stethoscope } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  title: string
  icon: string
  count: number
  href: string
}

export function CategoryCard({ title, icon, count, href }: CategoryCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "scissors":
        return <Scissors className="h-6 w-6" />
      case "paintBucket":
        return <PaintBucket className="h-6 w-6" />
      case "sparkles":
        return <Sparkles className="h-6 w-6" />
      case "heart":
        return <Heart className="h-6 w-6" />
      case "pen":
        return <Pen className="h-6 w-6" />
      case "dumbbell":
        return <Dumbbell className="h-6 w-6" />
      case "stethoscope":
        return <Stethoscope className="h-6 w-6" />
      default:
        return <Scissors className="h-6 w-6" />
    }
  }

  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:bg-muted/50">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="rounded-full bg-gradient-to-br from-booksy-100 to-salon-100 p-3 mb-3">
            <div className="text-booksy-600">{getIcon(icon)}</div>
          </div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{count} providers</p>
        </CardContent>
      </Card>
    </Link>
  )
}
