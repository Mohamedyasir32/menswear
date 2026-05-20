import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    payment_method: "Cash on Delivery",
  });

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.quantity || 1), 0);
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

      return Array.isArray(value)
        ? `${firstKey}: ${value[0]}`
        : `${firstKey}: ${value}`;
    }

    return "Checkout failed. Please try again.";
  };

  const validateCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter phone number");
      return false;
    }

    if (form.phone.trim().length < 8) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    if (!form.address.trim()) {
      toast.error("Please enter delivery address");
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
    const couponCode = coupon.trim().toUpperCase();

    if (!couponCode) {
      toast.error("Enter coupon code");
      return;
    }

    setCouponLoading(true);

    try {
      const response = await API.post("coupon/apply/", {
        code: couponCode,
      });

      setCoupon(couponCode);
      setDiscount(Number(response.data.discount_percent || 0));
      setCouponApplied(true);

      toast.success("Coupon applied successfully");
    } catch (error) {
      console.log(error.response?.data || error);
      setDiscount(0);
      setCouponApplied(false);
      toast.error("Invalid or inactive coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponApplied(false);
    toast.info("Coupon removed");
  };

  const clearCartAfterOrder = () => {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!validateCheckout() || loading) return;

    setLoading(true);

    try {
      await createOrderAndPayment(form.payment_method);

      clearCartAfterOrder();
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const payWithRazorpay = () => {
    if (!validateCheckout() || loading) return;

    if (typeof window.Razorpay === "undefined") {
      toast.error("Razorpay SDK failed to load");
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

          clearCartAfterOrder();
          toast.success(`Payment successful: ${response.razorpay_payment_id}`);
          navigate("/orders");
        } catch (error) {
          console.log(error.response?.data || error);
          toast.error("Payment success, but order save failed. Contact support.");
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
      toast.error(response.error?.description || "Payment failed");
    });

    razorpay.open();
  };

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card shadow border-0 p-3 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Checkout</h2>
            <p className="text-muted mb-0">Complete your order securely</p>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "60px" }}>🛒</div>
              <h5 className="fw-bold mt-3">Your cart is empty</h5>

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
                  <div className="card border-0 shadow-sm p-3 p-md-4 mb-3">
                    <h5 className="fw-bold mb-3">Delivery Details</h5>

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
                      className="form-select form-select-lg"
                      value={form.payment_method}
                      onChange={handleChange}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Razorpay">Razorpay</option>
                    </select>
                  </div>

                  <div className="card p-3 p-md-4 mb-3 bg-light border-0">
                    <h5 className="fw-bold">Apply Coupon</h5>

                    <div className="d-flex flex-column flex-md-row gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Coupon Code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={couponApplied || couponLoading}
                      />

                      {!couponApplied ? (
                        <button
                          type="button"
                          className="btn btn-warning fw-bold"
                          onClick={applyCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? "Checking..." : "Apply"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline-danger fw-bold"
                          onClick={removeCoupon}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {couponApplied && (
                      <small className="text-success mt-2 d-block">
                        Coupon {coupon} applied: {discount}% discount
                      </small>
                    )}
                  </div>

                  {form.payment_method === "Razorpay" ? (
                    <button
                      type="button"
                      className="btn btn-primary w-100 py-3 fw-bold"
                      onClick={payWithRazorpay}
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : `Pay ₹ ${finalTotal.toFixed(2)} with Razorpay`}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold"
                      disabled={loading}
                    >
                      {loading
                        ? "Placing Order..."
                        : `Place Order ₹ ${finalTotal.toFixed(2)}`}
                    </button>
                  )}
                </form>
              </div>

              <div className="col-lg-5">
                <div
                  className="card p-3 p-md-4 shadow-sm border-0"
                  style={{ position: "sticky", top: "90px" }}
                >
                  <h4 className="mb-3 fw-bold">Order Summary</h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Total Items</span>
                    <span className="fw-bold">{totalItems}</span>
                  </div>

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
                    <p className="text-success">
                      - ₹ {discountAmount.toFixed(2)}
                    </p>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">
                    <h5>Final Total</h5>
                    <h5 className="text-success">₹ {finalTotal.toFixed(2)}</h5>
                  </div>

                  <div className="alert alert-info mt-3 mb-0">
                    Coupon discount is shown in frontend. Backend order total
                    still depends on your order serializer logic.
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