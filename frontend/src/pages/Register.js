import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword,
    setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.password !==
      form.confirmPassword
    ) {
      alert(
        "Passwords do not match"
      );
      return;
    }

    if (
      form.password.length < 6
    ) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "register/",
        {
          username:
            form.username,
          email:
            form.email,
          password:
            form.password,
        }
      );

      alert(
        "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        "Registration failed"
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
              Join MensWear
            </h1>

            <p className="lead mt-4">
              Discover premium
              menswear fashion,
              modern styles and
              exclusive collections.
            </p>

            <div className="mt-5">
              <div className="mb-3">
                ✅ Premium Fashion
              </div>

              <div className="mb-3">
                ✅ Secure Payments
              </div>

              <div className="mb-3">
                ✅ Fast Delivery
              </div>

              <div className="mb-3">
                ✅ Exclusive Discounts
              </div>
            </div>
          </div>

          {/* Register Form */}

          <div className="col-lg-5 col-md-8">
            <div
              className="card border-0 shadow-lg"
              style={{
                borderRadius: "20px",
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">
                    Create Account
                  </h2>

                  <p className="text-muted">
                    Register to continue
                    shopping
                  </p>
                </div>

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

                  {/* Email */}

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Enter email"
                      value={
                        form.email
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

                    <small className="text-muted">
                      Password must be
                      at least 6
                      characters
                    </small>
                  </div>

                  {/* Confirm Password */}

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <div className="input-group">
                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        className="form-control form-control-lg"
                        placeholder="Confirm password"
                        value={
                          form.confirmPassword
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
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}

                  <button
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={
                      loading
                    }
                  >
                    {loading
                      ? "Creating Account..."
                      : "Register"}
                  </button>
                </form>

                {/* Login Link */}

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an
                    account?{" "}
                    <Link
                      to="/login"
                      className="fw-bold text-dark"
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div className="text-center text-white mt-4">
              <small>
                MensWear Fashion Store
                © 2026
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;