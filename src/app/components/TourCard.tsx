import { Star, Clock, MapPin } from 'lucide-react'
import { Badge } from './ui/badge'
import { Card, CardContent, CardFooter } from './ui/card'
import { Link } from 'react-router'
import type { TourListItem } from '../../lib/hooks/useTours'

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

interface TourCardProps {
  tour: TourListItem
}

export function TourCard({ tour }: TourCardProps) {
  const activeRates = (tour.tour_rates ?? []).filter(r => r.active)
  const minPrice = activeRates.length > 0
    ? Math.min(...activeRates.map(r => r.price))
    : null

  const image = tour.cover_image ?? (tour.images?.[0] ?? null)

  return (
    <Link to={`/tour/${tour.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full bg-[#33CCCC]/5 border-[#33CCCC]/20">
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={tour.title}
              className="w-full h-48 md:h-56 object-cover"
            />
          ) : (
            <div className="w-full h-48 md:h-56 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
          )}
          {tour.best_seller && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
              Best Seller
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{tour.location}</span>
          </div>

          <h3 className="font-semibold line-clamp-2">{tour.title}</h3>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{tour.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({tour.reviews_count})</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            {minPrice !== null ? (
              <>
                <span className="text-sm text-muted-foreground">Desde</span>
                <p className="text-2xl font-bold text-primary">{fmt(minPrice)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Consultar precio</p>
            )}
          </div>
          {tour.categories?.name && (
            <Badge variant="outline">{tour.categories.name}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
