import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return "Login failed. Please check your internet or backend server.";
    }

    if (typeof data === "string") return data;

    if (data.detail) return data.detail;

    return "Invalid username or password.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = form.username.trim();
    const password = form.password.trim();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await API.post("login/", {
        username,
        password,
      });

      localStorage.setItem("access", loginResponse.data.access);
      localStorage.setItem("refresh", loginResponse.data.refresh);

      const userResponse = await API.get("me/");
      const user = userResponse.data;

      localStorage.setItem("username", user.username || username);
      localStorage.setItem("is_staff", String(Boolean(user.is_staff)));

      alert("Login successful");

      if (user.is_staff) {
        navigate("/admin/dashboard");
      } else {
        navigate("/products");
      }
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
            <h1 className="fw-bold display-4">Welcome Back</h1>

            <p className="lead mt-4">
              Login to continue shopping premium menswear fashion and manage
              your orders.
            </p>

            <div className="mt-5">
              <div className="mb-3">🔥 Trending Fashion</div>
              <div className="mb-3">🚚 Fast Delivery</div>
              <div className="mb-3">💳 Secure Payments</div>
              <div className="mb-3">⭐ Premium Quality</div>
            </div>
          </div>

          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Login</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
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
                    <label className="form-label fw-semibold">Password</label>

                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        autoComplete="current-password"
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
                  </div>

                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-4">
                    <div className="form-check">
                      <input
                        id="remember"
                        className="form-check-input"
                        type="checkbox"
                        name="remember"
                        checked={form.remember}
                        onChange={handleChange}
                      />

                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="fw-bold text-dark">
                      Register
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

export default Login;