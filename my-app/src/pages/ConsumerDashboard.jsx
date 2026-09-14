import React, { useEffect, useState } from "react";
import {
  getUserProfile, getConsumerProfile, logoutUser, getUserClaims
} from "../services/authService";

import { useNavigate } from "react-router";


const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const [profile, setProfile] = useState(null);
  const [consumerProfile, setConsumerProfile] = useState(null);
  const [claims, setClaims] = useState(null);
  useEffect(() => {
    async function loadUserData() {
      try {
        const userProfile = await getUserProfile()
        const consumerProfile = await getConsumerProfile()
        const userClaims = await getUserClaims()

        setClaims(userClaims);
        setConsumerProfile(consumerProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    loadUserData();
  }, []);

  if (!profile || !consumerProfile) {
    return <div>Loading...</div>;
  }

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
      {claims && claims.map((claim) => (
        <div key={claim.id}>
          <h2>Company Name: {claim.companies?.company_name}</h2>
          <h3>Claim ID: {claim.claim_number}</h3>
          <p>Status: {claim.status}</p>
          <p>Description: {claim.issue_details}</p>
          <p>Expiry Date: {claim.expiry_date}</p>
          <hr />
        </div>
      ))}
      <br />
      <br />
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};



export default ConsumerDashboard;