import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("my-orders/");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
      alert("Please login first");
    }
  };

  const makePayment = async (orderId) => {
    try {
      await API.post("payments/create/", {
        order: orderId,
        payment_method: "Cash on Delivery",
      });

      alert("Payment completed");

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert("Payment failed or already paid");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "delivered") {
      return "bg-success";
    }

    if (status === "confirmed") {
      return "bg-primary";
    }

    if (status === "cancelled") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            My Orders
          </h2>

          <p className="text-muted">
            Track and manage your orders
          </p>
        </div>

        <Link
          to="/products"
          className="btn btn-dark"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Empty Orders */}

      {orders.length === 0 ? (
        <div className="card shadow border-0 p-5 text-center">
          <h4>No Orders Found</h4>

          <p className="text-muted">
            Start shopping to place your first order
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
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {order.product_name}
                    </td>

                    <td>{order.quantity}</td>

                    <td className="fw-bold text-success">
                      ₹ {order.total_price}
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {order.status === "pending" ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            makePayment(order.id)
                          }
                        >
                          Pay Now
                        </button>
                      ) : (
                        <span className="badge bg-success">
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}

          <div className="d-md-none">
            {orders.map((order) => (
              <div
                key={order.id}
                className="card shadow border-0 mb-3"
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">
                      {order.product_name}
                    </h5>

                    <span
                      className={`badge ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="mb-1">
                    <strong>Quantity:</strong>{" "}
                    {order.quantity}
                  </p>

                  <p className="mb-1">
                    <strong>Total:</strong> ₹{" "}
                    {order.total_price}
                  </p>

                  <div className="mt-3">
                    {order.status === "pending" ? (
                      <button
                        className="btn btn-success w-100"
                        onClick={() =>
                          makePayment(order.id)
                        }
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="badge bg-success w-100 p-2">
                        Payment Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}

          <div className="card shadow border-0 mt-4 p-4">
            <div className="row text-center">
              <div className="col-md-3">
                <h4 className="fw-bold">
                  {orders.length}
                </h4>

                <p className="text-muted">
                  Total Orders
                </p>
              </div>

              <div className="col-md-3">
                <h4 className="fw-bold text-success">
                  ₹{" "}
                  {orders.reduce(
                    (total, item) =>
                      total +
                      Number(item.total_price),
                    0
                  )}
                </h4>

                <p className="text-muted">
                  Total Spent
                </p>
              </div>

              <div className="col-md-3">
                <h4 className="fw-bold text-primary">
                  {
                    orders.filter(
                      (item) =>
                        item.status ===
                        "delivered"
                    ).length
                  }
                </h4>

                <p className="text-muted">
                  Delivered Orders
                </p>
              </div>

              <div className="col-md-3">
                <h4 className="fw-bold text-warning">
                  {
                    orders.filter(
                      (item) =>
                        item.status === "pending"
                    ).length
                  }
                </h4>

                <p className="text-muted">
                  Pending Orders
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyOrders;