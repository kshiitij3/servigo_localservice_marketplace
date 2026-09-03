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
import ProfessionalDashboard from "../pages/professional/ProfessionalDashboard";

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
          path="/professional/dashboard"
          element={<ProfessionalDashboard />}
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
