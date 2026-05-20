import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response = await API.get("my-orders/");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Please login first");
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (orderId) => {
    setPayingId(orderId);

    try {
      await API.post("payments/create/", {
        order: orderId,
        payment_method: "Cash on Delivery",
      });

      toast.success("Payment completed");
      fetchOrders();
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Payment failed or already paid");
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success";
      case "confirmed":
        return "bg-primary";
      case "shipped":
        return "bg-info text-dark";
      case "cancelled":
        return "bg-danger";
      case "pending":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  const formatStatus = (status) => {
    return String(status || "pending").replaceAll("_", " ").toUpperCase();
  };

  const totalSpent = useMemo(() => {
    return orders.reduce((total, item) => total + Number(item.total_price || 0), 0);
  }, [orders]);

  const deliveredCount = orders.filter((item) => item.status === "delivered").length;
  const pendingCount = orders.filter((item) => item.status === "pending").length;

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Orders</h2>
            <p className="text-muted mb-0">Track and manage your orders</p>
          </div>

          <Link to="/products" className="btn btn-dark">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card shadow border-0 p-4 p-md-5 text-center">
            <div style={{ fontSize: "60px" }}>📦</div>
            <h4 className="fw-bold mt-3">No Orders Found</h4>
            <p className="text-muted">Start shopping to place your first order</p>

            <Link to="/products" className="btn btn-dark mt-3">
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100">
                  <h4 className="fw-bold mb-0">{orders.length}</h4>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100">
                  <h4 className="fw-bold text-success mb-0">
                    ₹ {totalSpent.toLocaleString("en-IN")}
                  </h4>
                  <small className="text-muted">Total Spent</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100">
                  <h4 className="fw-bold text-primary mb-0">{deliveredCount}</h4>
                  <small className="text-muted">Delivered</small>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100">
                  <h4 className="fw-bold text-warning mb-0">{pendingCount}</h4>
                  <small className="text-muted">Pending</small>
                </div>
              </div>
            </div>

            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle shadow-sm bg-white">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Invoice</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order.id}>
                      <td>{index + 1}</td>

                      <td className="fw-semibold">{order.product_name || "Product"}</td>

                      <td>{order.quantity}</td>

                      <td className="fw-bold text-success">
                        ₹ {Number(order.total_price || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      <td>
                        {order.status === "pending" ? (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => makePayment(order.id)}
                            disabled={payingId === order.id}
                          >
                            {payingId === order.id ? "Processing..." : "Pay Now"}
                          </button>
                        ) : (
                          <span className="badge bg-success">Paid</span>
                        )}
                      </td>

                      <td>
                        <Link
                          to={`/invoice/${order.id}`}
                          className="btn btn-outline-dark btn-sm"
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
              {orders.map((order) => (
                <div key={order.id} className="card shadow border-0 mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {order.product_name || "Product"}
                        </h5>
                        <small className="text-muted">Order ID: #{order.id}</small>
                      </div>

                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>

                    <div className="border rounded p-3 bg-light my-3">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Quantity</span>
                        <strong>{order.quantity}</strong>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Total</span>
                        <strong className="text-success">
                          ₹ {Number(order.total_price || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      {order.status === "pending" ? (
                        <button
                          className="btn btn-success"
                          onClick={() => makePayment(order.id)}
                          disabled={payingId === order.id}
                        >
                          {payingId === order.id ? "Processing..." : "Pay Now"}
                        </button>
                      ) : (
                        <span className="badge bg-success p-2">
                          Payment Completed
                        </span>
                      )}

                      <Link
                        to={`/invoice/${order.id}`}
                        className="btn btn-outline-dark"
                      >
                        View Invoice
                      </Link>
                    </div>
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

export default MyOrders;