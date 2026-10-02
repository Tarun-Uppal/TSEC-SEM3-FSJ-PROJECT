import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";

import { useAuth } from "../context/AuthContext";
import { createProfileRows, logoutUser } from "../services/authService";

/*
  Shown to logged-in users who do not have a profile yet:

  - Password signups: details were saved in user metadata at signup,
    so the profile is created automatically.
  - Email OTP / Google users: they fill in the form below.
*/

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]";

const inputClass =
  "h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]";

function CompleteProfile() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const metadata = user?.user_metadata ?? {};
  const hasSignupDetails = ["consumer", "company"].includes(metadata.user_type);

  const [formData, setFormData] = useState({
    fullName: metadata.full_name || metadata.name || "",
    userType: "consumer",
    companyName: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoFailed, setAutoFailed] = useState(false);

  const autoStarted = useRef(false);

  // ============================================
  // AUTO-CREATE FOR PASSWORD SIGNUPS
  // ============================================

  useEffect(() => {
    if (!user || profile || !hasSignupDetails || autoStarted.current) {
      return;
    }

    autoStarted.current = true;

    const metadata = user.user_metadata;

    createProfileRows({
      userId: user.id,
      email: user.email,
      fullName: metadata.full_name,
      userType: metadata.user_type,
      companyName: metadata.company_name,
      phone: metadata.phone,
      address: metadata.address,
    })
      .then(refreshProfile)
      .catch((error) => {
        console.error("Auto profile creation error:", error);

        setError(error?.message || "Unable to set up your account.");
        setAutoFailed(true);
      });
  }, [user, profile, hasSignupDetails, refreshProfile]);

  // ============================================
  // REDIRECTS
  // ============================================

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile) {
    return (
      <Navigate
        to={
          profile.user_type === "company"
            ? "/company/dashboard"
            : "/consumer/dashboard"
        }
        replace
      />
    );
  }

  if (hasSignupDetails && !autoFailed) {
    return <div>Setting up your account...</div>;
  }

  // ============================================
  // FORM
  // ============================================

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      formData.userType === "company" &&
      !formData.companyName.trim()
    ) {
      setError("Please enter your company name");
      return;
    }

    try {
      setLoading(true);

      await createProfileRows({
        userId: user.id,
        email: user.email,
        fullName: formData.fullName.trim(),
        userType: formData.userType,
        companyName: formData.companyName.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      // Profile now exists, so this page redirects to the dashboard
      await refreshProfile();
    } catch (error) {
      console.error("Complete profile error:", error);

      setError(error?.message || "Unable to save your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-4 py-10 text-[#1d2421] sm:px-6 sm:py-14">

      <div className="mx-auto w-full max-w-[520px]">

        {/* INTRO */}

        <div className="mb-7 text-center">

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#4d766e]">
            One last step
          </p>

          <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#18201d] sm:text-[36px]">
            Complete your profile
          </h1>

          <p className="mt-2.5 text-[14px] leading-6 text-[#747c78]">
            Signed in as {user.email}
          </p>

        </div>

        {/* CARD */}

        <div className="overflow-hidden rounded-[24px] border border-[#e2e6e3] bg-white shadow-[0_14px_45px_rgba(24,39,34,0.055)]">

          <form
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-6 sm:px-7 sm:py-7"
          >

            {/* FULL NAME */}

            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>

            {/* ACCOUNT TYPE */}

            <div>
              <label htmlFor="userType" className={labelClass}>
                Account Type
              </label>

              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
                className={inputClass}
              >
                <option value="consumer">Consumer</option>
                <option value="company">Company</option>
              </select>
            </div>

            {/* COMPANY NAME */}

            {formData.userType === "company" && (
              <div>
                <label htmlFor="companyName" className={labelClass}>
                  Company Name
                </label>

                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  autoComplete="organization"
                  className={inputClass}
                />
              </div>
            )}

            {/* PHONE */}

            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                className={inputClass}
              />
            </div>

            {/* ADDRESS */}

            <div>
              <label htmlFor="address" className={labelClass}>
                Address
              </label>

              <textarea
                id="address"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className={`${inputClass} h-auto min-h-[92px] resize-none py-3 leading-5`}
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-[13px] border border-[#ead9d6] bg-[#fcf5f3] px-4 py-3">
                <p className="text-[12px] leading-5 text-[#8d554d]">
                  {error}
                </p>
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#173f3a] px-4 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(23,63,58,0.14)] transition-all duration-200 hover:bg-[#123732] focus:outline-none focus:ring-4 focus:ring-[#32675e]/[0.14] disabled:cursor-not-allowed disabled:bg-[#8a9a95] disabled:shadow-none"
            >
              {loading ? "Saving..." : "Continue"}
            </button>

          </form>

          <div className="border-t border-[#eceeec] bg-[#fcfcfb] px-6 py-5 text-center sm:px-7">
            <button
              type="button"
              onClick={handleLogout}
              className="text-[12px] font-semibold text-[#356b62] transition-colors duration-200 hover:text-[#173f3a] hover:underline"
            >
              Use a different account
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default CompleteProfile;
