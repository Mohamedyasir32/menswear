import { useEffect, useState } from "react";
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
    setCart(savedCart);
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const discountAmount = (totalPrice * Number(discount)) / 100;
  const finalTotal = totalPrice - discountAmount;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return false;
    }

    if (!form.phone.trim() || !form.address.trim()) {
      alert("Please fill delivery details");
      return false;
    }

    return true;
  };

  const createOrderAndPayment = async (paymentMethod) => {
    for (const item of cart) {
      const orderResponse = await API.post("orders/create/", {
        product: item.id,
        quantity: item.quantity,
        phone: form.phone,
        address: form.address,
        coupon_code: coupon || null,
        discount_percent: discount,
        final_total: finalTotal,
      });

      await API.post("payments/create/", {
        order: orderResponse.data.id,
        payment_method: paymentMethod,
        amount: Number(item.price) * Number(item.quantity),
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
        code: coupon.trim(),
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

    if (!validateCheckout()) return;

    setLoading(true);

    try {
      await createOrderAndPayment(form.payment_method);

      localStorage.removeItem("cart");
      alert("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Checkout failed. Please login or check stock.");
    } finally {
      setLoading(false);
    }
  };

  const payWithRazorpay = () => {
    if (!validateCheckout()) return;

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

          alert(
            "Payment Successful\nPayment ID: " + response.razorpay_payment_id
          );

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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow border-0 p-4">
            <h2 className="mb-4 text-center">Checkout</h2>

            {cart.length === 0 ? (
              <div className="text-center">
                <h5>Your cart is empty</h5>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-7">
                  <form onSubmit={placeOrder}>
                    <input
                      type="text"
                      name="phone"
                      className="form-control mb-3"
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
                      className="form-select mb-3"
                      value={form.payment_method}
                      onChange={handleChange}
                    >
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Razorpay">Razorpay</option>
                    </select>

                    <div className="card p-3 mb-3 bg-light">
                      <h5>Apply Coupon</h5>

                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter Coupon Code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={applyCoupon}
                      >
                        Apply Coupon
                      </button>

                      <div className="mt-3">
                        <p className="mb-1">Discount: {discount}%</p>
                        <h5>Final Total: ₹ {finalTotal.toFixed(2)}</h5>
                      </div>
                    </div>

                    {form.payment_method === "Razorpay" ? (
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={payWithRazorpay}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Pay with Razorpay"}
                      </button>
                    ) : (
                      <button className="btn btn-success" disabled={loading}>
                        {loading ? "Placing Order..." : "Place Order"}
                      </button>
                    )}
                  </form>
                </div>

                <div className="col-md-5 mt-4 mt-md-0">
                  <div className="card p-4 shadow-sm">
                    <h4 className="mb-3">Order Summary</h4>

                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between mb-2"
                      >
                        <p className="mb-0">
                          {item.name} x {item.quantity}
                        </p>
                        <p className="mb-0">
                          ₹ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </p>
                      </div>
                    ))}

                    <hr />

                    <div className="d-flex justify-content-between">
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
                      <h5>₹ {finalTotal.toFixed(2)}</h5>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
