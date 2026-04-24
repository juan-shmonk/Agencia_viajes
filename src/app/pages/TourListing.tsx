import { useState } from 'react'
import { Filter } from 'lucide-react'
import { SearchBar } from '../components/SearchBar'
import { TourCard } from '../components/TourCard'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { useTours } from '../../lib/hooks/useTours'
import { useCategories } from '../../lib/hooks/useCategories'

export function TourListing() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  const { data: categories } = useCategories()
  const { data: tours, loading } = useTours({
    active: true,
    category_id: selectedCategoryId ?? undefined,
  })

  const selectedName = categories.find(c => c.id === selectedCategoryId)?.name

  return (
    <div className="pb-20 md:pb-8">
      <div className="bg-gradient-to-br from-primary/10 to-background px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Explorar Tours</h1>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold">Categorías</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryId === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategoryId(null)}
              className={selectedCategoryId === null ? 'bg-primary hover:bg-primary/90' : ''}
            >
              Todos
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={selectedCategoryId === cat.id ? 'bg-primary hover:bg-primary/90' : ''}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {tours.length} {tours.length === 1 ? 'tour' : 'tours'}
              {selectedName && ` en ${selectedName}`}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron tours. Intenta ajustar los filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
        )}
      </div>
    </div>
  )
}
