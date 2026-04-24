import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Component } from "react";
import { withRouter, WithRouterProps } from "../utils/withRouter";

interface SearchBarState {
  destination: string;
  date: string;
  guests: string;
}

class SearchBarComponent extends Component<WithRouterProps, SearchBarState> {
  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      destination: "",
      date: "",
      guests: "2"
    };
  }

  handleSearch = () => {
    const { destination } = this.state;
    const params = new URLSearchParams();
    if (destination) params.append("search", destination);
    this.props.navigate(`/tours?${params.toString()}`);
  };

  handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ destination: e.target.value });
  };

  handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ date: e.target.value });
  };

  handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ guests: e.target.value });
  };

  render() {
    const { destination, date, guests } = this.state;

    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Destination
            </label>
            <input
              type="text"
              placeholder="Where to?"
              value={destination}
              onChange={this.handleDestinationChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={this.handleDateChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            />
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guests
            </label>
            <select
              value={guests}
              onChange={this.handleGuestsChange}
              className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-input-background"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5+ Guests</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90"
              onClick={this.handleSearch}
            >
              <Search className="w-5 h-5 mr-2" />
              Search Tours
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export const SearchBar = withRouter(SearchBarComponent);