import { useState } from "react";
import { Link } from "react-router";
import {
  loginUser,
  sendEmailOtp,
  verifyEmailOtp,
} from "../services/authService";
import GoogleButton from "../components/GoogleButton";

/*
  After a successful login, AuthContext picks up the new session and
  PublicRoute redirects to the right dashboard (or to Complete Profile
  for new email-code / Google users).
*/

function Login() {
  // "password" or "code"
  const [method, setMethod] = useState("password");
  const [codeSent, setCodeSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMethod = (newMethod) => {
    setMethod(newMethod);
    setCodeSent(false);
    setError("");
    setFormData({ ...formData, code: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      if (method === "password") {
        await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else if (!codeSent) {
        await sendEmailOtp(formData.email.trim());
        setCodeSent(true);
      } else {
        await verifyEmailOtp({
          email: formData.email.trim(),
          token: formData.code.trim(),
        });
      }
    } catch (error) {
      console.error(error);

      setError(
        error?.message || "Unable to log in. Please check your credentials."
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

        <div className="w-full max-w-[430px]">

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
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-[#4d766e]">
              Secure Portal
            </p>

            <h1 className="text-[32px] font-semibold tracking-[-0.045em] text-[#18201d] sm:text-[36px]">
              Welcome back
            </h1>

            <p className="mt-2.5 text-[14px] leading-6 text-[#747c78]">
              Sign in to manage your warranty account.
            </p>

          </div>

          {/* ====================================
              LOGIN CARD
          ==================================== */}

          <div className="overflow-hidden rounded-[24px] border border-[#e2e6e3] bg-white shadow-[0_14px_45px_rgba(24,39,34,0.055)]">

            {/* Card Header */}

            <div className="border-b border-[#eceeec] bg-[#fcfcfb] px-6 py-5 sm:px-7">

              <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#202824]">
                Sign in
              </h2>

              <p className="mt-0.5 text-[12px] text-[#858c88]">
                Enter your account details below.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6 sm:px-7 sm:py-7"
            >

              {/* LOGIN METHOD */}

              <div className="grid grid-cols-2 gap-1 rounded-[12px] border border-[#e2e6e3] bg-[#f3f5f3] p-1">

                <button
                  type="button"
                  onClick={() => switchMethod("password")}
                  className={`h-9 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${
                    method === "password"
                      ? "bg-white text-[#173f3a] shadow-[0_2px_6px_rgba(24,39,34,0.08)]"
                      : "text-[#7d8581] hover:text-[#303934]"
                  }`}
                >
                  Password
                </button>

                <button
                  type="button"
                  onClick={() => switchMethod("code")}
                  className={`h-9 rounded-[10px] text-[12px] font-semibold transition-all duration-200 ${
                    method === "code"
                      ? "bg-white text-[#173f3a] shadow-[0_2px_6px_rgba(24,39,34,0.08)]"
                      : "text-[#7d8581] hover:text-[#303934]"
                  }`}
                >
                  Email code
                </button>

              </div>

              {/* EMAIL */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="email"
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
                    Email Address
                  </label>

                  {codeSent && (
                    <button
                      type="button"
                      onClick={() => switchMethod("code")}
                      className="text-[11px] font-semibold text-[#356b62] hover:text-[#173f3a] hover:underline"
                    >
                      Change email
                    </button>
                  )}

                </div>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={codeSent}
                  autoComplete="email"
                  className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08] disabled:text-[#89918d]"
                />

              </div>

              {/* PASSWORD */}

              {method === "password" && (
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[13px] font-medium text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                </div>
              )}

              {/* EMAIL CODE */}

              {method === "code" && codeSent && (
                <div>

                  <label
                    htmlFor="code"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7d8581]"
                  >
                    Verification Code
                  </label>

                  <input
                    id="code"
                    type="text"
                    name="code"
                    placeholder="6-digit code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="h-11 w-full rounded-[12px] border border-[#dfe4e1] bg-[#fafbf9] px-3.5 text-[15px] font-semibold tracking-[0.3em] text-[#303934] outline-none placeholder:text-[#a1a8a4] transition-all duration-200 hover:border-[#cfd6d2] focus:border-[#32675e] focus:bg-white focus:ring-4 focus:ring-[#32675e]/[0.08]"
                  />

                  <p className="mt-1.5 text-[11px] text-[#969e9a]">
                    We sent a code to {formData.email}. Check your spam folder if you don't see it.
                  </p>

                </div>
              )}

              {method === "code" && !codeSent && (
                <p className="text-[11px] leading-5 text-[#969e9a]">
                  We'll email you a 6-digit code. New here? An account is created for you.
                </p>
              )}


              {/* ERROR */}

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

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#173f3a] px-4 text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(23,63,58,0.14)] transition-all duration-200 hover:bg-[#123732] hover:shadow-[0_7px_18px_rgba(23,63,58,0.18)] focus:outline-none focus:ring-4 focus:ring-[#32675e]/[0.14] active:translate-y-px disabled:cursor-not-allowed disabled:bg-[#8a9a95] disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2.5">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    {method === "code" && !codeSent ? "Sending code..." : "Logging in..."}

                  </span>
                ) : method === "code" && !codeSent ? (
                  "Send code"
                ) : method === "code" ? (
                  "Verify & log in"
                ) : (
                  "Log in"
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

            {/* SIGN UP */}

            <div className="border-t border-[#eceeec] bg-[#fcfcfb] px-6 py-5 text-center sm:px-7">

              <p className="text-[12px] text-[#858c88]">

                Don't have an account?{" "}

                <Link
                  to="/signup"
                  className="font-semibold text-[#356b62] transition-colors duration-200 hover:text-[#173f3a] hover:underline"
                >
                  Create an account
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

export default Login;
