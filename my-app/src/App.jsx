import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import ConsumerDashboard from "./pages/ConsumerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ClaimForm from "./pages/ClaimForm";
import CompleteProfile from "./pages/CompleteProfile";

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

        {/* Logged in, but no profile yet (email OTP / Google) */}
        <Route path="/complete-profile" element={<CompleteProfile />} />

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

        {/* Claim form */}
        <Route
          path="/ClaimForm"
          element={
            <ProtectedRoute allowedType="consumer">
              <ClaimForm />
            </ProtectedRoute>
          }
        />

        {/* Site root and unknown URLs.
            Supabase may send users here after Google / email sign-in.
            PublicRoute waits for the session, then redirects to the
            dashboard; logged-out users go to the login page. */}
        <Route
          path="*"
          element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;