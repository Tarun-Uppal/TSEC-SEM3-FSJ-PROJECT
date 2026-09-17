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
      email,
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
        phone: phone || null,
        address: address || null,
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
        company_name: companyName || null,
        contact_name: fullName,
        phone: phone || null,
        address: address || null,
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

/*
  IMPORTANT:

  This uses the locally stored Supabase session.

  Do NOT use this repeatedly throughout the app.
  Your AuthContext should normally provide the user.

  This function is still useful for places where
  you genuinely need to retrieve the current session.
*/

export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  const user = session?.user;

  if (!user) {
    throw new Error("No logged-in user found");
  }

  return user;
}


// ============================================
// GET COMMON USER PROFILE
// ============================================

export async function getUserProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, user_type")
    .eq("id", userId)
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

export async function getConsumerProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: consumer, error } = await supabase
    .from("consumers")
    .select("user_id, phone, address")
    .eq("user_id", userId)
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

export async function getCompanyProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select(
      "user_id, company_name, contact_name, phone, address"
    )
    .eq("user_id", userId)
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

export async function getUserClaims(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: claims, error } = await supabase
    .from("warranty_claims")
    .select(`
      *,
      companies (
        company_name
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Claims fetch error:", error);
    throw error;
  }

  return claims;
}


// ============================================
// GET COMPANY CLAIMS
// ============================================

export async function getCompanyClaims(companyId) {
  if (!companyId) {
    throw new Error("Company ID is required");
  }

  const { data: claims, error } = await supabase
    .from("warranty_claims")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Company claims fetch error:", error);
    throw error;
  }

  return claims;
}


// ============================================
// CREATE WARRANTY CLAIM
// ============================================

export async function createClaim({
  userId,
  companyId,
  productName,
  expiryDate,
  serialNumber,
  purchaseDate,
  issueDetails,
}) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!companyId) {
    throw new Error("Company ID is required");
  }

  const claimNumber = `CLM-${Date.now()}`;

  const { data, error } = await supabase
    .from("warranty_claims")
    .insert({
      claim_number: claimNumber,
      user_id: userId,
      company_id: companyId,
      product_name: productName,
      expiry_date: expiryDate,
      serial_number: serialNumber || null,
      purchase_date: purchaseDate || null,
      issue_details: issueDetails,
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