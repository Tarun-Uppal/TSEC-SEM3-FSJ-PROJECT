import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import {
  getConsumerProfile,
  getUserClaims,
  logoutUser,
} from "../services/authService";

const ConsumerDashboard = () => {
  const navigate = useNavigate();

  // Get logged-in user and common profile from AuthContext
  const { user, profile } = useAuth();

  const [consumerProfile, setConsumerProfile] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // LOAD CONSUMER DATA
  // ============================================

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [consumerData, claimsData] = await Promise.all([
          getConsumerProfile(user.id),
          getUserClaims(user.id),
        ]);

        setConsumerProfile(consumerData);
        setClaims(claimsData);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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

  if (loading || !profile || !consumerProfile) {
    return <div>Loading...</div>;
  }

  // ============================================
  // DASHBOARD
  // ============================================

  return (
    <div>
      <h1>Welcome, {profile.full_name}</h1>

      <p>Email: {profile.email}</p>

      <p>Phone: {consumerProfile.phone}</p>

      <p>Address: {consumerProfile.address}</p>

      <button onClick={() => navigate("/ClaimForm")}>
        Go to Claim Form
      </button>

      <br />
      <br />

      <h2>Your Warranty Claims</h2>

      {claims.length === 0 ? (
        <p>No warranty claims found.</p>
      ) : (
        claims.map((claim) => (
          <div key={claim.id}>
            <h3>
              Company Name:{" "}
              {claim.companies?.company_name || "Unknown Company"}
            </h3>

            <p>
              <strong>Claim ID:</strong> {claim.claim_number}
            </p>

            <p>
              <strong>Status:</strong> {claim.status}
            </p>

            <p>
              <strong>Description:</strong> {claim.issue_details}
            </p>

            <p>
              <strong>Expiry Date:</strong> {claim.expiry_date}
            </p>

            <hr />
          </div>
        ))
      )}

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default ConsumerDashboard;