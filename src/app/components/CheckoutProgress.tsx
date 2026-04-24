import { Check } from 'lucide-react'

const STEPS = [
  { number: 1, label: 'Tus datos' },
  { number: 2, label: 'Reserva' },
  { number: 3, label: 'Confirmación' },
]

interface CheckoutProgressProps {
  currentStep: number
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  currentStep >= step.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.number
                  ? <Check className="w-5 h-5" />
                  : <span>{step.number}</span>
                }
              </div>
              <span className="text-xs md:text-sm mt-2 text-center">{step.label}</span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-colors ${
                  currentStep > step.number ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
