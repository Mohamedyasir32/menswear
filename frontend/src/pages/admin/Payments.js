import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    setLoading(true);

    try {
      const response = await API.get("admin/payments/");
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Admin only access or failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusValue = (status) => String(status || "").toLowerCase();

  const filteredPayments = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const username = payment.username || "";
      const productName = payment.product_name || "";
      const method = payment.payment_method || "";
      const status = getStatusValue(payment.status);

      const matchesSearch =
        username.toLowerCase().includes(keyword) ||
        productName.toLowerCase().includes(keyword) ||
        method.toLowerCase().includes(keyword) ||
        status.includes(keyword);

      const matchesMethod =
        methodFilter === "all" || method === methodFilter;

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesMethod && matchesStatus;
    });
  }, [payments, search, methodFilter, statusFilter]);

  const getStatusBadge = (status) => {
    const value = getStatusValue(status);

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

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Invalid date"
      : parsedDate.toLocaleString("en-IN");
  };

  const totalRevenue = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const successfulPayments = payments.filter((payment) =>
    ["paid", "success", "completed"].includes(getStatusValue(payment.status))
  ).length;

  const pendingPayments = payments.filter((payment) =>
    ["pending", "processing"].includes(getStatusValue(payment.status))
  ).length;

  const failedPayments = payments.filter((payment) =>
    ["failed", "cancelled", "canceled"].includes(getStatusValue(payment.status))
  ).length;

  const clearFilters = () => {
    setSearch("");
    setMethodFilter("all");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-muted">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg mb-4 overflow-hidden">
          <div
            className="p-4 p-md-5 text-white"
            style={{
              background: "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
              <div>
                <h1 className="fw-bold">Payments Dashboard</h1>
                <p className="mb-0 opacity-75">
                  Track transactions, payments and revenue
                </p>
              </div>

              <button
                className="btn btn-warning fw-bold align-self-start"
                onClick={fetchPayments}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <h4 className="fw-bold text-success mb-0">
                ₹ {formatAmount(totalRevenue)}
              </h4>
              <small className="text-muted">Total Revenue</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <h4 className="fw-bold text-primary mb-0">
                {successfulPayments}
              </h4>
              <small className="text-muted">Successful</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <h4 className="fw-bold text-warning mb-0">{pendingPayments}</h4>
              <small className="text-muted">Pending</small>
            </div>
          </div>

          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 text-center p-3">
              <h4 className="fw-bold text-danger mb-0">{failedPayments}</h4>
              <small className="text-muted">Failed</small>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-3 p-md-4">
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search customer, product, method or status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="all">All Methods</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-md-1 d-grid">
                <button className="btn btn-dark" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg d-none d-md-block">
          <div className="card-body p-4">
            <div className="table-responsive">
              <table className="table align-middle table-hover">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid Date</th>
                    <th>Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="fw-bold">
                          {payment.username || "Unknown User"}
                        </td>

                        <td className="fw-semibold">
                          {payment.product_name || "Unknown Product"}
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

                        <td>
                          <Link
                            to={`/invoice/${payment.id}`}
                            className="btn btn-outline-dark btn-sm"
                          >
                            Invoice
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="row g-3 d-md-none">
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
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
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

                    <div className="border rounded bg-light p-3 mb-3">
                      <p className="mb-2">
                        <strong>Method:</strong>{" "}
                        <span
                          className={`badge ${getMethodBadge(
                            payment.payment_method
                          )}`}
                        >
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

                    <Link
                      to={`/invoice/${payment.id}`}
                      className="btn btn-dark w-100"
                    >
                      View Invoice
                    </Link>
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