import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await API.get("my-payments/");
      setPayments(response.data);
    } catch (error) {
      console.log(error);
      alert("Please login first");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "success") {
      return "bg-success";
    }

    if (status === "failed") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  const getPaymentIcon = (method) => {
    if (method === "Razorpay") {
      return "💳";
    }

    if (method === "UPI") {
      return "📱";
    }

    if (method === "Card") {
      return "💳";
    }

    return "💵";
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            Payment History
          </h2>

          <p className="text-muted">
            View all your payment transactions
          </p>
        </div>
      </div>

      {/* Empty State */}

      {payments.length === 0 ? (
        <div className="card shadow border-0 p-5 text-center">
          <h4>No Payment History Found</h4>

          <p className="text-muted">
            Your completed payments will appear here
          </p>

          <Link
            to="/products"
            className="btn btn-dark mt-3"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}

          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle shadow-sm">
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
                      {payment.product_name}
                    </td>

                    <td>
                      {getPaymentIcon(
                        payment.payment_method
                      )}{" "}
                      {payment.payment_method}
                    </td>

                    <td className="fw-bold text-success">
                      ₹ {payment.amount}
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td>
                      {new Date(
                        payment.paid_at
                      ).toLocaleString()}
                    </td>

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

          {/* Mobile Cards */}

          <div className="d-md-none">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="card shadow border-0 mb-3"
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">
                      {payment.product_name}
                    </h5>

                    <span
                      className={`badge ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <p className="mb-1">
                    <strong>Method:</strong>{" "}
                    {getPaymentIcon(
                      payment.payment_method
                    )}{" "}
                    {payment.payment_method}
                  </p>

                  <p className="mb-1">
                    <strong>Amount:</strong>{" "}
                    ₹ {payment.amount}
                  </p>

                  <p className="mb-3">
                    <strong>Date:</strong>{" "}
                    {new Date(
                      payment.paid_at
                    ).toLocaleString()}
                  </p>

                  <Link
                    to={`/invoice/${payment.id}`}
                    className="btn btn-dark w-100"
                  >
                    Download Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}

          <div className="card shadow border-0 mt-4 p-4">
            <div className="row text-center">
              <div className="col-md-4">
                <h4 className="fw-bold">
                  {payments.length}
                </h4>

                <p className="text-muted">
                  Total Payments
                </p>
              </div>

              <div className="col-md-4">
                <h4 className="fw-bold text-success">
                  ₹{" "}
                  {payments.reduce(
                    (total, item) =>
                      total + Number(item.amount),
                    0
                  )}
                </h4>

                <p className="text-muted">
                  Total Amount Paid
                </p>
              </div>

              <div className="col-md-4">
                <h4 className="fw-bold text-primary">
                  {
                    payments.filter(
                      (item) =>
                        item.status === "success"
                    ).length
                  }
                </h4>

                <p className="text-muted">
                  Successful Payments
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentHistory;