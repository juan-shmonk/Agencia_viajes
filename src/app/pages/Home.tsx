import { Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { SearchBar } from '../components/SearchBar'
import { TourCard } from '../components/TourCard'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { useTours } from '../../lib/hooks/useTours'
import { useTestimonials } from '../../lib/hooks/useTestimonials'

export function Home() {
  const { data: tours, loading: toursLoading } = useTours({ active: true, limit: 6 })
  const { data: testimonials, loading: testimonialsLoading } = useTestimonials({ featured: true })

  return (
    <div className="pb-20 md:pb-8">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background px-4 pt-8 pb-12 md:pt-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Your Next
              <span className="block text-primary">Adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the world with curated tours designed for unforgettable experiences
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Tours</h2>
              <p className="text-muted-foreground">Our most popular experiences</p>
            </div>
            <Link to="/tours">
              <Button variant="ghost" className="hidden md:flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {toursLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : tours.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No hay tours disponibles por el momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/tours">
              <Button className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                View All Tours <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Why Choose Us</h2>
            <p className="text-muted-foreground">Experience the difference with our premium service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Best Price Guarantee', desc: 'We guarantee the best prices on all our tours with no hidden fees', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: '24/7 Support', desc: 'Our dedicated team is available around the clock to assist you', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { title: 'Expert Guides', desc: 'Professional local guides with deep knowledge and passion', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Travelers Say</h2>
            <p className="text-muted-foreground">Real experiences from real travelers</p>
          </div>

          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
            </div>
          ) : testimonials.length === 0 ? (
            null
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    {t.avatar_image ? (
                      <img src={t.avatar_image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-semibold text-lg">
                          {t.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{t.name}</h4>
                      {t.location && <p className="text-sm text-muted-foreground">{t.location}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{t.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of happy travelers and create memories that last a lifetime
          </p>
          <Link to="/tours">
            <Button size="lg" variant="secondary" className="text-primary">
              Explore All Tours <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
