import { Navigate, useLocation, useNavigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("access");
  const isStaff = localStorage.getItem("is_staff") === "true";

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  if (adminOnly && !isStaff) {
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center px-3"
        style={{ background: "#f5f7fa" }}
      >
        <div
          className="card border-0 shadow-lg text-center p-4 p-md-5"
          style={{ maxWidth: "520px", width: "100%" }}
        >
          <div
            className="mx-auto mb-4 rounded-circle bg-danger text-white d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              fontSize: "42px",
              fontWeight: "bold",
            }}
          >
            !
          </div>

          <h2 className="fw-bold mb-3">Access Denied</h2>

          <p className="text-muted mb-4">
            You are logged in, but you do not have admin permission to access
            this page.
          </p>

          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <button
              className="btn btn-dark px-4"
              onClick={() => navigate("/products")}
            >
              Back to Products
            </button>

            <button
              className="btn btn-outline-danger px-4"
              onClick={() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("is_staff");
                localStorage.removeItem("username");
                navigate("/login");
              }}
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;