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
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";
import NearbyJobs from "../pages/professional/NearbyJobs";
import ProfessionalJobDetails from "../pages/professional/ProfessionalJobDetails";

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
