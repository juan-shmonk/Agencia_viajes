import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { ArrowLeft, Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react'
import {
  useTourSchedules, createSchedule, updateSchedule,
  deleteSchedule, toggleScheduleActive, isSchedulePast,
  type ScheduleInput,
} from '../../../lib/hooks/useTourSchedules'
import { useTour } from '../../../lib/hooks/useTours'
import type { TourSchedule } from '../../../lib/database.types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
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

// ── Form schema ───────────────────────────────────────────────────────────────

const scheduleSchema = z.object({
  departure_date: z.string().min(1, 'La fecha es requerida'),
  departure_time: z.string().min(1, 'La hora es requerida'),
  max_capacity:   z.coerce.number({ invalid_type_error: 'Capacidad inválida' })
                    .int()
                    .min(1, 'La capacidad mínima es 1'),
  active:         z.boolean().default(true),
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

const todayStr = new Date().toISOString().split('T')[0]

// ── Dialog form ───────────────────────────────────────────────────────────────

function ScheduleDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  defaultValues?: Partial<ScheduleFormData>
  onSave: (data: ScheduleInput) => Promise<void>
}) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ScheduleFormData>({
      resolver: zodResolver(scheduleSchema),
      defaultValues: {
        departure_date: '',
        departure_time: '',
        max_capacity:   undefined as unknown as number,
        active: true,
        ...defaultValues,
      },
    })

  async function onSubmit(data: ScheduleFormData) {
    await onSave({
      departure_date: data.departure_date,
      departure_time: data.departure_time,
      max_capacity:   data.max_capacity,
      active:         data.active,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="s-date">Fecha de salida *</Label>
            <Input
              id="s-date"
              type="date"
              min={todayStr}
              {...register('departure_date')}
            />
            {errors.departure_date && (
              <p className="text-xs text-red-500">{errors.departure_date.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-time">Hora de salida *</Label>
            <Input id="s-time" type="time" {...register('departure_time')} />
            {errors.departure_time && (
              <p className="text-xs text-red-500">{errors.departure_time.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="s-cap">Capacidad máxima *</Label>
            <Input id="s-cap" type="number" min="1" {...register('max_capacity')} />
            {errors.max_capacity && (
              <p className="text-xs text-red-500">{errors.max_capacity.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('active')} />
            <span className="text-sm text-gray-700">Horario activo</span>
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

// ── Schedule card ─────────────────────────────────────────────────────────────

function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: {
  schedule: TourSchedule
  onEdit: () => void
  onDelete: () => void
}) {
  const past = isSchedulePast(schedule)
  const pct  = schedule.max_capacity > 0
    ? Math.min((schedule.booked_count / schedule.max_capacity) * 100, 100)
    : 0
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-blue-500'

  const [y, m, d] = schedule.departure_date.split('-')
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
  const dateLabel = `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`
  const timeLabel = schedule.departure_time.substring(0, 5)

  return (
    <div className={`
      bg-white rounded-xl border p-4 space-y-3
      ${past ? 'opacity-50 select-none' : ''}
    `}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`font-semibold ${past ? 'text-gray-400' : 'text-gray-900'}`}>
            {dateLabel} · {timeLabel}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {past && <Badge variant="outline" className="text-xs text-gray-400">Pasado</Badge>}
            {!past && (
              schedule.active
                ? <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs">Activo</Badge>
                : <Badge variant="outline" className="text-xs text-gray-500">Inactivo</Badge>
            )}
          </div>
        </div>

        {!past && (
          <div className="flex gap-1 shrink-0">
            <Button size="sm" variant="ghost" onClick={onEdit} aria-label="Editar horario">
              <Pencil size={15} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              aria-label="Eliminar horario"
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 size={15} />
            </Button>
          </div>
        )}
      </div>

      {/* Capacity bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={12} />
            Capacidad
          </span>
          <span className="font-medium">
            {schedule.booked_count} / {schedule.max_capacity}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function TourSchedules() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: tour } = useTour(id)
  const { data: schedules, loading, error, reload } = useTourSchedules(id)

  const [dialogOpen, setDialogOpen]           = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<TourSchedule | null>(null)
  const [hasBookingsSched, setHasBookingsSched] = useState<TourSchedule | null>(null)

  function openAdd() {
    setEditingSchedule(null)
    setDialogOpen(true)
  }

  function openEdit(s: TourSchedule) {
    setEditingSchedule(s)
    setDialogOpen(true)
  }

  async function handleSave(data: ScheduleInput) {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, data)
      toast.success('Horario actualizado.')
    } else {
      await createSchedule(id!, data)
      toast.success('Horario creado.')
    }
    reload()
  }

  async function handleDelete(s: TourSchedule) {
    try {
      await deleteSchedule(s.id)
      toast.success('Horario eliminado.')
      reload()
    } catch (e) {
      if (e instanceof Error && e.message === 'TIENE_BOOKINGS') {
        setHasBookingsSched(s)
      } else {
        console.error('deleteSchedule:', e)
        toast.error('Error al eliminar el horario.')
      }
    }
  }

  async function handleDeactivateInstead(s: TourSchedule) {
    setHasBookingsSched(null)
    try {
      await toggleScheduleActive(s.id, false)
      toast.success('Horario desactivado.')
      reload()
    } catch (e) {
      console.error('toggleScheduleActive:', e)
      toast.error('Error al desactivar el horario.')
    }
  }

  const futureSchedules = schedules.filter(s => !isSchedulePast(s))
  const pastSchedules   = schedules.filter(s => isSchedulePast(s))

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
        <h1 className="text-2xl font-bold text-gray-900">Horarios</h1>
      </div>

      <div className="flex justify-end">
        <Button onClick={openAdd}>
          <Plus size={16} className="mr-1" />
          Nuevo horario
        </Button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
        </div>
      )}

      {error && (
        <p className="text-center text-red-500 text-sm">
          {error}
          <button onClick={reload} className="ml-2 underline">Reintentar</button>
        </p>
      )}

      {!loading && !error && schedules.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-10">
          No hay horarios. Agrega el primero.
        </p>
      )}

      {/* Future schedules */}
      {!loading && !error && futureSchedules.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">Próximos horarios</p>
          {futureSchedules.map(s => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              onEdit={() => openEdit(s)}
              onDelete={() => handleDelete(s)}
            />
          ))}
        </div>
      )}

      {/* Past schedules (greyed, soft lock) */}
      {!loading && !error && pastSchedules.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-400">Horarios pasados</p>
          {pastSchedules.map(s => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              onEdit={() => {}} // no-op; buttons hidden for past
              onDelete={() => {}} // no-op; buttons hidden for past
            />
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingSchedule ? 'Editar horario' : 'Nuevo horario'}
        defaultValues={editingSchedule
          ? {
              departure_date: editingSchedule.departure_date,
              departure_time: editingSchedule.departure_time.substring(0, 5),
              max_capacity:   editingSchedule.max_capacity,
              active:         editingSchedule.active,
            }
          : undefined
        }
        onSave={handleSave}
      />

      {/* Delete blocked → offer deactivate */}
      <AlertDialog
        open={!!hasBookingsSched}
        onOpenChange={open => !open && setHasBookingsSched(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No se puede eliminar</AlertDialogTitle>
            <AlertDialogDescription>
              Este horario tiene reservas asociadas y no puede eliminarse.
              ¿Desactivarlo en su lugar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => hasBookingsSched && handleDeactivateInstead(hasBookingsSched)}
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
