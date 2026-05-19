import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    updateCart(updatedCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const totalPrice = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  return (
    <div className="container mt-5 mb-5">
      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">
            My Cart
          </h2>

          <p className="text-muted">
            Manage your shopping cart
          </p>
        </div>

        {cart.length > 0 && (
          <button
            className="btn btn-outline-danger"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Empty Cart */}

      {cart.length === 0 ? (
        <div className="card shadow border-0 p-5 text-center">
          <h3>Your Cart is Empty</h3>

          <p className="text-muted">
            Add products to continue shopping
          </p>

          <Link
            to="/products"
            className="btn btn-dark mt-3"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="row">
          {/* Cart Items */}

          <div className="col-lg-8">
            {/* Desktop Table */}

            <div className="table-responsive d-none d-md-block">
              <table className="table table-hover align-middle shadow-sm">
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
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              width="80"
                              height="80"
                              className="rounded me-3"
                              style={{
                                objectFit: "cover",
                              }}
                            />
                          )}

                          <div>
                            <h6 className="mb-1 fw-bold">
                              {item.name}
                            </h6>

                            <small className="text-muted">
                              {item.category}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="fw-bold">
                        ₹ {item.price}
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() =>
                              decreaseQty(item.id)
                            }
                          >
                            -
                          </button>

                          <span className="mx-3 fw-bold">
                            {item.quantity}
                          </span>

                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() =>
                              increaseQty(item.id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="fw-bold text-success">
                        ₹{" "}
                        {Number(item.price) *
                          item.quantity}
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

            {/* Mobile Cards */}

            <div className="d-md-none">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card shadow border-0 mb-3"
                >
                  <div className="card-body">
                    <div className="text-center mb-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{
                            height: "180px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </div>

                    <h5 className="fw-bold">
                      {item.name}
                    </h5>

                    <p className="text-muted">
                      {item.category}
                    </p>

                    <h5 className="text-success">
                      ₹ {item.price}
                    </h5>

                    <div className="d-flex align-items-center justify-content-center my-3">
                      <button
                        className="btn btn-dark"
                        onClick={() =>
                          decreaseQty(item.id)
                        }
                      >
                        -
                      </button>

                      <span className="mx-3 fw-bold">
                        {item.quantity}
                      </span>

                      <button
                        className="btn btn-dark"
                        onClick={() =>
                          increaseQty(item.id)
                        }
                      >
                        +
                      </button>
                    </div>

                    <h6 className="text-center mb-3">
                      Subtotal: ₹{" "}
                      {Number(item.price) *
                        item.quantity}
                    </h6>

                    <button
                      className="btn btn-danger w-100"
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}

          <div className="col-lg-4">
            <div className="card shadow border-0 p-4">
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
                  ₹ {totalPrice}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h5>Grand Total</h5>

                <h5 className="text-success">
                  ₹ {totalPrice}
                </h5>
              </div>

              <Link
                to="/checkout"
                className="btn btn-success w-100 mb-2"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="btn btn-outline-dark w-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;