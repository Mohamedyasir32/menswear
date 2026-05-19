import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("admin/users/");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Admin only access or failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return users;

    return users.filter((user) => {
      const username = user.username || "";
      const email = user.email || "";
      const role = user.is_staff ? "admin" : "user";

      return (
        username.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword) ||
        role.includes(keyword)
      );
    });
  }, [users, search]);

  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.is_staff).length;
  const normalUsers = users.filter((user) => !user.is_staff).length;

  const getInitial = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg mb-5 overflow-hidden">
          <div
            className="p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <h1 className="fw-bold">Users Management</h1>
                <p className="mb-0 opacity-75">
                  View and manage registered users
                </p>
              </div>

              <button className="btn btn-warning fw-bold" onClick={fetchUsers}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-danger" onClick={fetchUsers}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold">{totalUsers}</h2>
                <p className="text-muted mb-0">Total Users</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-danger">{adminUsers}</h2>
                <p className="text-muted mb-0">Admin Users</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-primary">{normalUsers}</h2>
                <p className="text-muted mb-0">Normal Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg mb-4">
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by username, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card border-0 shadow-lg d-none d-md-block">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <span className="fw-bold">#{user.id}</span>
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                              style={{
                                width: "45px",
                                height: "45px",
                                fontWeight: "bold",
                              }}
                            >
                              {getInitial(user.username)}
                            </div>

                            <div>
                              <h6 className="mb-0 fw-bold">
                                {user.username || "Unknown User"}
                              </h6>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="text-muted">
                            {user.email || "No email"}
                          </span>
                        </td>

                        <td>
                          {user.is_staff ? (
                            <span className="badge bg-danger px-3 py-2">
                              Admin
                            </span>
                          ) : (
                            <span className="badge bg-primary px-3 py-2">
                              User
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row g-4 d-md-none">
          {filteredUsers.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-lg">
                <div className="card-body text-center py-5">
                  No users found
                </div>
              </div>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div className="col-12" key={user.id}>
                <div className="card border-0 shadow-lg">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          fontWeight: "bold",
                        }}
                      >
                        {getInitial(user.username)}
                      </div>

                      <div>
                        <h5 className="mb-0">
                          {user.username || "Unknown User"}
                        </h5>
                        <small className="text-muted">#{user.id}</small>
                      </div>
                    </div>

                    <p className="text-muted mb-3">
                      {user.email || "No email"}
                    </p>

                    {user.is_staff ? (
                      <span className="badge bg-danger px-3 py-2">Admin</span>
                    ) : (
                      <span className="badge bg-primary px-3 py-2">User</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-5 text-muted">
          <small>MensWear Admin Panel © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default Users;