import { Component } from "react";
import { Link } from "react-router";
import { ArrowLeft, Star, Clock, MapPin, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { tours } from "../data/tours";
import { withRouter, WithRouterProps } from "../utils/withRouter";

interface TourDetailState {
  selectedImage: number;
}

class TourDetailComponent extends Component<WithRouterProps, TourDetailState> {
  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      selectedImage: 0
    };
  }

  handleImageSelect = (index: number) => {
    this.setState({ selectedImage: index });
  };

  render() {
    const { id } = this.props.params;
    const tour = tours.find(t => t.id === id);
    const { selectedImage } = this.state;

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

    return (
      <div className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/tours">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">From</p>
                <p className="text-2xl font-bold text-primary">${tour.price.toLocaleString()}</p>
              </div>
              <Link to={`/checkout/${tour.id}`}>
                <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                  Book Now
                </Button>
              </Link>

              <p className="text-xs text-center text-muted-foreground">
                Free cancellation up to 24 hours before the tour
              </p>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative aspect-[4/3] md:aspect-square rounded-xl overflow-hidden">
              <img 
                src={tour.images[selectedImage]} 
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              {tour.bestSeller && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Best Seller
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {tour.images.slice(0, 4).map((image, index) => (
                <div 
                  key={index}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                    selectedImage === index ? "ring-2 ring-primary" : "hover:opacity-80"
                  }`}
                  onClick={() => this.handleImageSelect(index)}
                >
                  <img 
                    src={image} 
                    alt={`${tour.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tour Info */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>{tour.location}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{tour.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="text-muted-foreground">({tour.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{tour.duration}</span>
                  </div>
                  
                  <Badge variant="outline">{tour.category}</Badge>
                </div>

                <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
              </div>

              {/* What's Included */}
              <div>
                <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">D{day.day}</span>
                        </div>
                      </div>
                      <div className="flex-1 pb-6 border-l-2 border-border pl-6 -ml-6">
                        <h3 className="font-semibold mb-2">{day.title}</h3>
                        <p className="text-muted-foreground">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Desktop Booking */}
            <div className="hidden md:block">
              <div className="bg-white rounded-xl border p-6 sticky top-24 space-y-4">
                <div className="text-center pb-4 border-b">
                  <p className="text-sm text-muted-foreground mb-1">Price per person</p>
                  <p className="text-4xl font-bold text-primary">${tour.price.toLocaleString()}</p>
                </div>

                <div className="space-y-3 py-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{tour.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{tour.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Group Size</span>
                    <span className="font-medium">Max 12 people</span>
                  </div>
                </div>

                <Link to={`/checkout/${tour.id}`}>
                  <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                    Book Now
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 24 hours before the tour
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-2xl font-bold text-primary">${tour.price.toLocaleString()}</p>
            </div>
            <Link to={`/checkout/${tour.id}`} className="flex-1">
              <Button className="w-full bg-[#FF6F61] hover:bg-[#FF6F61]/90 text-white" size="lg">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export const TourDetail = withRouter(TourDetailComponent);