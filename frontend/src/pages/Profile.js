import { useEffect, useState } from "react";
import API from "../api/axios";

function Profile() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("profile/");

        setForm(response.data);

        localStorage.setItem(
          "username",
          response.data.username
        );
      } catch (error) {
        console.log(error);

        alert("Please login first");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const token =
      localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      await API.patch("profile/", {
        email: form.email,
        phone: form.phone,
        address: form.address,
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.log(
        error.response?.data || error
      );

      alert(
        "Profile update failed. Please login again."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-dark"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 overflow-hidden">
            {/* Top Banner */}

            <div
              className="bg-dark text-white text-center p-5"
              style={{
                background:
                  "linear-gradient(135deg, #000000, #343a40)",
              }}
            >
              {/* Avatar */}

              <div
                className="rounded-circle bg-warning d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "40px",
                  fontWeight: "bold",
                }}
              >
                {form.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <h2 className="fw-bold">
                {form.username}
              </h2>

              <p className="mb-0">
                MensWear Customer
              </p>
            </div>

            {/* Profile Content */}

            <div className="p-4">
              <div className="row">
                {/* Left Side */}

                <div className="col-md-4 mb-4">
                  <div className="card border-0 shadow-sm p-3">
                    <h5 className="fw-bold mb-3">
                      Account Info
                    </h5>

                    <p className="mb-2">
                      <strong>Username:</strong>
                    </p>

                    <p className="text-muted">
                      {form.username}
                    </p>

                    <p className="mb-2">
                      <strong>Email:</strong>
                    </p>

                    <p className="text-muted">
                      {form.email || "Not added"}
                    </p>

                    <p className="mb-2">
                      <strong>Phone:</strong>
                    </p>

                    <p className="text-muted">
                      {form.phone || "Not added"}
                    </p>
                  </div>

                  {/* Stats */}

                  <div className="card border-0 shadow-sm p-3 mt-4">
                    <h5 className="fw-bold mb-3">
                      Profile Status
                    </h5>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Email Verified</span>

                      <span className="badge bg-success">
                        Active
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span>Account Status</span>

                      <span className="badge bg-primary">
                        Customer
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span>Membership</span>

                      <span className="badge bg-warning text-dark">
                        Premium
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}

                <div className="col-md-8">
                  <div className="card border-0 shadow-sm p-4">
                    <h4 className="fw-bold mb-4">
                      Edit Profile
                    </h4>

                    <form onSubmit={updateProfile}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Username
                        </label>

                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          value={
                            form.username || ""
                          }
                          disabled
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Email Address
                        </label>

                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={
                            form.email || ""
                          }
                          onChange={handleChange}
                          placeholder="Enter email"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          value={
                            form.phone || ""
                          }
                          onChange={handleChange}
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          Address
                        </label>

                        <textarea
                          name="address"
                          rows="4"
                          className="form-control"
                          value={
                            form.address || ""
                          }
                          onChange={handleChange}
                          placeholder="Enter delivery address"
                        />
                      </div>

                      <button className="btn btn-dark w-100 py-2 fw-bold">
                        Update Profile
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}

          <div className="text-center mt-4 text-muted">
            <small>
              MensWear Fashion Store •
              Secure Customer Profile
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;