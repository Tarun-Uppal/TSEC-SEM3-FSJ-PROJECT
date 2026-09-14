import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import CompanyDashboard from "./pages/CompanyDashboard";
import ConsumerDashboard from "./pages/ConsumerDashboard";

import ClaimForm from "./pages/ClaimForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/ClaimForm" element={<ClaimForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;