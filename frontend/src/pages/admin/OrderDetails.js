import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../api/axios";

function OrderDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(`admin/orders/${id}/`);
      setOrder(response.data || null);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "confirmed":
        return "bg-primary";
      case "delivered":
        return "bg-success";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
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

  const getProductImage = () => {
    return (
      order?.product_image ||
      order?.image_url ||
      order?.image ||
      "https://via.placeholder.com/500x500?text=No+Image"
    );
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error || "Order not found"}</span>
          <button className="btn btn-sm btn-danger" onClick={fetchOrder}>
            Retry
          </button>
        </div>

        <Link to="/admin/orders" className="btn btn-dark">
          ← Back to Orders
        </Link>
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="fw-bold">Order Details</h1>
                <p className="mb-0 opacity-75">
                  Complete order information, customer details and delivery address
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-light fw-bold" onClick={fetchOrder}>
                  Refresh
                </button>

                <Link to="/admin/orders" className="btn btn-warning fw-bold">
                  ← Back Orders
                </Link>
              </div>
            </div>
          </div>
        </div>

        {(!order.phone || !order.address) && (
          <div className="alert alert-warning shadow-sm">
            Delivery phone/address is missing for this order. Make sure checkout sends
            phone and address and backend saves them.
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg mb-4">
              <div className="card-body p-5">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h3 className="fw-bold mb-0">Order Summary</h3>

                  <span
                    className={`badge ${getStatusBadge(order.status)} px-4 py-2 fs-6`}
                  >
                    {order.status || "unknown"}
                  </span>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="border rounded p-3 bg-light h-100">
                      <h6 className="text-muted">Order ID</h6>
                      <h5 className="fw-bold">#{order.id}</h5>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 bg-light h-100">
                      <h6 className="text-muted">Ordered Date</h6>
                      <h5 className="fw-bold">{formatDate(order.ordered_at)}</h5>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 bg-light h-100">
                      <h6 className="text-muted">Quantity</h6>
                      <h5 className="fw-bold">{order.quantity || 0}</h5>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="border rounded p-3 bg-light h-100">
                      <h6 className="text-muted">Total Price</h6>
                      <h3 className="fw-bold text-success">
                        ₹ {formatAmount(order.total_price)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <h3 className="fw-bold mb-4">Product Details</h3>

                <div className="row align-items-center g-4">
                  <div className="col-md-4">
                    <img
                      src={getProductImage()}
                      alt={order.product_name || "Product"}
                      className="img-fluid rounded shadow-sm"
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500x500?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="col-md-8">
                    <h2 className="fw-bold">
                      {order.product_name || "Unknown Product"}
                    </h2>

                    <p className="text-muted">
                      Premium menswear fashion product
                    </p>

                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      {order.product_size && (
                        <span className="badge bg-dark">
                          Size: {order.product_size}
                        </span>
                      )}

                      {order.product_color && (
                        <span className="badge bg-secondary">
                          {order.product_color}
                        </span>
                      )}

                      {order.product_brand && (
                        <span className="badge bg-info text-dark">
                          {order.product_brand}
                        </span>
                      )}
                    </div>

                    <h3 className="text-success fw-bold">
                      ₹ {formatAmount(order.total_price)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-lg mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Customer Info</h4>

                <p>
                  <strong>User ID:</strong> #{order.user || "N/A"}
                </p>

                <p>
                  <strong>Username:</strong>{" "}
                  {order.username || "Not available"}
                </p>

                <p>
                  <strong>Email:</strong> {order.email || "Not available"}
                </p>

                <p className="mb-0">
                  <strong>Phone:</strong> {order.phone || "Not saved"}
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-lg mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Delivery Address</h4>

                <p className={order.address ? "text-dark mb-0" : "text-danger mb-0"}>
                  {order.address || "Address not saved for this order"}
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Payment Details</h4>

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.payment_method || "N/A"}
                </p>

                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span
                    className={`badge ${
                      order.payment_status === "failed"
                        ? "bg-danger"
                        : order.payment_status === "pending"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {order.payment_status || "Paid"}
                  </span>
                </p>

                <Link to={`/invoice/${order.id}`} className="btn btn-dark w-100">
                  View / Print Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-muted">
          <small>MensWear Admin Panel © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;