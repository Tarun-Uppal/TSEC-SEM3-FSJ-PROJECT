import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUpUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

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

      await signUpUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        userType: formData.userType,
        companyName: formData.companyName,
        phone: formData.phone,
        address: formData.address,
      });

      alert("Account created successfully!");

      // Send user to login page
      navigate("/login");

    } catch (error) {
      console.error("SIGN UP ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>Create an account</h1>
        <p>Sign up to get started</p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Account Type */}
          <div>
            <label>Account Type</label>

            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="consumer">
                Consumer
              </option>

              <option value="company">
                Company
              </option>
            </select>
          </div>

          {/* Company Name */}
          {formData.userType === "company" && (
            <div>
              <label>Company Name</label>

              <input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Sign up"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;