import { Component } from "react";
import { Link } from "react-router";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { CheckoutProgress } from "../components/CheckoutProgress";
import { tours } from "../data/tours";
import { withRouter, WithRouterProps } from "../utils/withRouter";

interface CheckoutState {
  step: number;
  travelers: number;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
  };
}

class CheckoutComponent extends Component<WithRouterProps, CheckoutState> {
  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      step: 1,
      travelers: 1,
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
      }
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value }
    });
  };

  handleTravelersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ travelers: parseInt(e.target.value) || 1 });
  };

  handleNext = () => {
    if (this.state.step < 3) {
      this.setState({ step: this.state.step + 1 });
    }
  };

  handleBack = () => {
    const { tourId } = this.props.params;
    if (this.state.step > 1) {
      this.setState({ step: this.state.step - 1 });
    } else {
      this.props.navigate(`/tour/${tourId}`);
    }
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (this.state.step === 3) {
      this.props.navigate("/success");
    } else {
      this.handleNext();
    }
  };

  render() {
    const { tourId } = this.props.params;
    const tour = tours.find(t => t.id === tourId);
    const { step, travelers, formData } = this.state;

    if (!tour) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Tour Not Found</h2>
            <Link to="/tours">
              <Button>Back to Tours</Button>
            </Link>
          </div>
        </div>
      );
    }

    const totalPrice = tour.price * travelers;

    return (
      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button variant="ghost" size="sm" onClick={this.handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <CheckoutProgress currentStep={step} />

        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={this.handleSubmit} className="space-y-6">
                {/* Step 1: User Info */}
                {step === 1 && (
                  <div className="bg-white rounded-xl border p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Your Information</h2>
                      <p className="text-muted-foreground">Please provide your contact details</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={this.handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={this.handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="travelers">Number of Travelers</Label>
                      <Input 
                        id="travelers"
                        type="number"
                        min="1"
                        max="12"
                        value={travelers}
                        onChange={this.handleTravelersChange}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <div className="bg-white rounded-xl border p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <CreditCard className="w-6 h-6" />
                        Payment Details
                      </h2>
                      <p className="text-muted-foreground">Your payment information is secure</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input 
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={this.handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={this.handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={this.handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={this.handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg">
                      <Lock className="w-5 h-5 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                  <div className="bg-white rounded-xl border p-6 space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Confirm Your Booking</h2>
                      <p className="text-muted-foreground">Please review your information before completing</p>
                    </div>

                    <div className="space-y-4 p-4 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Travelers</span>
                        <span className="font-medium">{travelers} {travelers === 1 ? "person" : "people"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Card</span>
                        <span className="font-medium">•••• {formData.cardNumber.slice(-4)}</span>
                      </div>
                    </div>

                    <div className="p-4 border-2 border-primary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-4">
                        By completing this booking, you agree to our Terms & Conditions and Privacy Policy. 
                        Free cancellation is available up to 24 hours before the tour start time.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={this.handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white"
                  >
                    {step === 3 ? "Complete Booking" : "Continue"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-4">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-3 pb-4 border-b">
                  <h4 className="font-semibold">{tour.title}</h4>
                  <p className="text-sm text-muted-foreground">{tour.location}</p>
                  <p className="text-sm text-muted-foreground">{tour.duration}</p>
                </div>

                <div className="space-y-3 py-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per person</span>
                    <span className="font-medium">${tour.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Travelers</span>
                    <span className="font-medium">× {travelers}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const Checkout = withRouter(CheckoutComponent);
