import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CreateWorkRequest from "../pages/customer/CreateWorkRequest";
import MyWorkRequests from "../pages/customer/MyWorkRequests";
import WorkRequestDetails from "../pages/customer/WorkRequestDetails";
import CustomerQuotes from "../pages/customer/CustomerQuotes";
import QuoteDetails from "../pages/customer/QuoteDetails";
import CreateBooking from "../pages/customer/CreateBooking";
import CustomerMyBookings from "../pages/customer/MyBookings";
import CustomerBookingDetails from "../pages/customer/BookingDetails";
import CustomerProfile from "../pages/customer/CustomerProfile";
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import NearbyJobs from "../pages/professional/NearbyJobs";
import ProfessionalJobDetails from "../pages/professional/ProfessionalJobDetails";
import CreateQuote from "../pages/professional/CreateQuote";
import MyQuotes from "../pages/professional/MyQuotes";
import EditQuote from "../pages/professional/EditQuote";
import ProfessionalQuoteDetails from "../pages/professional/ProfessionalQuoteDetails";
import MyBookings from "../pages/professional/MyBookings";
import ProfessionalBookingDetails from "../pages/professional/ProfessionalBookingDetails";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page at root */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/work-requests/new"
          element={<CreateWorkRequest />}
        />

        <Route
          path="/customer/work-requests"
          element={<MyWorkRequests />}
        />

        <Route
          path="/customer/work-requests/:id"
          element={<WorkRequestDetails />}
        />

        <Route
          path="/customer/work-requests/:id/quotes"
          element={<CustomerQuotes />}
        />

        <Route
          path="/customer/quotes/:id"
          element={<QuoteDetails />}
        />

        <Route
          path="/customer/bookings"
          element={<CustomerMyBookings />}
        />

        <Route
          path="/customer/bookings/create"
          element={<CreateBooking />}
        />

        <Route
          path="/customer/bookings/:id"
          element={<CustomerBookingDetails />}
        />

        <Route
          path="/customer/profile"
          element={<CustomerProfile />}
        />

        <Route
          path="/professional/dashboard"
          element={<ProfessionalDashboard />}
        />

        <Route
          path="/professional/jobs"
          element={<NearbyJobs />}
        />

        <Route
          path="/professional/jobs/:id"
          element={<ProfessionalJobDetails />}
        />

        <Route
          path="/professional/jobs/:id/quote"
          element={<CreateQuote />}
        />

        <Route
          path="/professional/quotes"
          element={<MyQuotes />}
        />

        <Route
          path="/professional/quotes/:id"
          element={<ProfessionalQuoteDetails />}
        />

        <Route
          path="/professional/quotes/:id/edit"
          element={<EditQuote />}
        />

        <Route
          path="/professional/bookings"
          element={<MyBookings />}
        />

        <Route
          path="/professional/bookings/:id"
          element={<ProfessionalBookingDetails />}
        />

        {/* Catch-all → landing */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
