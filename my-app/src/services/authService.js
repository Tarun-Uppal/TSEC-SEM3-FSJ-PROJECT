import { supabase } from "../lib/supabaseClient";

// ============================================
// SIGN UP
// ============================================

/*
  Profile rows are NOT created here. All signup details are saved in
  the auth user's metadata, and the Complete Profile page creates the
  rows on first login (see createProfileRows).

  This works whether or not "Confirm email" is turned on in Supabase,
  and is the same path used by email OTP and Google sign-ins.

  Returns { user, needsConfirmation }.
*/

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
      emailRedirectTo: window.location.origin,
      data: {
        full_name: fullName,
        user_type: userType,
        company_name: companyName || null,
        phone: phone || null,
        address: address || null,
      },
    },
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error("User was not created");
  }

  return {
    user: data.user,
    needsConfirmation: !data.session,
  };
}


// ============================================
// CREATE PROFILE ROWS
// ============================================

/*
  Creates the profiles row plus the consumers or companies row
  for a logged-in user who does not have a profile yet.
*/

export async function createProfileRows({
  userId,
  email,
  fullName,
  userType,
  companyName,
  phone,
  address,
}) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!["consumer", "company"].includes(userType)) {
    throw new Error("Please choose an account type");
  }

  // Create common profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
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
        user_id: userId,
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
        user_id: userId,
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
// EMAIL OTP (CODE) LOGIN
// ============================================

/*
  Sends a 6-digit code to the email address. If no account exists
  yet, Supabase creates one and the user is sent to the Complete
  Profile page after verifying the code.

  The Supabase email templates must include {{ .Token }} for the
  code to appear in the email.
*/

export async function sendEmailOtp(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) {
    console.error("Email OTP send error:", error);
    throw error;
  }
}

export async function verifyEmailOtp({ email, token }) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.error("Email OTP verify error:", error);
    throw error;
  }

  return data.user;
}


// ============================================
// GOOGLE LOGIN
// ============================================

/*
  Redirects to Google. After signing in, Google sends the user back
  to /login, where PublicRoute forwards them to their dashboard or
  to the Complete Profile page.
*/

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    console.error("Google login error:", error);
    throw error;
  }
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

// Returns null if the user has not completed their profile yet.

export async function getUserProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, user_type")
    .eq("id", userId)
    .maybeSingle();

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

// ============================================
// UPDATE WARRANTY CLAIM STATUS
// ============================================

export async function updateClaimStatus(claimId, status) {
  if (!claimId) {
    throw new Error("Claim ID is required");
  }

  const allowedStatuses = ["submitted", "received", "resolved"];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      `Invalid claim status. Allowed statuses: ${allowedStatuses.join(", ")}`
    );
  }

  const { data, error } = await supabase
    .from("warranty_claims")
    .update({
      status: status,
    })
    .eq("id", claimId)
    .select("*");

  if (error) {
    console.error("Claim status update error:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Claim was not updated. Check the claim ID and Supabase RLS policies."
    );
  }

  return data[0];
}