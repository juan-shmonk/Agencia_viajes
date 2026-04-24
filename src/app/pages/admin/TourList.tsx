import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { useTours, toggleTourActive, type TourListItem } from '../../../lib/hooks/useTours'
import { useCategories } from '../../../lib/hooks/useCategories'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'

export function TourList() {
  const navigate = useNavigate()
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [tourToDeactivate, setTourToDeactivate] = useState<TourListItem | null>(null)

  const activeFilter =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined

  const { data: tours, loading, error, reload } = useTours({
    category_id: categoryFilter || undefined,
    active: activeFilter,
  })

  const { data: categories } = useCategories()

  async function handleToggleActive(tour: TourListItem, newActive: boolean) {
    setTourToDeactivate(null)
    try {
      await toggleTourActive(tour.id, newActive)
      toast.success(newActive ? 'Tour activado' : 'Tour desactivado')
      reload()
    } catch (e) {
      console.error('toggleTourActive:', e)
      toast.error('No se pudo cambiar el estado del tour.')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? '...' : `${tours.length} tour${tours.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/tours/new')}>
          <Plus size={16} className="mr-1" />
          Nuevo tour
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {error && (
          <div className="p-6 text-center text-red-500 text-sm">
            {error}
            <button onClick={reload} className="ml-2 underline">Reintentar</button>
          </div>
        )}

        {loading && !error && (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!loading && !error && tours.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No hay tours con los filtros seleccionados.
          </div>
        )}

        {!loading && !error && tours.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden sm:table-cell">Ubicación</TableHead>
                <TableHead className="hidden md:table-cell">Categoría</TableHead>
                <TableHead className="hidden md:table-cell">Destacado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map(tour => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {tour.title}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-500 text-sm">
                    {tour.location}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {tour.categories?.name ?? '—'}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {tour.best_seller && (
                      <Badge variant="secondary" className="text-xs">Best Seller</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {tour.active ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500 text-xs">
                        Inactivo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/admin/tours/${tour.id}/edit`)}
                        aria-label="Editar tour"
                      >
                        <Pencil size={15} />
                      </Button>
                      {tour.active ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTourToDeactivate(tour)}
                          aria-label="Desactivar tour"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <EyeOff size={15} />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(tour, true)}
                          aria-label="Activar tour"
                          className="text-gray-400 hover:text-green-600"
                        >
                          <Eye size={15} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Confirmation dialog for deactivating */}
      <AlertDialog
        open={!!tourToDeactivate}
        onOpenChange={open => !open && setTourToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar este tour?</AlertDialogTitle>
            <AlertDialogDescription>
              El tour <strong>"{tourToDeactivate?.title}"</strong> dejará de aparecer en el
              sitio público. Podrás reactivarlo en cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tourToDeactivate && handleToggleActive(tourToDeactivate, false)}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
