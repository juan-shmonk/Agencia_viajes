import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  Plus, Trash2, ArrowLeft, Upload, X, Loader2,
} from 'lucide-react'
import { useTour, createTour, updateTour } from '../../../lib/hooks/useTours'
import { useCategories } from '../../../lib/hooks/useCategories'
import { uploadTourImage } from '../../../lib/storage'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

// ── Schema ────────────────────────────────────────────────────────────────────

const tourSchema = z.object({
  title:       z.string().min(1, 'El título es requerido'),
  location:    z.string().min(1, 'La ubicación es requerida'),
  description: z.string().default(''),
  duration:    z.string().min(1, 'La duración es requerida'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  best_seller: z.boolean().default(false),
  active:      z.boolean().default(true),
  cover_image: z.string().default(''),
  images:   z.array(z.object({ url: z.string() })).default([]),
  included: z.array(z.object({ value: z.string() })).default([]),
  itinerary: z.array(z.object({
    day:         z.number().int().min(1),
    title:       z.string().min(1, 'El título del día es requerido'),
    description: z.string().default(''),
  })).default([]),
})

type TourForm = z.infer<typeof tourSchema>

// ── Component ─────────────────────────────────────────────────────────────────

export function TourEditor() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()

  const { data: tour, loading: tourLoading, error: tourError } = useTour(isEdit ? id : undefined)
  const { data: categories } = useCategories()

  const [coverUploading, setCoverUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const coverRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TourForm>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: '', location: '', description: '', duration: '',
      category_id: '', best_seller: false, active: true,
      cover_image: '', images: [], included: [], itinerary: [],
    },
  })

  const { fields: imagesFields, append: addImage, remove: removeImage } =
    useFieldArray({ control, name: 'images' })

  const { fields: includedFields, append: addIncluded, remove: removeIncluded } =
    useFieldArray({ control, name: 'included' })

  const { fields: itineraryFields, append: addDay, remove: removeDay } =
    useFieldArray({ control, name: 'itinerary' })

  const coverImage = watch('cover_image')

  // Pre-fill form in edit mode
  useEffect(() => {
    if (!tour) return
    reset({
      title:       tour.title,
      location:    tour.location,
      description: tour.description ?? '',
      duration:    tour.duration,
      category_id: tour.category_id ?? '',
      best_seller: tour.best_seller,
      active:      tour.active,
      cover_image: tour.cover_image ?? '',
      images:      (tour.images ?? []).map(url => ({ url })),
      included:    (tour.included ?? []).map(value => ({ value })),
      itinerary:   (tour.tour_itinerary ?? [])
        .sort((a, b) => a.day - b.day)
        .map(d => ({ day: d.day, title: d.title, description: d.description ?? '' })),
    })
  }, [tour, reset])

  // ── Image uploads ─────────────────────────────────────────────────────────

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverUploading(true)
    setUploadError(null)
    try {
      const url = await uploadTourImage(file)
      setValue('cover_image', url, { shouldValidate: true })
    } catch (err) {
      console.error('cover upload:', err)
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen de portada.')
    } finally {
      setCoverUploading(false)
      if (coverRef.current) coverRef.current.value = ''
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setGalleryUploading(true)
    setUploadError(null)
    try {
      for (const file of files) {
        const url = await uploadTourImage(file)
        addImage({ url })
      }
    } catch (err) {
      console.error('gallery upload:', err)
      setUploadError(err instanceof Error ? err.message : 'Error al subir imagen de galería.')
    } finally {
      setGalleryUploading(false)
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  // ── Form submit ──────────────────────────────────────────────────────────

  async function onSubmit(formData: TourForm) {
    const tourPayload = {
      title:       formData.title,
      location:    formData.location,
      description: formData.description || null,
      duration:    formData.duration,
      category_id: formData.category_id,
      best_seller: formData.best_seller,
      active:      formData.active,
      cover_image: formData.cover_image || null,
      images:      formData.images.map(i => i.url),
      included:    formData.included.map(i => i.value).filter(Boolean),
    }

    const itinerary = formData.itinerary.map(d => ({
      day:         d.day,
      title:       d.title,
      description: d.description || null,
    }))

    try {
      if (isEdit && id) {
        await updateTour(id, tourPayload, itinerary)
        toast.success('Tour actualizado correctamente.')
      } else {
        await createTour(tourPayload, itinerary)
        toast.success('Tour creado correctamente.')
      }
      navigate('/admin/tours')
    } catch (err) {
      console.error('TourEditor submit:', err)
      toast.error('Error al guardar el tour. Intenta de nuevo.')
    }
  }

  // ── Loading / error states ────────────────────────────────────────────────

  if (isEdit && tourLoading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    )
  }

  if (isEdit && tourError) {
    return (
      <div className="text-red-500 text-sm">
        {tourError}{' '}
        <button onClick={() => navigate('/admin/tours')} className="underline">Volver</button>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/tours')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Tours
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar tour' : 'Nuevo tour'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Información básica ─────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Información básica</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="title">Título *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="location">Ubicación *</Label>
              <Input id="location" {...register('location')} />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="duration">Duración *</Label>
              <Input id="duration" placeholder="ej: 3 días / 7 hours" {...register('duration')} />
              {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="category_id">Categoría *</Label>
              <Select
                value={watch('category_id')}
                onValueChange={val => setValue('category_id', val, { shouldValidate: true })}
              >
                <SelectTrigger id="category_id">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-xs text-red-500">{errors.category_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" rows={4} {...register('description')} />
          </div>
        </section>

        {/* ── Configuración ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Configuración</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('best_seller')} />
            <span className="text-sm text-gray-700">Marcar como Best Seller</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" {...register('active')} />
            <span className="text-sm text-gray-700">Tour activo (visible en el sitio)</span>
          </label>
        </section>

        {/* ── Imágenes ──────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Imágenes</h2>

          {uploadError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {uploadError}
            </p>
          )}

          {/* Cover */}
          <div className="space-y-2">
            <Label>Imagen de portada</Label>
            <div className="flex items-start gap-4">
              {coverImage ? (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden border shrink-0">
                  <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setValue('cover_image', '')}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                    aria-label="Quitar portada"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shrink-0">
                  <span className="text-xs text-gray-400">Sin portada</span>
                </div>
              )}
              <div className="space-y-1">
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={coverUploading}
                  onClick={() => coverRef.current?.click()}
                >
                  {coverUploading
                    ? <><Loader2 size={14} className="mr-1 animate-spin" />Subiendo…</>
                    : <><Upload size={14} className="mr-1" />{coverImage ? 'Cambiar' : 'Subir'} portada</>
                  }
                </Button>
                <p className="text-xs text-gray-400">JPEG, PNG o WebP · máx. 5 MB</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-2">
            <Label>Galería de imágenes</Label>
            {imagesFields.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {imagesFields.map((field, idx) => (
                  <div key={field.id} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={field.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                      aria-label="Quitar imagen"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <input
                ref={galleryRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={galleryUploading}
                onClick={() => galleryRef.current?.click()}
              >
                {galleryUploading
                  ? <><Loader2 size={14} className="mr-1 animate-spin" />Subiendo…</>
                  : <><Plus size={14} className="mr-1" />Agregar imágenes</>
                }
              </Button>
              <p className="text-xs text-gray-400 mt-1">Puedes seleccionar varias a la vez.</p>
            </div>
          </div>
        </section>

        {/* ── Qué incluye ───────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border p-5 space-y-3">
          <h2 className="font-semibold text-gray-900">Qué incluye</h2>

          {includedFields.map((field, idx) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...register(`included.${idx}.value`)}
                placeholder={`Incluye ${idx + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeIncluded(idx)}
                aria-label="Eliminar ítem"
              >
                <Trash2 size={15} className="text-red-400" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addIncluded({ value: '' })}
          >
            <Plus size={14} className="mr-1" />
            Agregar ítem
          </Button>
        </section>

        {/* ── Itinerario ────────────────────────────────────────────────── */}
        <section className="bg-white rounded-xl border p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Itinerario</h2>

          {itineraryFields.map((field, idx) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Día {field.day}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDay(idx)}
                  aria-label="Eliminar día"
                >
                  <Trash2 size={15} className="text-red-400" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label>Título *</Label>
                <Input {...register(`itinerary.${idx}.title`)} />
                {errors.itinerary?.[idx]?.title && (
                  <p className="text-xs text-red-500">{errors.itinerary[idx]?.title?.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Descripción</Label>
                <Textarea rows={2} {...register(`itinerary.${idx}.description`)} />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addDay({ day: itineraryFields.length + 1, title: '', description: '' })}
          >
            <Plus size={14} className="mr-1" />
            Agregar día
          </Button>
        </section>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pb-8">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? <><Loader2 size={15} className="mr-1 animate-spin" />Guardando…</>
              : isEdit ? 'Guardar cambios' : 'Crear tour'
            }
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/tours')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
