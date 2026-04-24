import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { TourListing } from "./pages/TourListing";
import { TourDetail } from "./pages/TourDetail";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { TourList } from "./pages/admin/TourList";
import { TourEditor } from "./pages/admin/TourEditor";
import { TourRates } from "./pages/admin/TourRates";
import { TourSchedules } from "./pages/admin/TourSchedules";
import { AdminReservations } from "./pages/admin/AdminReservations";
import { AdminTestimonials } from "./pages/admin/AdminTestimonials";
import { RouteError } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: Home },
      { path: "tours", Component: TourListing },
      { path: "tour/:id", Component: TourDetail },
      { path: "checkout/:tourId", Component: Checkout },
      { path: "success", Component: Success },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminLayout,
    ErrorBoundary: RouteError,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "tours", Component: TourList },
      { path: "tours/new", Component: TourEditor },
      { path: "tours/:id/edit", Component: TourEditor },
      { path: "tours/:id/rates", Component: TourRates },
      { path: "tours/:id/schedules", Component: TourSchedules },
      { path: "reservas", Component: AdminReservations },
      { path: "testimonios", Component: AdminTestimonials },
    ],
  },
]);
