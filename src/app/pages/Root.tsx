import { Outlet } from "react-router";
import { MobileNav } from "../components/MobileNav";
import { Component } from "react";
import { withRouter, WithRouterProps } from "../utils/withRouter";

class RootComponent extends Component<WithRouterProps> {
  render() {
    const hideNav = this.props.location.pathname === "/success";

    return (
      <div className="min-h-screen bg-background">
        <Outlet />
        {!hideNav && <MobileNav />}
      </div>
    );
  }
}

export const Root = withRouter(RootComponent);