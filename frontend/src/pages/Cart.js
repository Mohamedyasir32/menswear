import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  const safeParseCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setCart(safeParseCart());
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Number(item.quantity || 1) + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              Number(item.quantity || 1) > 1
                ? Number(item.quantity) - 1
                : 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    updateCart(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    );
  }, [cart]);

  return (
    <div
      className="min-vh-100 py-4 py-md-5"
      style={{ background: "#f5f7fa" }}
    >
      <div className="container">
        {/* Header */}

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Cart</h2>

            <p className="text-muted mb-0">
              Manage your shopping cart
            </p>
          </div>

          {cart.length > 0 && (
            <button
              className="btn btn-outline-danger align-self-start align-self-md-auto"
              onClick={clearCart}
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Empty Cart */}

        {cart.length === 0 ? (
          <div className="card border-0 shadow-lg text-center p-4 p-md-5">
            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
              style={{
                width: "120px",
                height: "120px",
                fontSize: "50px",
              }}
            >
              🛒
            </div>

            <h3 className="fw-bold">Your Cart is Empty</h3>

            <p className="text-muted">
              Add products to continue shopping
            </p>

            <Link
              to="/products"
              className="btn btn-dark mt-3 px-4 py-2"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cart Items */}

            <div className="col-lg-8">
              {/* Desktop View */}

              <div className="table-responsive d-none d-md-block">
                <table className="table align-middle shadow-sm bg-white">
                  <thead className="table-dark">
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              width="90"
                              height="90"
                              className="rounded me-3"
                              style={{
                                objectFit: "cover",
                              }}
                            />

                            <div>
                              <h6 className="fw-bold mb-1">
                                {item.name}
                              </h6>

                              <small className="text-muted">
                                {item.category}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td className="fw-bold text-success">
                          ₹ {item.price}
                        </td>

                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="btn btn-dark btn-sm"
                              onClick={() =>
                                decreaseQty(item.id)
                              }
                            >
                              −
                            </button>

                            <span className="mx-3 fw-bold">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-dark btn-sm"
                              onClick={() =>
                                increaseQty(item.id)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="fw-bold">
                          ₹{" "}
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toFixed(2)}
                        </td>

                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}

              <div className="d-md-none">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="card border-0 shadow-sm mb-3 overflow-hidden"
                  >
                    <div className="row g-0">
                      <div className="col-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid h-100 w-100"
                          style={{
                            objectFit: "cover",
                            minHeight: "150px",
                          }}
                        />
                      </div>

                      <div className="col-8">
                        <div className="card-body">
                          <h6 className="fw-bold">
                            {item.name}
                          </h6>

                          <p className="text-muted small mb-2">
                            {item.category}
                          </p>

                          <h6 className="text-success fw-bold">
                            ₹ {item.price}
                          </h6>

                          <div className="d-flex align-items-center my-3">
                            <button
                              className="btn btn-dark btn-sm"
                              onClick={() =>
                                decreaseQty(item.id)
                              }
                            >
                              −
                            </button>

                            <span className="mx-3 fw-bold">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-dark btn-sm"
                              onClick={() =>
                                increaseQty(item.id)
                              }
                            >
                              +
                            </button>
                          </div>

                          <h6 className="fw-bold mb-3">
                            ₹{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toFixed(2)}
                          </h6>

                          <button
                            className="btn btn-danger btn-sm w-100"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-lg p-4"
                style={{
                  position: "sticky",
                  top: "90px",
                }}
              >
                <h4 className="fw-bold mb-4">
                  Cart Summary
                </h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Total Items</span>

                  <span className="fw-bold">
                    {totalItems}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Total Price</span>

                  <span className="fw-bold text-success">
                    ₹ {totalPrice.toFixed(2)}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between mb-4">
                  <h5>Grand Total</h5>

                  <h5 className="text-success fw-bold">
                    ₹ {totalPrice.toFixed(2)}
                  </h5>
                </div>

                <Link
                  to="/checkout"
                  className="btn btn-success w-100 py-3 mb-3 fw-bold"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="btn btn-outline-dark w-100 py-3 fw-bold"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;