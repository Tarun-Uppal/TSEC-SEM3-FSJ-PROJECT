import React, { useEffect, useState } from "react";
import {
  getCompanyProfile,
  getUserProfile, logoutUser, getCompanyClaims,
} from "../services/authService";

import { useNavigate } from "react-router";


const CompanyDashboard = () => {

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
  const [company, setCompany] = useState(null);
  const [claims, setClaims] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userProfile = await getUserProfile();
        const companyProfile = await getCompanyProfile();
        const companyClaims = await getCompanyClaims(companyProfile.user_id);

        setProfile(userProfile);
        setCompany(companyProfile);
        setClaims(companyClaims);

      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    loadUserData();
  }, []);

  if (!profile || !company) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Welcome, {profile.full_name}</h1>
      <p>Email: {profile.email}</p>
      <p>Company Name: {company.company_name}</p>
      <p>Company Address: {company.address}</p>
      {claims && claims.map((claim) => (
        <div key={claim.id}>
          <h2>Claim ID: {claim.claim_number}</h2>
          <p>Status: {claim.status}</p>
          <p>Consumer Name: {claim.profiles?.full_name}</p>
          <p>Consumer Email: {claim.profiles?.email}</p>
        </div>
      ))}
      <button onClick={handleLogout}>
        Logout
      </button>
    </div >
  )
}



export default CompanyDashboard