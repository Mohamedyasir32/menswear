import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);

    try {
      const response = await API.get("my-payments/");
      setPayments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Please login first");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusBadge = (status) => {
    const value = String(status || "").toLowerCase();

    if (["success", "paid", "completed"].includes(value)) return "bg-success";
    if (["failed", "cancelled"].includes(value)) return "bg-danger";

    return "bg-warning text-dark";
  };

  const getPaymentIcon = (method) => {
    if (method === "Razorpay") return "💳";
    if (method === "UPI") return "📱";
    if (method === "Card") return "💳";
    return "💵";
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) => {
    if (!date) return "Not available";
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime())
      ? "Invalid date"
      : parsed.toLocaleString("en-IN");
  };

  const totalAmount = payments.reduce(
    (total, item) => total + Number(item.amount || 0),
    0
  );

  const successCount = payments.filter((item) =>
    ["success", "paid", "completed"].includes(
      String(item.status || "").toLowerCase()
    )
  ).length;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">Payment History</h2>
            <p className="text-muted mb-0">View all your payment transactions</p>
          </div>

          <Link to="/products" className="btn btn-dark align-self-start">
            Continue Shopping
          </Link>
        </div>

        {payments.length === 0 ? (
          <div className="card shadow border-0 p-4 p-md-5 text-center">
            <div style={{ fontSize: "60px" }}>💳</div>
            <h4 className="fw-bold mt-3">No Payment History Found</h4>
            <p className="text-muted">Your completed payments will appear here</p>

            <Link to="/products" className="btn btn-dark mt-3">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card border-0 shadow-sm text-center p-3">
                  <h4 className="fw-bold mb-0">{payments.length}</h4>
                  <small className="text-muted">Total Payments</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm text-center p-3">
                  <h4 className="fw-bold text-success mb-0">
                    ₹ {formatAmount(totalAmount)}
                  </h4>
                  <small className="text-muted">Total Amount Paid</small>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card border-0 shadow-sm text-center p-3">
                  <h4 className="fw-bold text-primary mb-0">{successCount}</h4>
                  <small className="text-muted">Successful Payments</small>
                </div>
              </div>
            </div>

            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle shadow-sm bg-white">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">
                        {payment.product_name || "Product"}
                      </td>
                      <td>
                        {getPaymentIcon(payment.payment_method)}{" "}
                        {payment.payment_method || "Unknown"}
                      </td>
                      <td className="fw-bold text-success">
                        ₹ {formatAmount(payment.amount)}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(payment.status)}`}>
                          {payment.status || "Unknown"}
                        </span>
                      </td>
                      <td>{formatDate(payment.paid_at)}</td>
                      <td>
                        <Link
                          to={`/invoice/${payment.id}`}
                          className="btn btn-sm btn-dark"
                        >
                          Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-md-none">
              {payments.map((payment) => (
                <div key={payment.id} className="card shadow border-0 mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <h5 className="fw-bold">{payment.product_name || "Product"}</h5>
                      <span className={`badge ${getStatusBadge(payment.status)}`}>
                        {payment.status || "Unknown"}
                      </span>
                    </div>

                    <p className="mb-1">
                      <strong>Method:</strong>{" "}
                      {getPaymentIcon(payment.payment_method)}{" "}
                      {payment.payment_method || "Unknown"}
                    </p>

                    <p className="mb-1">
                      <strong>Amount:</strong> ₹ {formatAmount(payment.amount)}
                    </p>

                    <p className="mb-3">
                      <strong>Date:</strong> {formatDate(payment.paid_at)}
                    </p>

                    <Link to={`/invoice/${payment.id}`} className="btn btn-dark w-100">
                      Download Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Payments;