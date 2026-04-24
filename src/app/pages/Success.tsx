import { CheckCircle, Mail, Calendar, Download } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";
import { Component } from "react";

export class Success extends Component {
  private bookingRef: string;

  constructor(props: {}) {
    super(props);
    this.bookingRef = `TR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Your adventure awaits! We've sent a confirmation email with all the details.
              </p>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 space-y-4 text-left">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox for booking details and payment receipt
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Add to Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    Don't forget to mark your travel dates on your calendar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Download className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Download Documents</h3>
                  <p className="text-sm text-muted-foreground">
                    Your travel documents and itinerary are available in your account
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Booking Reference: <span className="font-mono font-semibold text-foreground">{this.bookingRef}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Link to="/tours" className="flex-1">
                <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white">
                  Browse More Tours
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@tourplatform.com" className="text-primary hover:underline">
                  support@tourplatform.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}