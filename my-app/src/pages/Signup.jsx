import { useState } from "react";
import { Link } from "react-router";
import { signUpUser } from "../services/authService";
import GoogleButton from "../components/GoogleButton";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "consumer",
    companyName: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email shown in the "check your inbox" message
  const [confirmEmail, setConfirmEmail] = useState("");

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

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Company name required for company accounts
    if (
      formData.userType === "company" &&
      !formData.companyName.trim()
    ) {
      setError("Please enter your company name");
      return;
    }

    try {
      setLoading(true);

      const { needsConfirmation } = await signUpUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType: formData.userType,
        companyName: formData.companyName,
        phone: formData.phone,
        address: formData.address,
      });

      // If "Confirm email" is on, the user must click the link first.
      // Otherwise they are logged in and PublicRoute redirects them.
      if (needsConfirmation) {
        setConfirmEmail(formData.email);
      }

    } catch (error) {
      console.error("SIGN UP ERROR:", error);

      setError(
        error?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#1d2421]">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-[#e4e7e4]/80 bg-[#f7f7f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-5 sm:px-6">

          <div className="flex items-center gap-3">

            {/* Logo */}

            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#173f3a] shadow-[0_4px_12px_rgba(23,63,58,0.14)]">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-white"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3.75 5.25 6.5v5.25c0 4.1 2.7 7.55 6.75 8.5 4.05-.95 6.75-4.4 6.75-8.5V6.5L12 3.75Z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.5 12 1.7 1.7 3.4-3.7"
                />
              </svg>

            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#356b62]">
                Resolv360
              </p>

              <p className="mt-0.5 text-[12px] font-medium tracking-[-0.01em] text-[#727a76]">
                Warranty Management
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* ========================================
          MAIN
      ======================================== */}

      <main className="flex min-h-[calc(100vh-74px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-14">

        <div className="w-full max-w-[520px]">

          {/* ====================================
              INTRO
          ==================================== */}

          <div className="mb-7 text-center">

            <div className="mb-4 flex justify-center">

              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#edf4f1] text-[#356b62]">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="12" cy="8" r="3.25" />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.5 19.25c.75-3.15 3.05-5 6.5-5s5.75 1.85 6.5 5"
                  />
                </svg>

              </div>

            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#4d766e]">
              Get Started
            </p>

            <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#18201d] sm:text-[36px]">
              Create an account
            </h1>

            <p className="mt-2.5 text-[14px] leading-6 text-[#747c78]">
              Create your Resolv360 account to get started.
            </p>

          </div>

          {/* ====================================
              SIGNUP CARD
          ==================================== */}

          <div className="overflow-hidden rounded-[24px] border border-[#e2e6e3] bg-white shadow-[0_14px_45px_rgba(24,39,34,0.055)]">

            {/* Card Header */}

            <div className="border-b border-[#eceeec] bg-[#fcfcfb] px-6 py-5 sm:px-7">

              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#202824]">
                Account Details
              </h2>

              <p className="mt-0.5 text-[12px] text-[#858c88]">
                Enter your information to create your account.
              </p>

            </div>

            {/* ==================================
                FORM
            ================================== */}

            {confirmEmail ? (
              <div className="px-6 py-8 text-center sm:px-7">

                <h3 className="text-[16px] font-semibold tracking-[-0.02em] text-[#202824]">
                  Check your email
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-[#747c78]">
                  We sent a confirmation link to{" "}
                  <span className="font-semibold text-[#303934]">{confirmEmail}</span>.
                  Click it to activate your account, then log in.
                </p>

              </div>
            ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6 sm:px-7 sm:py-7"
            >

              {/* =================================
                  FULL NAME
              ================================= */}

              <div>

                <label
                  htmlFor="fullName"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                >
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
                  className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                />

              </div>

              {/* =================================
                  ACCOUNT TYPE
              ================================= */}

              <div>

                <label
                  htmlFor="userType"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                >
                  Account Type
                </label>

                <div className="relative">

                  <select
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="h-11 w-full appearance-none rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 pr-10 text-[13px] font-medium text-[#303934] outline-none transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  >
                    <option value="consumer">
                      Consumer
                    </option>

                    <option value="company">
                      Company
                    </option>
                  </select>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89918d]"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m7 10 5 5 5-5"
                    />
                  </svg>

                </div>

              </div>

              {/* =================================
                  COMPANY NAME
              ================================= */}

              {formData.userType === "company" && (
                <div>

                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
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
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>
              )}

              {/* =================================
                  EMAIL + PHONE
              ================================= */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
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
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>

              </div>

              {/* =================================
                  ADDRESS
              ================================= */}

              <div>

                <label
                  htmlFor="address"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                >
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
                  className="min-h-[92px] w-full resize-none rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 py-3 text-[13px] font-medium leading-5 text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                />

              </div>

              {/* =================================
                  PASSWORD
              ================================= */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>

              </div>

              {/* =================================
                  ERROR
              ================================= */}

              {error && (
                <div className="rounded-[13px] border border-[#ead9d6] bg-[#fcf5f3] px-4 py-3">

                  <div className="flex items-start gap-2.5">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#a05c52]"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <circle cx="12" cy="12" r="8.25" />

                      <path
                        strokeLinecap="round"
                        d="M12 8v4.5M12 15.5h.01"
                      />
                    </svg>

                    <p className="text-[12px] leading-5 text-[#8d554d]">
                      {error}
                    </p>

                  </div>

                </div>
              )}

              {/* =================================
                  SUBMIT
              ================================= */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#173f3a] px-4 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(23,63,58,0.14)] transition-all duration-200 hover:bg-[#123732] hover:shadow-[0_7px_18px_rgba(23,63,58,0.18)] focus:outline-none focus:ring-4 focus:ring-[#32675e]/[0.14] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#8a9a95] disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Creating account...

                  </span>
                ) : (
                  "Create account"
                )}
              </button>

              {/* DIVIDER */}

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#eceeec]" />
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#a1a8a4]">
                  or
                </p>
                <div className="h-px flex-1 bg-[#eceeec]" />
              </div>

              {/* GOOGLE */}

              <GoogleButton onError={setError} />

            </form>
            )}

            {/* ==================================
                LOGIN LINK
            ================================== */}

            <div className="border-t border-[#eceeec] bg-[#fcfcfb] px-6 py-5 text-center sm:px-7">

              <p className="text-[12px] text-[#858c88]">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#356b62] transition-colors duration-200 hover:text-[#173f3a] hover:underline"
                >
                  Log in
                </Link>

              </p>

            </div>

          </div>

          {/* ====================================
              SECURITY NOTE
          ==================================== */}

          <div className="mt-6 flex items-center justify-center gap-2">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5 text-[#8e9792]"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3.75 5.5 6.4v5.1c0 4 2.6 7.35 6.5 8.25 3.9-.9 6.5-4.25 6.5-8.25V6.4L12 3.75Z"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.7 12 1.5 1.5 3.1-3.3"
              />
            </svg>

            <p className="text-[11px] text-[#969e9a]">
              Your account information is securely protected.
            </p>

          </div>

        </div>

      </main>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="pb-7 text-center">

        <div className="flex items-center justify-center gap-2">

          <div className="h-1 w-1 rounded-full bg-[#a4aca8]" />

          <p className="text-[11px] text-[#969e9a]">
            Resolv360 Warranty Management Portal
          </p>

          <div className="h-1 w-1 rounded-full bg-[#a4aca8]" />

        </div>

      </footer>

    </div>
  );
}

export default Signup;
