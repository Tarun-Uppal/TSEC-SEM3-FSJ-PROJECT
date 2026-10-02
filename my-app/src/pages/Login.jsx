import { useState } from "react";
import { Link } from "react-router";
<<<<<<< Updated upstream
import { loginUser, getUserProfile } from "../services/authService";
import { useNavigate } from "react-router";


function Login() {
  const navigate = useNavigate();
=======
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

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      const user = await loginUser({ email: formData.email, password: formData.password, });

      console.log("Logged in user:", user);

      alert("Login successful!");
      const profile = await getUserProfile(user.id);
      console.log("User profile:", profile);


      // We will redirect to the dashboard.
      if (profile.user_type === "company") {
        navigate("/company/dashboard");
      } else if (profile.user_type === "consumer") {
        navigate("/consumer/dashboard");
=======
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
>>>>>>> Stashed changes
      }

    } catch (error) {
      console.error(error);

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Log in to your account</p>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

<<<<<<< Updated upstream
        </form>
=======
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
>>>>>>> Stashed changes

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;