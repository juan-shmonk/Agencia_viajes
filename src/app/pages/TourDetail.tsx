import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, Star, Clock, MapPin, Check } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { useTour } from '../../lib/hooks/useTours'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function TourDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: tour, loading, error } = useTour(id)
  const [selectedImage, setSelectedImage] = useState(0)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour no encontrado</h2>
          <Link to="/tours">
            <Button>Volver a tours</Button>
          </Link>
        </div>
      </div>
    )
  }

  const activeRates = tour.tour_rates.filter(r => r.active)
  const minPrice = activeRates.length > 0
    ? Math.min(...activeRates.map(r => r.price))
    : null

  const images = tour.images ?? []
  const displayImage = images[selectedImage] ?? tour.cover_image ?? null
  const sortedItinerary = [...(tour.tour_itinerary ?? [])].sort((a, b) => a.day - b.day)

  return (
    <div className="pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/tours">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
          </Link>
          {minPrice !== null && (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Desde</p>
                <p className="text-2xl font-bold text-primary">{fmt(minPrice)}</p>
              </div>
              <Link to={`/checkout/${tour.id}`}>
                <Button className="bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                  Reservar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt={tour.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}
            {tour.best_seller && (
              <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                Best Seller
              </Badge>
            )}
          </div>
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedImage === i ? 'ring-2 ring-primary' : 'hover:opacity-80'
                  }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt={`${tour.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Info principal */}
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-5 h-5" />
                <span>{tour.location}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tour.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{tour.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({tour.reviews_count} reseñas)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{tour.duration}</span>
                </div>
                {tour.categories?.name && <Badge variant="outline">{tour.categories.name}</Badge>}
              </div>
              {tour.description && (
                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              )}
            </div>

            {/* Tarifas */}
            {activeRates.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Tarifas</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {activeRates.map(rate => (
                    <div key={rate.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{rate.name}</h3>
                          {rate.description && (
                            <p className="text-sm text-muted-foreground mt-1">{rate.description}</p>
                          )}
                        </div>
                        <p className="text-xl font-bold text-primary ml-4">{fmt(rate.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qué incluye */}
            {tour.included.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Qué incluye</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.included.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerario */}
            {sortedItinerary.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Itinerario</h2>
                <div className="space-y-6">
                  {sortedItinerary.map(day => (
                    <div key={day.id} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">D{day.day}</span>
                        </div>
                      </div>
                      <div className="flex-1 pb-6 border-l-2 border-border pl-6 -ml-6">
                        <h3 className="font-semibold mb-2">{day.title}</h3>
                        <p className="text-muted-foreground">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden md:block">
            <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-4">
              {minPrice !== null && (
                <div className="text-center pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-1">Precio desde</p>
                  <p className="text-4xl font-bold text-primary">{fmt(minPrice)}</p>
                </div>
              )}
              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duración</span>
                  <span className="font-medium">{tour.duration}</span>
                </div>
                {tour.categories?.name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Categoría</span>
                    <span className="font-medium">{tour.categories.name}</span>
                  </div>
                )}
              </div>
              <Link to={`/checkout/${tour.id}`}>
                <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                  Reservar ahora
                </Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Cancelación gratuita hasta 24 horas antes del tour
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA móvil fijo */}
      {minPrice !== null && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Desde</p>
              <p className="text-2xl font-bold text-primary">{fmt(minPrice)}</p>
            </div>
            <Link to={`/checkout/${tour.id}`} className="flex-1">
              <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                Reservar
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
