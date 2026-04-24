import { Component } from "react";
import { Filter } from "lucide-react";
import { SearchBar } from "../components/SearchBar";
import { TourCard } from "../components/TourCard";
import { Button } from "../components/ui/button";
import { tours, categories } from "../data/tours";
import { withRouter, WithRouterProps } from "../utils/withRouter";

interface TourListingState {
  selectedCategory: string;
  filteredTours: typeof tours;
}

class TourListingComponent extends Component<WithRouterProps, TourListingState> {
  constructor(props: WithRouterProps) {
    super(props);
    this.state = {
      selectedCategory: "All",
      filteredTours: tours
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const category = params.get("category") || "All";
    this.setState({ selectedCategory: category });
    this.filterTours(category);
  }

  componentDidUpdate(prevProps: WithRouterProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const params = new URLSearchParams(this.props.location.search);
      const category = params.get("category") || "All";
      this.setState({ selectedCategory: category });
      this.filterTours(category);
    }
  }

  filterTours = (category: string) => {
    if (category === "All") {
      this.setState({ filteredTours: tours });
    } else {
      this.setState({ 
        filteredTours: tours.filter(tour => tour.category === category) 
      });
    }
  };

  handleCategoryChange = (category: string) => {
    this.setState({ selectedCategory: category });
    this.filterTours(category);
    
    const params = new URLSearchParams(this.props.location.search);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    this.props.navigate(`?${params.toString()}`);
  };

  render() {
    const { selectedCategory, filteredTours } = this.state;

    return (
      <div className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 to-background px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Explore Tours</h1>
            <SearchBar />
          </div>
        </div>

        {/* Filters & Results */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Filters */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-semibold">Categories</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => this.handleCategoryChange(category)}
                  className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredTours.length} {filteredTours.length === 1 ? "tour" : "tours"}
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {filteredTours.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tours found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const TourListing = withRouter(TourListingComponent);