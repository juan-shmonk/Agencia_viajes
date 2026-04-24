import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { ArrowLeft, CreditCard, Lock, Calendar } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { CheckoutProgress } from '../components/CheckoutProgress'
import { Skeleton } from '../components/ui/skeleton'
import { useTour } from '../../lib/hooks/useTours'
import { useTourRates } from '../../lib/hooks/useTourRates'
import { useTourSchedules, isSchedulePast } from '../../lib/hooks/useTourSchedules'
import { reservationsService } from '../../services/reservationsService'
import type { TourRate } from '../../lib/database.types'
import type { TourSchedule } from '../../lib/database.types'

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function formatSchedule(s: TourSchedule): string {
  const date = new Date(`${s.departure_date}T${s.departure_time}`)
  const dateStr = date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
  const available = s.max_capacity - s.booked_count
  return `${dateStr} – ${timeStr} (${available} cupos disponibles)`
}

export function Checkout() {
  const { tourId } = useParams<{ tourId: string }>()
  const navigate = useNavigate()

  const { data: tour, loading: tourLoading, error: tourError } = useTour(tourId)
  const { data: rates, loading: ratesLoading } = useTourRates(tourId)
  const { data: schedules, loading: schedulesLoading } = useTourSchedules(tourId)

  const [step, setStep] = useState(1)

  // Step 1 – datos personales
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Selección de tarifa y horario
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)

  // Step 2 – pago (mock)
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  // Submit
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const activeRates = rates.filter(r => r.active)
  const futureSchedules = schedules.filter(
    s => s.active && !isSchedulePast(s) && s.max_capacity - s.booked_count > 0
  )

  // Auto-seleccionar tarifa si solo hay una
  useEffect(() => {
    if (activeRates.length === 1 && !selectedRateId) {
      setSelectedRateId(activeRates[0].id)
    }
  }, [activeRates.length, selectedRateId])

  const selectedRate: TourRate | undefined = activeRates.find(r => r.id === selectedRateId)
  const selectedSchedule: TourSchedule | undefined = futureSchedules.find(s => s.id === selectedScheduleId)

  const totalTravelers = adults + children
  const totalAmount = selectedRate ? selectedRate.price * totalTravelers : 0

  const loading = tourLoading || ratesLoading || schedulesLoading

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (tourError || !tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tour no encontrado</h2>
          <Link to="/tours"><Button>Ver tours</Button></Link>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1)
    else navigate(`/tour/${tourId}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 3) {
      setStep(s => s + 1)
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const reservation = await reservationsService.create({
        tour_id: tour.id,
        availability_id: selectedScheduleId ?? undefined,
        guests_adult: adults,
        guests_child: children,
        total_amount: totalAmount,
        currency: (selectedRate?.currency as 'USD' | 'MXN') ?? 'USD',
        contact_name: `${firstName} ${lastName}`.trim(),
        contact_email: email,
        contact_phone: phone || undefined,
      })
      navigate('/success', {
        state: {
          reservationCode: reservation.reservation_code,
          tourTitle: tour.title,
        },
      })
    } catch {
      setSubmitError('Ocurrió un error al procesar tu reserva. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const coverImage = tour.cover_image ?? tour.images?.[0] ?? null

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
        </div>
      </div>

      <CheckoutProgress currentStep={step} />

      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Paso 1 – Tus datos */}
              {step === 1 && (
                <div className="bg-white rounded-xl border p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Tus datos</h2>
                    <p className="text-muted-foreground">Información de contacto para la reserva</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>

                  {/* Selector de tarifa (solo si hay más de una) */}
                  {activeRates.length > 1 && (
                    <div className="space-y-3">
                      <Label>Selecciona una tarifa</Label>
                      <div className="grid gap-3">
                        {activeRates.map(rate => (
                          <label
                            key={rate.id}
                            className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedRateId === rate.id
                                ? 'border-primary bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="rate"
                                value={rate.id}
                                checked={selectedRateId === rate.id}
                                onChange={() => setSelectedRateId(rate.id)}
                                required
                                className="accent-primary"
                              />
                              <div>
                                <p className="font-semibold">{rate.name}</p>
                                {rate.description && (
                                  <p className="text-sm text-muted-foreground">{rate.description}</p>
                                )}
                              </div>
                            </div>
                            <p className="font-bold text-primary text-lg">{fmt(rate.price)}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info de tarifa auto-seleccionada */}
                  {activeRates.length === 1 && selectedRate && (
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div>
                        <p className="text-sm text-muted-foreground">Tarifa</p>
                        <p className="font-semibold">{selectedRate.name}</p>
                      </div>
                      <p className="font-bold text-primary text-lg">{fmt(selectedRate.price)} <span className="text-sm font-normal text-muted-foreground">/ persona</span></p>
                    </div>
                  )}
                </div>
              )}

              {/* Paso 2 – Reserva */}
              {step === 2 && (
                <div className="bg-white rounded-xl border p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Detalles de reserva
                    </h2>
                    <p className="text-muted-foreground">Elige fecha, viajeros y pago</p>
                  </div>

                  {/* Selector de horario */}
                  {futureSchedules.length > 0 ? (
                    <div className="space-y-2">
                      <Label htmlFor="schedule">Fecha y horario de salida</Label>
                      <select
                        id="schedule"
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        value={selectedScheduleId ?? ''}
                        onChange={e => setSelectedScheduleId(e.target.value || null)}
                        required
                      >
                        <option value="">Selecciona una fecha</option>
                        {futureSchedules.map(s => (
                          <option key={s.id} value={s.id}>{formatSchedule(s)}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-700">No hay fechas disponibles próximamente. Contáctanos para más información.</p>
                    </div>
                  )}

                  {/* Viajeros */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adults">Adultos</Label>
                      <Input
                        id="adults"
                        type="number"
                        min={1}
                        max={12}
                        value={adults}
                        onChange={e => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children">Niños</Label>
                      <Input
                        id="children"
                        type="number"
                        min={0}
                        max={12}
                        value={children}
                        onChange={e => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                      />
                    </div>
                  </div>

                  {/* Pago (mock) */}
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Información de pago
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Titular de la tarjeta</Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        placeholder="Nombre como aparece en la tarjeta"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Vencimiento</Label>
                        <Input
                          id="expiryDate"
                          value={expiryDate}
                          onChange={e => setExpiryDate(e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={e => setCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                      <p className="text-sm text-muted-foreground">Tu información de pago está cifrada y es segura</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3 – Confirmación */}
              {step === 3 && (
                <div className="bg-white rounded-xl border p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Confirma tu reserva</h2>
                    <p className="text-muted-foreground">Revisa los detalles antes de finalizar</p>
                  </div>

                  <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nombre</span>
                      <span className="font-medium">{firstName} {lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Correo</span>
                      <span className="font-medium">{email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teléfono</span>
                      <span className="font-medium">{phone}</span>
                    </div>
                    {selectedRate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tarifa</span>
                        <span className="font-medium">{selectedRate.name} – {fmt(selectedRate.price)}/persona</span>
                      </div>
                    )}
                    {selectedSchedule && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha</span>
                        <span className="font-medium">
                          {new Date(`${selectedSchedule.departure_date}T${selectedSchedule.departure_time}`).toLocaleDateString('es-MX', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Viajeros</span>
                      <span className="font-medium">{adults} adulto{adults !== 1 ? 's' : ''}{children > 0 ? ` + ${children} niño${children !== 1 ? 's' : ''}` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarjeta</span>
                      <span className="font-medium">•••• {cardNumber.replace(/\s/g, '').slice(-4)}</span>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-primary/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Al completar esta reserva, aceptas nuestros Términos y Condiciones y Política de Privacidad.
                      Cancelación gratuita hasta 24 horas antes del inicio del tour.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  Atrás
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white"
                >
                  {step === 3 ? (submitting ? 'Procesando…' : 'Confirmar reserva') : 'Continuar'}
                </Button>
              </div>
            </form>
          </div>

          {/* Resumen */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-4">
              <h3 className="font-semibold text-lg">Resumen del pedido</h3>

              {coverImage && (
                <img src={coverImage} alt={tour.title} className="w-full h-32 object-cover rounded-lg" />
              )}

              <div className="space-y-3 pb-4 border-b">
                <h4 className="font-semibold">{tour.title}</h4>
                <p className="text-sm text-muted-foreground">{tour.location}</p>
                <p className="text-sm text-muted-foreground">{tour.duration}</p>
              </div>

              {selectedRate && (
                <div className="space-y-3 py-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{selectedRate.name}</span>
                    <span className="font-medium">{fmt(selectedRate.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Viajeros</span>
                    <span className="font-medium">× {totalTravelers}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">{fmt(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
