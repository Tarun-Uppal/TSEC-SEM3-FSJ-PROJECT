import { supabase } from "../lib/supabaseClient";


// ==========================================
// SIGN UP
// ==========================================
export async function signUpUser({
  email,
  password,
  fullName,
  userType,
  companyName,
  phone,
  address,
}) {

  // ------------------------------------------
  // 1. Create Supabase Auth user
  // ------------------------------------------
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: userType,
      },
    },
  });
  if (error) {
    throw error;
  }
  const user = data.user;
  if (!user) {
    throw new Error("User was not created");
  }


  // ------------------------------------------
  // 2. Create common profile
  // ------------------------------------------
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      full_name: fullName,
      email: email,
      user_type: userType,
    });
  if (profileError) {
    console.error("Profile creation error:", profileError);
    throw profileError;
  }


  // ------------------------------------------
  // 3. Create consumer information
  // ------------------------------------------
  if (userType === "consumer") {
    const { error: consumerError } = await supabase
      .from("consumers")
      .insert({
        user_id: user.id,
        phone: phone,
        address: address,
      });
    if (consumerError) {
      console.error("Consumer creation error:", consumerError);
      throw consumerError;
    }
  }


  // ------------------------------------------
  // 4. Create company information
  // ------------------------------------------
  if (userType === "company") {
    const { error: companyError } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        company_name: companyName,
        contact_name: fullName,
        phone: phone,
        address: address,
      });
    if (companyError) {
      console.error("Company creation error:", companyError);
      throw companyError;
    }
  }
  return user;
}


// ==========================================
// LOGIN
// ==========================================
export async function loginUser({ email, password }) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  if (error) {
    console.error("Supabase login error:", error);
    throw error;
  }
  return data.user;
}


// ==========================================
// GET CURRENT AUTH USER
// ==========================================
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }  if (!user) {
    throw new Error("No logged-in user found");
  }
  return user;
}


// ==========================================
// GET COMMON USER PROFILE
// ==========================================
export async function getUserProfile() {
  const user = await getCurrentUser();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("Profile fetch error:", error);
    throw error;
  }
  return profile;
}


// ==========================================
// GET CONSUMER INFORMATION
// ==========================================
export async function getConsumerProfile() {
  const user = await getCurrentUser();
  const { data: consumer, error } = await supabase
    .from("consumers")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) {
    console.error("Consumer fetch error:", error);
    throw error;
  }
  return consumer;
}


// ==========================================
// GET COMPANY INFORMATION
// ==========================================
export async function getCompanyProfile() {
  const user = await getCurrentUser();
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) {
    console.error("Company fetch error:", error);
    throw error;
  }
  return company;
}


// ==========================================
// LOGOUT
// ==========================================

export async function logoutUser() {
  console.log("Logging out user...");
  const { error } = await supabase.auth.signOut();
  console.log("User logged out.");
  if (error) {
    throw error;
  }
}