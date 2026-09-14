import { supabase } from "../lib/supabaseClient";


// ============================================
// SIGN UP
// ============================================

export async function signUpUser({
  email,
  password,
  fullName,
  userType,
  companyName,
  phone,
  address,
}) {
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

  // Create common profile
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

  // Create consumer profile
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

  // Create company profile
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


// ============================================
// LOGIN
// ============================================

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


// ============================================
// GET CURRENT AUTH USER
// ============================================

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("No logged-in user found");
  }

  return user;
}


// ============================================
// GET COMMON USER PROFILE
// ============================================

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


// ============================================
// GET CONSUMER INFORMATION
// ============================================

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


// ============================================
// GET COMPANY INFORMATION
// ============================================

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


// ============================================
// GET ALL COMPANIES
// ============================================

export async function getCompanies() {
  const { data: companies, error } = await supabase
    .from("companies")
    .select("user_id, company_name")
    .order("company_name", { ascending: true });

  if (error) {
    console.error("Companies fetch error:", error);
    throw error;
  }
  return companies;
}

export async function getUserClaims() {
  const user = await getCurrentUser();

  const { data: claims, error } = await supabase
    .from("warranty_claims")
    .select(`
      *,
      companies (
        company_name
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Claims fetch error:", error);
    throw error;
  }

  return claims;
}

export async function getCompanyClaims() {
  const companyProfile = await getCompanyProfile();

  const { data: claims, error } = await supabase
    .from("warranty_claims")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq("company_id", companyProfile.user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Company claims fetch error:", error);
    throw error;
  }

  console.log("Company claims:", claims);

  return claims;
}

// ============================================
// CREATE WARRANTY CLAIM
// ============================================

export async function createClaim({
  companyId,
  productName,
  expiryDate,
  serialNumber,
  purchaseDate,
  issueDetails,
}) {
  // Get currently logged-in consumer
  const user = await getCurrentUser();

  // Generate unique claim number
  const claimNumber = `CLM-${Date.now()}`;

  const { data, error } = await supabase
    .from("warranty_claims")
    .insert({
      claim_number: claimNumber,

      // Logged-in consumer
      user_id: user.id,

      // Selected company
      company_id: companyId,

      product_name: productName,
      expiry_date: expiryDate,
      serial_number: serialNumber || null,
      purchase_date: purchaseDate || null,
      issue_details: issueDetails,

      // Database also has a default for this,
      // but explicitly setting it is fine.
      status: "submitted",
    })
    .select()
    .single();

  if (error) {
    console.error("Warranty claim creation error:", error);
    throw error;
  }

  return data;
}


// ============================================
// LOGOUT
// ============================================

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}