import { Home, Compass, Bookmark, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Component } from "react";
import { withRouter } from "../utils/withRouter";

interface MobileNavProps {
  location: any;
}

class MobileNavComponent extends Component<MobileNavProps> {
  render() {
    const { location } = this.props;
    const pathname = location.pathname;
    
    const navItems = [
      { icon: Home, label: "Home", path: "/" },
      { icon: Compass, label: "Explore", path: "/tours" },
      { icon: Bookmark, label: "Saved", path: "/saved" },
      { icon: User, label: "Profile", path: "/profile" },
    ];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
}

export const MobileNav = withRouter(MobileNavComponent);