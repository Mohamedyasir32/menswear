import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    payment_method: "Cash on Delivery",
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(Array.isArray(savedCart) ? savedCart : []);
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const discountAmount = (totalPrice * Number(discount || 0)) / 100;
  const finalTotal = Math.max(totalPrice - discountAmount, 0);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getErrorMessage = (error) => {
    const data = error.response?.data;

    if (!data) return "Checkout failed. Please login or check backend.";

    if (typeof data === "string") return data;

    if (Array.isArray(data)) return data[0];

    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const value = data[firstKey];
      return Array.isArray(value) ? `${firstKey}: ${value[0]}` : `${firstKey}: ${value}`;
    }

    return "Checkout failed. Please try again.";
  };

  const validateCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return false;
    }

    if (!form.phone.trim()) {
      alert("Please enter phone number");
      return false;
    }

    if (form.phone.trim().length < 8) {
      alert("Please enter a valid phone number");
      return false;
    }

    if (!form.address.trim()) {
      alert("Please enter delivery address");
      return false;
    }

    return true;
  };

  const createOrderAndPayment = async (paymentMethod) => {
    for (const item of cart) {
      const orderResponse = await API.post("orders/create/", {
        product: item.id,
        quantity: Number(item.quantity || 1),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      await API.post("payments/create/", {
        order: orderResponse.data.id,
        payment_method: paymentMethod,
      });
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      alert("Enter coupon code");
      return;
    }

    try {
      const response = await API.post("coupon/apply/", {
        code: coupon.trim().toUpperCase(),
      });

      setDiscount(Number(response.data.discount_percent || 0));
      alert("Coupon applied successfully");
    } catch (error) {
      console.log(error.response?.data || error);
      setDiscount(0);
      alert("Invalid coupon");
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validateCheckout() || loading) return;

    setLoading(true);

    try {
      await createOrderAndPayment(form.payment_method);

      localStorage.removeItem("cart");
      alert("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error.response?.data || error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const payWithRazorpay = () => {
    if (!validateCheckout() || loading) return;

    if (typeof window.Razorpay === "undefined") {
      alert("Razorpay SDK failed to load. Add Razorpay script in public/index.html");
      return;
    }

    const options = {
      key: "rzp_test_SqxRw3oIeLlky5",
      amount: Math.round(finalTotal * 100),
      currency: "INR",
      name: "MensWear",
      description: "Menswear Fashion Payment",
      image: "https://cdn-icons-png.flaticon.com/512/892/892458.png",

      handler: async function (response) {
        setLoading(true);

        try {
          await createOrderAndPayment("Razorpay");

          localStorage.removeItem("cart");

          alert("Payment Successful\nPayment ID: " + response.razorpay_payment_id);
          navigate("/orders");
        } catch (error) {
          console.log(error.response?.data || error);
          alert("Payment success, but order save failed. Please contact support.");
        } finally {
          setLoading(false);
        }
      },

      prefill: {
        name: localStorage.getItem("username") || "",
        contact: form.phone,
      },

      notes: {
        address: form.address,
      },

      theme: {
        color: "#000000",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.log(response.error);
      alert("Payment Failed\n\nReason: " + response.error.description);
    });

    razorpay.open();
  };

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card shadow border-0 p-3 p-md-5">
          <h2 className="mb-4 text-center fw-bold">Checkout</h2>

          {cart.length === 0 ? (
            <div className="text-center py-5">
              <h5>Your cart is empty</h5>
              <button
                className="btn btn-dark mt-3"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-7">
                <form onSubmit={placeOrder}>
                  <input
                    type="text"
                    name="phone"
                    className="form-control form-control-lg mb-3"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    name="address"
                    className="form-control mb-3"
                    placeholder="Delivery Address"
                    rows="4"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />

                  <select
                    name="payment_method"
                    className="form-select form-select-lg mb-3"
                    value={form.payment_method}
                    onChange={handleChange}
                  >
                    <option value="Cash on Delivery">Cash on Delivery</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Razorpay">Razorpay</option>
                  </select>

                  <div className="card p-3 mb-3 bg-light border-0">
                    <h5 className="fw-bold">Apply Coupon</h5>

                    <div className="d-flex flex-column flex-md-row gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Coupon Code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={applyCoupon}
                      >
                        Apply
                      </button>
                    </div>

                    <div className="mt-3">
                      <p className="mb-1">Discount: {discount}%</p>
                      <h5>Final Total: ₹ {finalTotal.toFixed(2)}</h5>
                    </div>
                  </div>

                  {form.payment_method === "Razorpay" ? (
                    <button
                      type="button"
                      className="btn btn-primary w-100 py-3"
                      onClick={payWithRazorpay}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay with Razorpay"}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success w-100 py-3"
                      disabled={loading}
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </button>
                  )}
                </form>
              </div>

              <div className="col-lg-5">
                <div className="card p-3 p-md-4 shadow-sm border-0">
                  <h4 className="mb-3 fw-bold">Order Summary</h4>

                  {cart.map((item) => (
                    <div key={item.id} className="border-bottom py-2">
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <p className="mb-0 fw-semibold">{item.name}</p>
                          <small className="text-muted">Qty: {item.quantity}</small>
                        </div>

                        <p className="mb-0 fw-bold">
                          ₹{" "}
                          {(
                            Number(item.price || 0) * Number(item.quantity || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between mt-3">
                    <p>Total</p>
                    <p>₹ {totalPrice.toFixed(2)}</p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <p>Discount</p>
                    <p>₹ {discountAmount.toFixed(2)}</p>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h5>Final Total</h5>
                    <h5 className="text-success">₹ {finalTotal.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;