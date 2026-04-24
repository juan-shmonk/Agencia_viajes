import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import {
  useTourRates, createRate, updateRate, deleteRate, toggleRateActive,
  type RateInput,
} from '../../../lib/hooks/useTourRates'
import { useTour } from '../../../lib/hooks/useTours'
import type { TourRate } from '../../../lib/database.types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '../../components/ui/table'

// ── Form schema ───────────────────────────────────────────────────────────────

const rateSchema = z.object({
  name:          z.string().min(1, 'El nombre es requerido'),
  description:   z.string().default(''),
  price:         z.coerce.number({ invalid_type_error: 'Precio inválido' })
                   .positive('El precio debe ser mayor a 0'),
  display_order: z.coerce.number().int().min(0).default(0),
  active:        z.boolean().default(true),
})

type RateFormData = z.infer<typeof rateSchema>

// ── Dialog form ───────────────────────────────────────────────────────────────

function RateDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  defaultValues?: Partial<RateFormData>
  onSave: (data: RateInput) => Promise<void>
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<RateFormData>({
      resolver: zodResolver(rateSchema),
      defaultValues: {
        name: '', description: '', price: undefined as unknown as number,
        display_order: 0, active: true,
        ...defaultValues,
      },
    })

  async function onSubmit(data: RateFormData) {
    await onSave({
      name:          data.name,
      description:   data.description || null,
      price:         data.price,
      currency:      'USD',
      display_order: data.display_order,
      active:        data.active,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="r-name">Nombre *</Label>
            <Input id="r-name" placeholder="ej: Estándar, Premium" {...register('name')} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="r-desc">Descripción</Label>
            <Textarea id="r-desc" rows={2} {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="r-price">Precio (USD) *</Label>
              <Input id="r-price" type="number" step="0.01" min="0" {...register('price')} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="r-order">Orden</Label>
              <Input id="r-order" type="number" min="0" {...register('display_order')} />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('active')} />
            <span className="text-sm text-gray-700">Tarifa activa</span>
          </label>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting
                ? <><Loader2 size={14} className="mr-1 animate-spin" />Guardando…</>
                : 'Guardar'
              }
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function TourRates() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: tour } = useTour(id)
  const { data: rates, loading, error, reload } = useTourRates(id)

  const [dialogOpen, setDialogOpen]     = useState(false)
  const [editingRate, setEditingRate]   = useState<TourRate | null>(null)
  const [hasBookingsRate, setHasBookingsRate] = useState<TourRate | null>(null)

  function openAdd() {
    setEditingRate(null)
    setDialogOpen(true)
  }

  function openEdit(rate: TourRate) {
    setEditingRate(rate)
    setDialogOpen(true)
  }

  async function handleSave(data: RateInput) {
    if (editingRate) {
      await updateRate(editingRate.id, data)
      toast.success('Tarifa actualizada.')
    } else {
      await createRate(id!, { ...data, display_order: data.display_order || rates.length + 1 })
      toast.success('Tarifa creada.')
    }
    reload()
  }

  async function handleDelete(rate: TourRate) {
    try {
      await deleteRate(rate.id)
      toast.success('Tarifa eliminada.')
      reload()
    } catch (e) {
      if (e instanceof Error && e.message === 'TIENE_BOOKINGS') {
        setHasBookingsRate(rate)
      } else {
        console.error('deleteRate:', e)
        toast.error('Error al eliminar la tarifa.')
      }
    }
  }

  async function handleDeactivateInstead(rate: TourRate) {
    setHasBookingsRate(null)
    try {
      await toggleRateActive(rate.id, false)
      toast.success('Tarifa desactivada.')
      reload()
    } catch (e) {
      console.error('toggleRateActive:', e)
      toast.error('Error al desactivar la tarifa.')
    }
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/tours/${id}/edit`)}
        >
          <ArrowLeft size={16} className="mr-1" />
          {tour?.title ?? 'Tour'}
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tarifas</h1>
      </div>

      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-1" />
          Nueva tarifa
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        )}

        {error && (
          <p className="p-6 text-center text-red-500 text-sm">
            {error}
            <button onClick={reload} className="ml-2 underline">Reintentar</button>
          </p>
        )}

        {!loading && !error && rates.length === 0 && (
          <p className="p-10 text-center text-gray-400 text-sm">
            No hay tarifas. Agrega la primera.
          </p>
        )}

        {!loading && !error && rates.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Orden</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map(rate => (
                <TableRow key={rate.id}>
                  <TableCell className="font-medium">{rate.name}</TableCell>
                  <TableCell className="text-gray-500 text-sm max-w-[180px] truncate">
                    {rate.description ?? '—'}
                  </TableCell>
                  <TableCell className="font-semibold">{fmt(rate.price)}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{rate.display_order}</TableCell>
                  <TableCell>
                    {rate.active
                      ? <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">Activa</Badge>
                      : <Badge variant="outline" className="text-gray-500 text-xs">Inactiva</Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(rate)}
                        aria-label="Editar tarifa"
                      >
                        <Pencil size={15} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(rate)}
                        aria-label="Eliminar tarifa"
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit dialog */}
      <RateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingRate ? 'Editar tarifa' : 'Nueva tarifa'}
        defaultValues={editingRate
          ? {
              name:          editingRate.name,
              description:   editingRate.description ?? '',
              price:         editingRate.price,
              display_order: editingRate.display_order,
              active:        editingRate.active,
            }
          : undefined
        }
        onSave={handleSave}
      />

      {/* Delete blocked → offer deactivate */}
      <AlertDialog
        open={!!hasBookingsRate}
        onOpenChange={open => !open && setHasBookingsRate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede eliminar</AlertDialogTitle>
            <AlertDialogDescription>
              La tarifa <strong>"{hasBookingsRate?.name}"</strong> tiene reservas asociadas
              y no puede eliminarse. ¿Desactivarla en su lugar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => hasBookingsRate && handleDeactivateInstead(hasBookingsRate)}
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
