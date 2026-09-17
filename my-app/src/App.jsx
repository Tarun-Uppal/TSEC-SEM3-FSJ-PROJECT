import { BrowserRouter, Routes, Route } from "react-router";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import ConsumerDashboard from "./pages/ConsumerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ClaimForm from "./pages/ClaimForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Consumer */}
        <Route
          path="/consumer/dashboard"
          element={
            <ProtectedRoute allowedType="consumer">
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Company */}
        <Route
          path="/company/dashboard"
          element={
            <ProtectedRoute allowedType="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Company */}
        <Route
          path="/ClaimForm"
          element={
            <ProtectedRoute allowedType="consumer">
              <ClaimForm />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;