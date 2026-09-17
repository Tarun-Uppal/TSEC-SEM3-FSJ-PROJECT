import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  getCompanyProfile,
  getCompanyClaims,
  logoutUser,
} from "../services/authService";

const CompanyDashboard = () => {
  const navigate = useNavigate();

  // Get logged-in user and common profile from AuthContext
  const { user, profile } = useAuth();

  const [company, setCompany] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD COMPANY DATA
  // ============================================

  useEffect(() => {
    if (!user?.id) return;

    const loadCompanyData = async () => {
      try {
        setLoading(true);

        // Get company profile and claims
        const companyProfile = await getCompanyProfile(user.id);

        const companyClaims = await getCompanyClaims(user.id);

        setCompany(companyProfile);
        setClaims(companyClaims);
      } catch (error) {
        console.error("Error loading company data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [user?.id]);

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading || !profile || !company) {
    return <div>Loading...</div>;
  }

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div>
      <h1>Welcome, {profile.full_name}</h1>

      <p>Email: {profile.email}</p>

      <p>Company Name: {company.company_name}</p>

      <p>Company Address: {company.address}</p>

      <h2>Warranty Claims</h2>

      {claims.length === 0 ? (
        <p>No warranty claims found.</p>
      ) : (
        claims.map((claim) => (
          <div key={claim.id}>
            <h3>Claim ID: {claim.claim_number}</h3>

            <p>
              <strong>Status:</strong> {claim.status}
            </p>

            <p>
              <strong>Consumer Name:</strong>{" "}
              {claim.profiles?.full_name || "Unknown"}
            </p>

            <p>
              <strong>Consumer Email:</strong>{" "}
              {claim.profiles?.email || "Unknown"}
            </p>

            <hr />
          </div>
        ))
      )}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default CompanyDashboard;