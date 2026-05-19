import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    try {
      const response = await API.get("profile/");
      const data = response.data || {};

      setForm({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
      });

      if (data.username) {
        localStorage.setItem("username", data.username);
      }
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Please login first");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getInitial = () => {
    return form.username ? form.username.charAt(0).toUpperCase() : "U";
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) {
      return "Profile update failed. Please check your connection.";
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

    return "Profile update failed. Please try again.";
  };

  const validateProfile = () => {
    if (form.email && !form.email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }

    if (form.phone && form.phone.trim().length < 8) {
      alert("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!validateProfile()) return;

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      return;
    }

    setSaving(true);

    try {
      await API.patch("profile/", {
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error.response?.data || error);
      alert(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="card shadow-lg border-0 overflow-hidden">
              <div
                className="text-white text-center p-4 p-md-5"
                style={{
                  background: "linear-gradient(135deg, #000000, #343a40)",
                }}
              >
                <div
                  className="rounded-circle bg-warning text-dark d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    fontSize: "40px",
                    fontWeight: "bold",
                  }}
                >
                  {getInitial()}
                </div>

                <h2 className="fw-bold mb-1">{form.username || "User"}</h2>
                <p className="mb-0 opacity-75">MensWear Customer</p>
              </div>

              <div className="p-3 p-md-4">
                <div className="row g-4">
                  <div className="col-lg-4">
                    <div className="card border-0 shadow-sm p-3 h-100">
                      <h5 className="fw-bold mb-3">Account Info</h5>

                      <p className="mb-2">
                        <strong>Username:</strong>
                      </p>
                      <p className="text-muted text-break">
                        {form.username || "Not available"}
                      </p>

                      <p className="mb-2">
                        <strong>Email:</strong>
                      </p>
                      <p className="text-muted text-break">
                        {form.email || "Not added"}
                      </p>

                      <p className="mb-2">
                        <strong>Phone:</strong>
                      </p>
                      <p className="text-muted text-break">
                        {form.phone || "Not added"}
                      </p>

                      <p className="mb-2">
                        <strong>Address:</strong>
                      </p>
                      <p className="text-muted text-break mb-0">
                        {form.address || "Not added"}
                      </p>
                    </div>

                    <div className="card border-0 shadow-sm p-3 mt-4">
                      <h5 className="fw-bold mb-3">Profile Status</h5>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Email</span>
                        <span
                          className={`badge ${
                            form.email ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {form.email ? "Added" : "Missing"}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Phone</span>
                        <span
                          className={`badge ${
                            form.phone ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {form.phone ? "Added" : "Missing"}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span>Account</span>
                        <span className="badge bg-primary">Customer</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-3 p-md-4">
                      <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-4">
                        <div>
                          <h4 className="fw-bold mb-1">Edit Profile</h4>
                          <p className="text-muted mb-0">
                            Update your contact and delivery details
                          </p>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-dark align-self-start"
                          onClick={fetchProfile}
                          disabled={saving}
                        >
                          Refresh
                        </button>
                      </div>

                      <form onSubmit={updateProfile}>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Username
                          </label>

                          <input
                            type="text"
                            name="username"
                            className="form-control form-control-lg"
                            value={form.username || ""}
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
                            className="form-control form-control-lg"
                            value={form.email || ""}
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
                            className="form-control form-control-lg"
                            value={form.phone || ""}
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
                            value={form.address || ""}
                            onChange={handleChange}
                            placeholder="Enter delivery address"
                          />
                        </div>

                        <button
                          className="btn btn-dark w-100 py-3 fw-bold"
                          disabled={saving}
                        >
                          {saving ? "Updating..." : "Update Profile"}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4 text-muted">
              <small>MensWear Fashion Store • Secure Customer Profile</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;