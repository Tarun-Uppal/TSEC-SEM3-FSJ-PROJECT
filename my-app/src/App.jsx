import { BrowserRouter, Routes, Route } from "react-router";

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;