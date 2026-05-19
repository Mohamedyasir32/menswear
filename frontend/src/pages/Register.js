import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return "Registration failed. Please check your internet or backend server.";
    }

    if (typeof data === "string") return data;

    if (Array.isArray(data)) return data[0];

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const firstValue = data[firstKey];

      if (Array.isArray(firstValue)) {
        return `${firstKey}: ${firstValue[0]}`;
      }

      return `${firstKey}: ${firstValue}`;
    }

    return "Registration failed. Please try again.";
  };

  const validateForm = () => {
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    if (!username) {
      alert("Please enter username");
      return false;
    }

    if (username.length < 3) {
      alert("Username must be at least 3 characters");
      return false;
    }

    if (!email) {
      alert("Please enter email");
      return false;
    }

    if (!password) {
      alert("Please enter password");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || loading) return;

    setLoading(true);

    try {
      await API.post("register/", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center py-4"
      style={{
        background: "linear-gradient(135deg, #000000, #343a40)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center align-items-center g-4">
          <div className="col-lg-5 d-none d-lg-block text-white">
            <h1 className="fw-bold display-4">Join MensWear</h1>

            <p className="lead mt-4">
              Discover premium menswear fashion, modern styles and exclusive
              collections.
            </p>

            <div className="mt-5">
              <div className="mb-3">✅ Premium Fashion</div>
              <div className="mb-3">✅ Secure Payments</div>
              <div className="mb-3">✅ Fast Delivery</div>
              <div className="mb-3">✅ Exclusive Discounts</div>
            </div>
          </div>

          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "20px" }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Create Account</h2>
                  <p className="text-muted mb-0">Register to continue shopping</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control form-control-lg"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={handleChange}
                      autoComplete="username"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>

                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <small className="text-muted">
                      Password must be at least 6 characters
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Register"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-bold text-dark">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-white mt-4">
              <small>MensWear Fashion Store © 2026</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;