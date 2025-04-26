import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeaturedProvider } from "@/components/featured-provider"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch the category data based on the slug
  const category = {
    id: params.slug,
    title: params.slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    description: "Find and book the best service providers in your area.",
    providers: [
      {
        name: "Style Studio",
        category: "Hair Salon",
        rating: 4.9,
        reviewCount: 124,
        location: "Downtown",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/style-studio",
      },
      {
        name: "Gentlemen's Cut",
        category: "Barber Shop",
        rating: 4.8,
        reviewCount: 98,
        location: "Westside",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/gentlemens-cut",
      },
      {
        name: "Nail Artistry",
        category: "Nail Salon",
        rating: 4.7,
        reviewCount: 86,
        location: "Midtown",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/nail-artistry",
      },
      {
        name: "Tranquil Spa",
        category: "Spa & Massage",
        rating: 4.9,
        reviewCount: 112,
        location: "Riverside",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/tranquil-spa",
      },
      {
        name: "Beauty Lounge",
        category: "Beauty Salon",
        rating: 4.6,
        reviewCount: 74,
        location: "Uptown",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/beauty-lounge",
      },
      {
        name: "Ink Masters",
        category: "Tattoo Studio",
        rating: 4.8,
        reviewCount: 92,
        location: "Arts District",
        image: "/placeholder.svg?height=300&width=300",
        href: "/providers/ink-masters",
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-medium mb-6">
        <ChevronLeft className="h-4 w-4" />
        Back to categories
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{category.title}</h1>
          <p className="text-muted-foreground mt-2">{category.description}</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search providers..." className="w-full pl-8" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2">
              <option value="rating">Sort by: Rating</option>
              <option value="reviews">Sort by: Reviews</option>
              <option value="distance">Sort by: Distance</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {category.providers.map((provider, index) => (
            <FeaturedProvider
              key={index}
              name={provider.name}
              category={provider.category}
              rating={provider.rating}
              reviewCount={provider.reviewCount}
              location={provider.location}
              image={provider.image}
              href={provider.href}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
