import Link from "next/link"
import Image from "next/image"
import { CalendarDays, ChevronLeft, Clock, Globe, MapPin, Phone, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProviderPage({ params }: { params: { slug: string } }) {
  // In a real app, you would fetch the provider data based on the slug
  const provider = {
    id: "1",
    name: "Style Studio",
    category: "Hair Salon",
    description:
      "Style Studio is a premium hair salon offering a wide range of services including haircuts, coloring, styling, and treatments. Our team of experienced stylists is dedicated to helping you look and feel your best.",
    rating: 4.9,
    reviewCount: 124,
    location: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    website: "www.stylestudio.com",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ],
    services: [
      {
        id: "1",
        title: "Haircut & Styling",
        price: 45,
        duration: 60,
        description: "Professional haircut and styling tailored to your preferences and face shape.",
      },
      {
        id: "2",
        title: "Color & Highlights",
        price: 85,
        duration: 120,
        description: "Full color or highlights to enhance your look with premium products.",
      },
      {
        id: "3",
        title: "Blowout",
        price: 35,
        duration: 45,
        description: "Professional blow dry and styling for a polished look.",
      },
      {
        id: "4",
        title: "Hair Treatment",
        price: 55,
        duration: 60,
        description: "Deep conditioning treatment to repair and nourish your hair.",
      },
    ],
    reviews: [
      {
        id: "1",
        user: "Sarah M.",
        rating: 5,
        date: "2 weeks ago",
        comment:
          "Amazing service! My stylist was very attentive and gave me exactly what I wanted. Will definitely be back!",
      },
      {
        id: "2",
        user: "Michael T.",
        rating: 5,
        date: "1 month ago",
        comment: "Great experience from start to finish. The salon is beautiful and my haircut looks fantastic.",
      },
      {
        id: "3",
        user: "Jennifer L.",
        rating: 4,
        date: "1 month ago",
        comment:
          "Very professional service. The only reason I'm not giving 5 stars is because I had to wait a bit past my appointment time.",
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Link
        href="/providers"
        className="inline-flex items-center gap-1 text-sm font-medium mb-6 text-booksy-600 hover:text-booksy-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to providers
      </Link>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="grid gap-6">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={provider.image || "/placeholder.svg"}
                alt={provider.name}
                width={800}
                height={400}
                className="w-full h-64 object-cover"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{provider.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-booksy-500 text-booksy-500" />
                    <span className="ml-1 font-medium">{provider.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{provider.category}</span>
                </div>
              </div>

              <p className="text-muted-foreground">{provider.description}</p>

              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-booksy-500" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-booksy-500" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-booksy-500" />
                  <span>{provider.website}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {provider.gallery.map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="services" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white"
              >
                Services
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-salon-600 data-[state=active]:text-white">
                Reviews
              </TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="mt-6">
              <div className="space-y-4">
                {provider.services.map((service) => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-booksy-500" />
                            <span>{service.duration} min</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-booksy-700">${service.price}</div>
                          <Button size="sm" className="mt-2 gap-1 bg-booksy-600 hover:bg-booksy-700">
                            <CalendarDays className="h-4 w-4" />
                            Book
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                {provider.reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="font-semibold">{review.user}</div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "fill-booksy-500 text-booksy-500" : "text-muted"}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-24 shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Select Service</label>
                  <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-booksy-500 focus:border-booksy-500">
                    <option value="">Select a service</option>
                    {provider.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title} - ${service.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-booksy-500 focus:border-booksy-500"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      9:00 AM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      10:00 AM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      11:00 AM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      1:00 PM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      2:00 PM
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-center hover:bg-booksy-50 hover:text-booksy-700 hover:border-booksy-500"
                    >
                      3:00 PM
                    </Button>
                  </div>
                </div>

                <Button className="w-full gap-2 bg-booksy-600 hover:bg-booksy-700">
                  <CalendarDays className="h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
