import { useParams, Link } from "react-router-dom";

function Invoice() {
  const { id } = useParams();

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="min-vh-100 py-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg mx-auto" style={{ maxWidth: "850px" }}>
          <div className="card-body p-5">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h2 className="fw-bold mb-1">
                  Mens<span className="text-warning">Wear</span>
                </h2>
                <p className="text-muted mb-0">Premium Menswear Fashion Store</p>
              </div>

              <div className="text-end">
                <h4 className="fw-bold">INVOICE</h4>
                <span className="badge bg-success">Paid</span>
              </div>
            </div>

            <hr />

            <div className="row my-4">
              <div className="col-md-6">
                <h6 className="text-muted">Invoice ID</h6>
                <h5 className="fw-bold">INV-{id}</h5>
              </div>

              <div className="col-md-6 text-md-end">
                <h6 className="text-muted">Invoice Date</h6>
                <h5 className="fw-bold">{new Date().toLocaleDateString()}</h5>
              </div>
            </div>

            <div className="card bg-light border-0 p-4 mb-4">
              <h5 className="fw-bold mb-3">Payment Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Status</span>
                <span className="fw-bold text-success">Paid / Confirmed</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Payment Reference</span>
                <span className="fw-bold">PAY-{id}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Store</span>
                <span className="fw-bold">MensWear</span>
              </div>
            </div>

            <div className="alert alert-success">
              Thank you for shopping with MensWear. Your order has been recorded successfully.
            </div>

            <div className="d-flex gap-2 mt-4 print-hide">
              <button className="btn btn-dark" onClick={printInvoice}>
                Download / Print Invoice
              </button>

              <Link to="/payments" className="btn btn-outline-secondary">
                Back to Payments
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            .navbar,
            .print-hide {
              display: none !important;
            }

            body {
              background: white !important;
            }

            .card {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Invoice;