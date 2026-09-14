import React, { useEffect, useState } from "react";
import {
  getCompanyProfile,
  getUserProfile,
} from "../services/authService";

const CompanyDashboard = () => {
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
    </div >
  )
}

export default CompanyDashboard