import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Invoice() {
  const { id } = useParams();

  const invoiceDate = useMemo(
    () => new Date().toLocaleDateString(),
    []
  );

  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);

    return date.toLocaleDateString();
  }, []);

  const printInvoice = () => {
    toast.success("Preparing invoice...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div
      className="min-vh-100 py-4 py-md-5"
      style={{ background: "#f5f7fa" }}
    >
      <div className="container">
        <div
          className="card border-0 shadow-lg mx-auto overflow-hidden"
          style={{
            maxWidth: "900px",
            borderRadius: "24px",
          }}
        >
          {/* Header */}

          <div
            className="text-white p-4 p-md-5"
            style={{
              background:
                "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
              <div>
                <h2 className="fw-bold mb-1">
                  Mens
                  <span className="text-warning">
                    Wear
                  </span>
                </h2>

                <p className="mb-0 opacity-75">
                  Premium Menswear Fashion Store
                </p>
              </div>

              <div className="text-md-end">
                <h3 className="fw-bold mb-2">
                  INVOICE
                </h3>

                <span className="badge bg-success px-3 py-2">
                  Payment Successful
                </span>
              </div>
            </div>
          </div>

          {/* Body */}

          <div className="card-body p-4 p-md-5">
            {/* Invoice Info */}

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card border-0 bg-light h-100 p-3">
                  <small className="text-muted">
                    Invoice ID
                  </small>

                  <h5 className="fw-bold mb-0">
                    INV-{id}
                  </h5>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card border-0 bg-light h-100 p-3 text-md-end">
                  <small className="text-muted">
                    Invoice Date
                  </small>

                  <h5 className="fw-bold mb-0">
                    {invoiceDate}
                  </h5>
                </div>
              </div>
            </div>

            {/* Billing */}

            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-3">
                    Billing Information
                  </h5>

                  <p className="mb-1 fw-semibold">
                    Customer
                  </p>

                  <p className="text-muted mb-2">
                    MensWear Customer
                  </p>

                  <p className="mb-1 fw-semibold">
                    Payment Method
                  </p>

                  <p className="text-muted mb-2">
                    Online Payment
                  </p>

                  <p className="mb-1 fw-semibold">
                    Delivery Estimate
                  </p>

                  <p className="text-success fw-semibold mb-0">
                    {estimatedDelivery}
                  </p>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-0 shadow-sm p-4 h-100">
                  <h5 className="fw-bold mb-3">
                    Payment Summary
                  </h5>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Status</span>

                    <span className="fw-bold text-success">
                      Paid / Confirmed
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Reference</span>

                    <span className="fw-bold">
                      PAY-{id}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Store</span>

                    <span className="fw-bold">
                      MensWear
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Support</span>

                    <span className="fw-bold">
                      24/7 Available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Message */}

            <div
              className="alert border-0 shadow-sm"
              style={{
                background: "#e8fff1",
                color: "#146c43",
              }}
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    minWidth: "45px",
                    fontWeight: "bold",
                  }}
                >
                  ✓
                </div>

                <div>
                  <h5 className="fw-bold">
                    Payment Successful
                  </h5>

                  <p className="mb-0">
                    Thank you for shopping with
                    MensWear. Your order has
                    been successfully confirmed
                    and invoice generated.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}

            <div className="d-grid d-md-flex gap-2 mt-4 print-hide">
              <button
                className="btn btn-dark px-4 py-3"
                onClick={printInvoice}
              >
                Download / Print Invoice
              </button>

              <Link
                to="/payments"
                className="btn btn-outline-secondary px-4 py-3"
              >
                Back to Payments
              </Link>

              <Link
                to="/products"
                className="btn btn-warning px-4 py-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="text-center mt-4 text-muted">
          <small>
            MensWear Fashion Store • Secure
            Invoice System
          </small>
        </div>
      </div>

      {/* Print CSS */}

      <style>
        {`
          @media print {

            body {
              background: white !important;
            }

            .navbar,
            .print-hide {
              display: none !important;
            }

            .card {
              box-shadow: none !important;
              border: none !important;
            }

            .container {
              max-width: 100% !important;
            }

            .card-body {
              padding: 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Invoice;