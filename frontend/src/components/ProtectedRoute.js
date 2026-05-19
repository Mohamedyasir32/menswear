import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const location =
    useLocation();

  const [loading,
    setLoading] =
    useState(true);

  const [authorized,
    setAuthorized] =
    useState(false);

  useEffect(() => {
    const checkAuth =
      async () => {
        try {
          const token =
            localStorage.getItem(
              "access"
            );

          const isStaff =
            localStorage.getItem(
              "is_staff"
            ) ===
            "true";

          // No token

          if (!token) {
            setAuthorized(
              false
            );

            setLoading(
              false
            );

            return;
          }

          // Admin Route Check

          if (
            adminOnly &&
            !isStaff
          ) {
            setAuthorized(
              false
            );

            setLoading(
              false
            );

            return;
          }

          // Success

          setAuthorized(
            true
          );

          setLoading(
            false
          );
        } catch (error) {
          console.log(
            error
          );

          setAuthorized(
            false
          );

          setLoading(
            false
          );
        }
      };

    checkAuth();
  }, [adminOnly]);

  // Loading Screen

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height:
            "100vh",
          background:
            "#f5f7fa",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-dark mb-3"
            role="status"
            style={{
              width:
                "4rem",
              height:
                "4rem",
            }}
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h5 className="fw-bold">
            Checking Authentication...
          </h5>

          <p className="text-muted">
            Please wait
          </p>
        </div>
      </div>
    );
  }

  // Not Authorized

  if (!authorized) {
    const token =
      localStorage.getItem(
        "access"
      );

    // Not Logged In

    if (!token) {
      return (
        <Navigate
          to="/login"
          replace
          state={{
            from:
              location,
          }}
        />
      );
    }

    // Normal user trying admin route

    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          height:
            "100vh",
          background:
            "#f5f7fa",
        }}
      >
        <div className="card border-0 shadow-lg p-5 text-center">
          <div
            className="mx-auto mb-4 rounded-circle bg-danger text-white d-flex align-items-center justify-content-center"
            style={{
              width:
                "90px",
              height:
                "90px",
              fontSize:
                "40px",
            }}
          >
            !
          </div>

          <h2 className="fw-bold mb-3">
            Access Denied
          </h2>

          <p className="text-muted mb-4">
            You are not authorized
            to access this page.
          </p>

          <button
            className="btn btn-dark px-4"
            onClick={() =>
              (window.location.href =
                "/products")
            }
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Authorized

  return children;
}

export default ProtectedRoute;