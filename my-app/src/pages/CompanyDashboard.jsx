import React, { useEffect, useState } from "react";
import {
  getCompanyProfile,
  getUserProfile, logoutUser
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

  useEffect(() => {
    async function loadUserData() {
      try {
        const userProfile = await getUserProfile();
        const companyProfile = await getCompanyProfile();

        setProfile(userProfile);
        setCompany(companyProfile);
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

      <button onClick={handleLogout}>
        Logout
      </button>
    </div >
  )
}



export default CompanyDashboard