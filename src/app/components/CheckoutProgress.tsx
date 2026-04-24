import { Check } from "lucide-react";
import { Component } from "react";

interface CheckoutProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Your Info" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Confirm" },
];

export class CheckoutProgress extends Component<CheckoutProgressProps> {
  render() {
    const { currentStep } = this.props;

    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep > step.number
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span className="text-xs md:text-sm mt-2 text-center">{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-colors ${
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}