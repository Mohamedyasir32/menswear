import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchAdminOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("admin/orders/");
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Admin only access or failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const productName = order.product_name || "";
      const user = String(order.user || "");
      const status = order.status || "";
      const orderId = String(order.id || "");

      return (
        productName.toLowerCase().includes(keyword) ||
        user.includes(keyword) ||
        status.toLowerCase().includes(keyword) ||
        orderId.includes(keyword)
      );
    });
  }, [orders, search]);

  const updateStatus = async (order, status) => {
    if (order.status === status) return;

    setUpdatingId(order.id);

    try {
      await API.patch(`admin/orders/update/${order.id}/`, {
        product: order.product,
        quantity: order.quantity,
        status,
      });

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.id === order.id ? { ...item, status } : item
        )
      );

      alert("Order status updated");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const getBadge = (status) => {
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

    return parsedDate.toLocaleDateString("en-IN");
  };

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total_price || 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading orders...</p>
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
                <h1 className="fw-bold">Orders Management</h1>
                <p className="mb-0 opacity-75">
                  Track and manage customer orders
                </p>
              </div>

              <button
                className="btn btn-warning fw-bold"
                onClick={fetchAdminOrders}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-danger" onClick={fetchAdminOrders}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold">{orders.length}</h2>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-warning">{pendingOrders}</h2>
                <p className="text-muted mb-0">Pending</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-primary">{confirmedOrders}</h2>
                <p className="text-muted mb-0">Confirmed</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-success">{deliveredOrders}</h2>
                <p className="text-muted mb-0">Delivered</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-danger">{cancelledOrders}</h2>
                <p className="text-muted mb-0">Cancelled</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body text-center p-4">
                <h2 className="fw-bold text-success">
                  ₹ {formatAmount(totalRevenue)}
                </h2>
                <p className="text-muted mb-0">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg mb-4">
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by product, user id, order id or status..."
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
                    <th>Order</th>
                    <th>User</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Update</th>
                    <th>Date</th>
                    <th>Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="fw-bold">#{order.id}</span>
                        </td>

                        <td>
                          <div className="fw-bold">#{order.user || "N/A"}</div>
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {order.product_name || "Unknown Product"}
                          </div>
                        </td>

                        <td>{order.quantity || 0}</td>

                        <td className="fw-bold text-success">
                          ₹ {formatAmount(order.total_price)}
                        </td>

                        <td>
                          <span
                            className={`badge ${getBadge(order.status)} px-3 py-2`}
                          >
                            {order.status || "unknown"}
                          </span>
                        </td>

                        <td>
                          <select
                            className="form-select"
                            value={order.status || ""}
                            disabled={updatingId === order.id}
                            onChange={(e) => updateStatus(order, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td>
                          <small>{formatDate(order.ordered_at)}</small>
                        </td>

                        <td>
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="btn btn-dark btn-sm"
                          >
                            View
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

        <div className="row g-4 d-md-none">
          {filteredOrders.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-lg">
                <div className="card-body text-center py-5">
                  No orders found
                </div>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div className="col-12" key={order.id}>
                <div className="card border-0 shadow-lg">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold mb-1">
                          {order.product_name || "Unknown Product"}
                        </h5>
                        <small className="text-muted">
                          Order #{order.id} • User #{order.user || "N/A"}
                        </small>
                      </div>

                      <span
                        className={`badge ${getBadge(order.status)} px-3 py-2`}
                      >
                        {order.status || "unknown"}
                      </span>
                    </div>

                    <p className="mb-2">
                      <strong>Quantity:</strong> {order.quantity || 0}
                    </p>

                    <p className="mb-2">
                      <strong>Total:</strong> ₹ {formatAmount(order.total_price)}
                    </p>

                    <p className="mb-3">
                      <strong>Date:</strong> {formatDate(order.ordered_at)}
                    </p>

                    <select
                      className="form-select mb-3"
                      value={order.status || ""}
                      disabled={updatingId === order.id}
                      onChange={(e) => updateStatus(order, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn btn-dark w-100"
                    >
                      View Details
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

export default Orders;