import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { TourListing } from "./pages/TourListing";
import { TourDetail } from "./pages/TourDetail";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "tours", Component: TourListing },
      { path: "tour/:id", Component: TourDetail },
      { path: "checkout/:tourId", Component: Checkout },
      { path: "success", Component: Success },
    ],
  },
]);
