import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [form, setForm] =
    useState({
      username: "",
      password: "",
      remember: false,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const loginResponse =
        await API.post(
          "login/",
          {
            username:
              form.username,
            password:
              form.password,
          }
        );

      localStorage.setItem(
        "access",
        loginResponse.data.access
      );

      localStorage.setItem(
        "refresh",
        loginResponse.data.refresh
      );

      const userResponse =
        await API.get("me/");

      localStorage.setItem(
        "username",
        userResponse.data.username
      );

      localStorage.setItem(
        "is_staff",
        userResponse.data.is_staff
      );

      alert("Login successful");

      if (
        userResponse.data
          .is_staff
      ) {
        navigate(
          "/admin/dashboard"
        );
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.log(error);

      alert(
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(135deg, #000000, #343a40)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center align-items-center">
          {/* Left Side */}

          <div className="col-lg-5 d-none d-lg-block text-white">
            <h1 className="fw-bold display-4">
              Welcome Back
            </h1>

            <p className="lead mt-4">
              Login to continue
              shopping premium
              menswear fashion and
              manage your orders.
            </p>

            <div className="mt-5">
              <div className="mb-3">
                🔥 Trending Fashion
              </div>

              <div className="mb-3">
                🚚 Fast Delivery
              </div>

              <div className="mb-3">
                💳 Secure Payments
              </div>

              <div className="mb-3">
                ⭐ Premium Quality
              </div>
            </div>
          </div>

          {/* Login Card */}

          <div className="col-lg-5 col-md-8">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-5">
                {/* Header */}

                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    Login
                  </h2>

                  <p className="text-muted">
                    Sign in to your
                    account
                  </p>
                </div>

                {/* Form */}

                <form
                  onSubmit={
                    handleSubmit
                  }
                >
                  {/* Username */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Username
                    </label>

                    <input
                      type="text"
                      name="username"
                      className="form-control form-control-lg"
                      placeholder="Enter username"
                      value={
                        form.username
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  {/* Password */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <div className="input-group">
                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        value={
                          form.password
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                      >
                        {showPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Remember */}

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="remember"
                        checked={
                          form.remember
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <label className="form-check-label">
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

                  {/* Login Button */}

                  <button
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "Logging in..."
                      : "Login"}
                  </button>
                </form>

                {/* Register */}

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Don&apos;t have
                    an account?{" "}
                    <Link
                      to="/register"
                      className="fw-bold text-dark"
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="text-center text-white mt-4">
              <small>
                MensWear Fashion
                Store © 2026
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;