import { useLocation, Link } from 'react-router'
import { CheckCircle, Mail, Calendar, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/button'

export function Success() {
  const location = useLocation()
  const { reservationCode, tourTitle } = (location.state as { reservationCode?: string; tourTitle?: string }) ?? {}
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (reservationCode) {
      navigator.clipboard.writeText(reservationCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">¡Reserva confirmada!</h1>
            {tourTitle && (
              <p className="text-lg text-muted-foreground">
                Tu aventura en <span className="font-semibold text-foreground">{tourTitle}</span> está lista.
              </p>
            )}
          </div>

          {reservationCode && (
            <div className="flex items-center justify-center gap-3 py-4 px-6 bg-primary/5 rounded-xl border border-primary/20">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Código de reserva</p>
                <p className="font-mono font-bold text-xl text-foreground">{reservationCode}</p>
              </div>
              <button
                onClick={handleCopy}
                className="ml-2 text-muted-foreground hover:text-primary transition-colors"
                title="Copiar código"
              >
                <Copy className="w-5 h-5" />
              </button>
              {copied && <span className="text-xs text-primary font-medium">¡Copiado!</span>}
            </div>
          )}

          <div className="bg-primary/5 rounded-xl p-6 space-y-4 text-left">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Correo de confirmación enviado</h3>
                <p className="text-sm text-muted-foreground">
                  Revisa tu bandeja de entrada para los detalles completos de tu reserva
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Agrega al calendario</h3>
                <p className="text-sm text-muted-foreground">
                  No olvides marcar la fecha de tu tour en tu calendario
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full">Volver al inicio</Button>
            </Link>
            <Link to="/tours" className="flex-1">
              <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                Ver más tours
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              ¿Necesitas ayuda? Escríbenos a{' '}
              <a href="mailto:support@tourplatform.com" className="text-primary hover:underline">
                support@tourplatform.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
