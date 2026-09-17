import { useState } from "react";
import { Link } from "react-router";
import { loginUser, getUserProfile } from "../services/authService";
import { useNavigate } from "react-router";


function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

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

        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;