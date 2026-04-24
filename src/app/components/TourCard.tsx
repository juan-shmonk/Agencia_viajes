import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Link } from "react-router";
import { Tour } from "../data/tours";
import { Component } from "react";

interface TourCardProps {
  tour: Tour;
}

export class TourCard extends Component<TourCardProps> {
  render() {
    const { tour } = this.props;
    
    return (
      <Link to={`/tour/${tour.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full bg-[#33CCCC]/5 border-[#33CCCC]/20">
          <div className="relative">
            <img 
              src={tour.image} 
              alt={tour.title}
              className="w-full h-48 md:h-56 object-cover"
            />
            {tour.bestSeller && (
              <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                Best Seller
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{tour.location}</span>
            </div>
            
            <h3 className="font-semibold line-clamp-2">{tour.title}</h3>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{tour.rating}</span>
                <span className="text-muted-foreground">({tour.reviews})</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{tour.duration}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">From</span>
              <p className="text-2xl font-bold text-primary">${tour.price.toLocaleString()}</p>
            </div>
            <Badge variant="outline">{tour.category}</Badge>
          </CardFooter>
        </Card>
      </Link>
    );
  }
}