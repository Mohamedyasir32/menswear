import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await API.get("wishlist/");
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Please login first");
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (id) => {
    try {
      await API.delete(`wishlist/delete/${id}/`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      alert("Removed from wishlist");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Remove failed");
    }
  };

  const addToCart = (item) => {
    const productId = item.product || item.product_id || item.id;
    const productName = item.product_name || item.name;
    const productPrice = item.product_price || item.price;
    const productImage = item.product_image || item.image_url || item.image;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((cartItem) => cartItem.id === productId);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === productId
          ? {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            }
          : cartItem
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          category: item.product_category || item.category || "",
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">My Wishlist</h2>
          <p className="text-muted">Save your favorite fashion items</p>
        </div>

        <Link to="/products" className="btn btn-dark">
          Continue Shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="card shadow border-0 p-5 text-center">
          <div className="mb-3">
            <span style={{ fontSize: "70px" }}>❤️</span>
          </div>

          <h3>Your Wishlist is Empty</h3>
          <p className="text-muted">Save your favorite products to wishlist</p>

          <Link to="/products" className="btn btn-dark mt-3">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="row">
            {items.map((item) => (
              <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                  }}
                >
                  <div className="position-relative">
                    {(item.product_image || item.image_url || item.image) && (
                      <img
                        src={item.product_image || item.image_url || item.image}
                        alt={item.product_name || item.name}
                        className="card-img-top"
                        style={{
                          height: "300px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <span className="badge bg-danger position-absolute top-0 end-0 m-3">
                      Wishlist
                    </span>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h4 className="fw-bold">{item.product_name || item.name}</h4>
                    <p className="text-muted">Premium menswear fashion</p>

                    <h3 className="text-success fw-bold mb-4">
                      ₹ {item.product_price || item.price}
                    </h3>

                    <div className="mt-auto">
                      <button
                        className="btn btn-dark w-100 mb-2"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="btn btn-outline-danger w-100"
                        onClick={() => removeWishlist(item.id)}
                      >
                        Remove Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card shadow border-0 mt-4 p-4">
            <div className="row text-center">
              <div className="col-md-4">
                <h4 className="fw-bold">{items.length}</h4>
                <p className="text-muted">Wishlist Items</p>
              </div>

              <div className="col-md-4">
                <h4 className="fw-bold text-success">
                  ₹{" "}
                  {items.reduce(
                    (total, item) => total + Number(item.product_price || item.price || 0),
                    0
                  )}
                </h4>
                <p className="text-muted">Total Wishlist Value</p>
              </div>

              <div className="col-md-4">
                <Link to="/cart" className="btn btn-success mt-2">
                  Go to Cart
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Wishlist;
