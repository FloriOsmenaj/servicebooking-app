import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceCard } from "@/components/service-card"
import { CategoryCard } from "@/components/category-card"
import { FeaturedProvider } from "@/components/featured-provider"
import { NavBar } from "@/components/nav-bar"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 hero-gradient text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Book services with ease
                  </h1>
                  <p className="max-w-[600px] text-white/80 md:text-xl">
                    Discover and book appointments with top local service providers. Hair, beauty, wellness, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div className="flex-1">
                    <Input placeholder="What are you looking for?" className="w-full bg-white/90" />
                  </div>
                  <div className="flex-1">
                    <Input placeholder="Location" className="w-full bg-white/90" />
                  </div>
                  <Button size="lg" className="gap-2 bg-white text-booksy-600 hover:bg-white/90">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  width={400}
                  height={400}
                  alt="Hero image of a salon"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Categories</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Explore our most popular service categories
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-4">
              <CategoryCard title="Hair Salon" icon="scissors" count={240} href="/categories/hair-salon" />
              <CategoryCard title="Barber Shop" icon="scissors" count={186} href="/categories/barber-shop" />
              <CategoryCard title="Nail Salon" icon="paintBucket" count={152} href="/categories/nail-salon" />
              <CategoryCard title="Spa & Massage" icon="sparkles" count={124} href="/categories/spa-massage" />
              <CategoryCard title="Beauty Salon" icon="heart" count={98} href="/categories/beauty-salon" />
              <CategoryCard title="Tattoo Studio" icon="pen" count={76} href="/categories/tattoo-studio" />
              <CategoryCard title="Fitness" icon="dumbbell" count={64} href="/categories/fitness" />
              <CategoryCard title="Medical" icon="stethoscope" count={52} href="/categories/medical" />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Providers</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Top-rated service providers in your area
                </p>
              </div>
            </div>
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              <FeaturedProvider
                name="Style Studio"
                category="Hair Salon"
                rating={4.9}
                reviewCount={124}
                location="Downtown"
                image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/style-studio"
              />
              <FeaturedProvider
                name="Gentlemen's Cut"
                category="Barber Shop"
                rating={4.8}
                reviewCount={98}
                location="Westside"
                image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/gentlemens-cut"
              />
              <FeaturedProvider
                name="Nail Artistry"
                category="Nail Salon"
                rating={4.7}
                reviewCount={86}
                location="Midtown"
                image="https://images.unsplash.com/photo-1610992015732-2449b76344bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/nail-artistry"
              />
              <FeaturedProvider
                name="Tranquil Spa"
                category="Spa & Massage"
                rating={4.9}
                reviewCount={112}
                location="Riverside"
                image="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/tranquil-spa"
              />
              <FeaturedProvider
                name="Beauty Lounge"
                category="Beauty Salon"
                rating={4.6}
                reviewCount={74}
                location="Uptown"
                image="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/beauty-lounge"
              />
              <FeaturedProvider
                name="Ink Masters"
                category="Tattoo Studio"
                rating={4.8}
                reviewCount={92}
                location="Arts District"
                image="https://images.unsplash.com/photo-1581309553233-52c834205822?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                href="/providers/ink-masters"
              />
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/providers">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-booksy-600 text-booksy-600 hover:bg-booksy-50"
                >
                  View all providers
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Services</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Most booked services on our platform
                </p>
              </div>
            </div>
            <Tabs defaultValue="hair" className="mt-8">
              <TabsList className="grid w-full grid-cols-4 md:w-auto bg-muted/50">
                <TabsTrigger value="hair" className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white">
                  Hair
                </TabsTrigger>
                <TabsTrigger value="nails" className="data-[state=active]:bg-salon-600 data-[state=active]:text-white">
                  Nails
                </TabsTrigger>
                <TabsTrigger value="spa" className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white">
                  Spa
                </TabsTrigger>
                <TabsTrigger value="beauty" className="data-[state=active]:bg-salon-600 data-[state=active]:text-white">
                  Beauty
                </TabsTrigger>
              </TabsList>
              <TabsContent value="hair" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ServiceCard
                    title="Haircut & Styling"
                    provider="Style Studio"
                    price={45}
                    duration={60}
                    rating={4.9}
                    reviewCount={124}
                    image="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/haircut-styling"
                  />
                  <ServiceCard
                    title="Color & Highlights"
                    provider="Beauty Lounge"
                    price={85}
                    duration={120}
                    rating={4.8}
                    reviewCount={98}
                    image="https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/color-highlights"
                  />
                  <ServiceCard
                    title="Men's Haircut"
                    provider="Gentlemen's Cut"
                    price={35}
                    duration={45}
                    rating={4.7}
                    reviewCount={86}
                    image="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/mens-haircut"
                  />
                </div>
              </TabsContent>
              <TabsContent value="nails" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ServiceCard
                    title="Manicure"
                    provider="Nail Artistry"
                    price={35}
                    duration={45}
                    rating={4.8}
                    reviewCount={92}
                    image="https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/manicure"
                  />
                  <ServiceCard
                    title="Pedicure"
                    provider="Nail Artistry"
                    price={45}
                    duration={60}
                    rating={4.9}
                    reviewCount={78}
                    image="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/pedicure"
                  />
                  <ServiceCard
                    title="Gel Nails"
                    provider="Beauty Lounge"
                    price={55}
                    duration={75}
                    rating={4.7}
                    reviewCount={64}
                    image="https://images.unsplash.com/photo-1610992015732-2449b76344bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/gel-nails"
                  />
                </div>
              </TabsContent>
              <TabsContent value="spa" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ServiceCard
                    title="Swedish Massage"
                    provider="Tranquil Spa"
                    price={75}
                    duration={60}
                    rating={4.9}
                    reviewCount={112}
                    image="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/swedish-massage"
                  />
                  <ServiceCard
                    title="Deep Tissue Massage"
                    provider="Tranquil Spa"
                    price={85}
                    duration={60}
                    rating={4.8}
                    reviewCount={96}
                    image="https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/deep-tissue-massage"
                  />
                  <ServiceCard
                    title="Hot Stone Massage"
                    provider="Wellness Center"
                    price={95}
                    duration={90}
                    rating={4.9}
                    reviewCount={84}
                    image="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/hot-stone-massage"
                  />
                </div>
              </TabsContent>
              <TabsContent value="beauty" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ServiceCard
                    title="Facial Treatment"
                    provider="Beauty Lounge"
                    price={65}
                    duration={60}
                    rating={4.8}
                    reviewCount={74}
                    image="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/facial-treatment"
                  />
                  <ServiceCard
                    title="Makeup Application"
                    provider="Beauty Lounge"
                    price={55}
                    duration={45}
                    rating={4.7}
                    reviewCount={68}
                    image="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/makeup-application"
                  />
                  <ServiceCard
                    title="Eyebrow Shaping"
                    provider="Style Studio"
                    price={25}
                    duration={30}
                    rating={4.6}
                    reviewCount={62}
                    image="https://images.unsplash.com/photo-1594742248364-39a73c51ec12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    href="/services/eyebrow-shaping"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  width={400}
                  height={400}
                  alt="App screenshot on mobile phone"
                  className="rounded-lg object-cover shadow-lg"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Download our app</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                    Book appointments on the go, get reminders, and manage your bookings with our mobile app.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="gap-2 bg-booksy-600 hover:bg-booksy-700">
                    Download for iOS
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 border-salon-600 text-salon-600 hover:bg-salon-50"
                  >
                    Download for Android
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-booksy-600 to-salon-600 bg-clip-text text-transparent">
                Booksy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">Book appointments with top local service providers.</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                About
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Careers
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Press
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Help</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Support
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                FAQ
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Cookies
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Social</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Twitter
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Instagram
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-booksy-600">
                Facebook
              </Link>
            </div>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-xs text-muted-foreground">© 2023 Booksy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground hover:text-booksy-600">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-booksy-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
