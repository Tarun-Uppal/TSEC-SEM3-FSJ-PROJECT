import { supabase } from "../lib/supabaseClient";

// =========================
// SIGN UP
// =========================

export async function signUpUser({
  email,
  password,
  fullName,
  userType,
  companyName,
  phone,
  address,
}) {
  // 1. Create Supabase Auth user
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

  // 2. Create profile
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

  // 3. Create consumer record
  if (userType === "consumer") {
    const { error: consumerError } = await supabase
      .from("consumers")
      .insert({
        user_id: user.id,
        full_name: fullName,
        email: email,
        phone: phone,
        address: address,
      });

    if (consumerError) {
      console.error("Consumer creation error:", consumerError);
      throw consumerError;
    }
  }

  // 4. Create company record
  if (userType === "company") {
    const { error: companyError } = await supabase
      .from("companies")
      .insert({
        user_id: user.id,
        company_name: companyName,
        contact_name: fullName,
        email: email,
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


// =========================
// LOGIN
// =========================

export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error);
    throw error;
  }

  return data.user;
}


// =========================
// GET USER PROFILE
// =========================

export async function getUserProfile() {
  // Get currently logged-in Auth user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    throw new Error("No logged-in user found");
  }

  console.log("Authenticated user ID:", user.id);

  // Get matching profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    throw profileError;
  }

  if (!profile) {
    console.error("No profile found for:", user.id);
    throw new Error("Profile not found for this user");
  }

  console.log("Profile:", profile);

  return profile;
}