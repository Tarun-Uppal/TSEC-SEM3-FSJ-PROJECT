import React, { useEffect, useState } from "react";
import {
  getUserProfile,getConsumerProfile,
} from "../services/authService";

const ConsumerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [consumerProfile, setConsumerProfile] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userProfile = await getUserProfile()
        const consumerProfile = await getConsumerProfile()
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
    </div>
  );
};

export default ConsumerDashboard;