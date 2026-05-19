import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("admin/payments/");
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Admin only access or failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return payments;

    return payments.filter((payment) => {
      const username = payment.username || "";
      const productName = payment.product_name || "";
      const method = payment.payment_method || "";
      const status = payment.status || "";

      return (
        username.toLowerCase().includes(keyword) ||
        productName.toLowerCase().includes(keyword) ||
        method.toLowerCase().includes(keyword) ||
        status.toLowerCase().includes(keyword)
      );
    });
  }, [payments, search]);

  const getStatusBadge = (status) => {
    const value = String(status || "").toLowerCase();

    if (["paid", "success", "completed"].includes(value)) return "bg-success";
    if (["pending", "processing"].includes(value)) return "bg-warning text-dark";
    if (["failed", "cancelled", "canceled"].includes(value)) return "bg-danger";

    return "bg-secondary";
  };

  const getMethodBadge = (method) => {
    switch (method) {
      case "Razorpay":
        return "bg-primary";
      case "UPI":
        return "bg-success";
      case "Card":
        return "bg-dark";
      case "Cash on Delivery":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  const formatAmount = (amount) => {
    const value = Number(amount || 0);
    return value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    return parsedDate.toLocaleString("en-IN");
  };

  const totalRevenue = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const successfulPayments = payments.filter((payment) =>
    ["paid", "success", "completed"].includes(
      String(payment.status || "").toLowerCase()
    )
  ).length;

  const pendingPayments = payments.filter((payment) =>
    ["pending", "processing"].includes(String(payment.status || "").toLowerCase())
  ).length;

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading payments...</p>
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
                <h1 className="fw-bold">Payments Dashboard</h1>
                <p className="mb-0 opacity-75">
                  Track transactions, payments and revenue
                </p>
              </div>

              <button className="btn btn-warning fw-bold" onClick={fetchPayments}>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-danger" onClick={fetchPayments}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-success">₹ {formatAmount(totalRevenue)}</h2>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-primary">{successfulPayments}</h2>
                <p className="text-muted mb-0">Successful Payments</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-warning">{pendingPayments}</h2>
                <p className="text-muted mb-0">Pending Payments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg mb-4">
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by username, product, method or status..."
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
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <div className="fw-bold">
                            {payment.username || "Unknown User"}
                          </div>
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {payment.product_name || "Unknown Product"}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge ${getMethodBadge(
                              payment.payment_method
                            )} px-3 py-2`}
                          >
                            {payment.payment_method || "Unknown"}
                          </span>
                        </td>

                        <td className="fw-bold text-success">
                          ₹ {formatAmount(payment.amount)}
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              payment.status
                            )} px-3 py-2`}
                          >
                            {payment.status || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <small>{formatDate(payment.paid_at)}</small>
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
          {filteredPayments.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-lg">
                <div className="card-body text-center py-5">
                  No payments found
                </div>
              </div>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div className="col-12" key={payment.id}>
                <div className="card border-0 shadow-lg">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {payment.product_name || "Unknown Product"}
                        </h5>
                        <p className="text-muted mb-0">
                          {payment.username || "Unknown User"}
                        </p>
                      </div>

                      <span
                        className={`badge ${getStatusBadge(payment.status)} px-3 py-2`}
                      >
                        {payment.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mb-2">
                      <strong>Method:</strong>{" "}
                      <span className={`badge ${getMethodBadge(payment.payment_method)}`}>
                        {payment.payment_method || "Unknown"}
                      </span>
                    </p>

                    <p className="mb-2">
                      <strong>Amount:</strong> ₹ {formatAmount(payment.amount)}
                    </p>

                    <p className="mb-0">
                      <strong>Date:</strong> {formatDate(payment.paid_at)}
                    </p>
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

export default Payments;