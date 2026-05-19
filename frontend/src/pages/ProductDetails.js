import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productResponse = await API.get(`products/${id}/`);
        setProduct(productResponse.data);

        const reviewResponse = await API.get(`products/${id}/reviews/`);
        setReviews(reviewResponse.data);

        saveRecentlyViewed(productResponse.data);
        loadRecentlyViewed(productResponse.data.id);
      } catch (error) {
        console.log(error);
        alert("Product not found");
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const getProductImage = (item) => {
    return item?.image_url || item?.image || "https://via.placeholder.com/500x600?text=No+Image";
  };

  const saveRecentlyViewed = (productData) => {
    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
    const filtered = recent.filter((item) => item.id !== productData.id);
    const updated = [productData, ...filtered].slice(0, 5);

    localStorage.setItem("recentProducts", JSON.stringify(updated));
  };

  const loadRecentlyViewed = (currentId) => {
    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
    setRecentProducts(recent.filter((item) => item.id !== currentId).slice(0, 4));
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((total, item) => total + Number(item.rating), 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const finalPrice = product?.discount_price || product?.price;

  const addToCart = () => {
    if (!product) return;

    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    if (quantity > product.stock) {
      alert("Quantity cannot be more than stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (exists) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          price: finalPrice,
          image: getProductImage(product),
          quantity,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart");
  };

  const addWishlist = async () => {
    try {
      await API.post("wishlist/", {
        product: product.id,
      });

      alert("Added to wishlist");
    } catch (error) {
      console.log(error);
      alert("Please login or product already added");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post(`products/${id}/reviews/`, {
        rating: review.rating,
        comment: review.comment,
      });

      alert("Review submitted");

      const response = await API.get(`products/${id}/reviews/`);
      setReviews(response.data);

      setReview({
        rating: 5,
        comment: "",
      });
    } catch (error) {
      console.log(error);
      alert("Login required or already reviewed");
    }
  };

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg p-4 mb-5">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <img
                src={getProductImage(product)}
                alt={product.name}
                className="img-fluid rounded shadow-sm"
                style={{
                  width: "100%",
                  maxHeight: "520px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-md-7">
              <span className="badge bg-dark mb-3">{product.category}</span>

              {product.is_featured && (
                <span className="badge bg-warning text-dark mb-3 ms-2">
                  Featured
                </span>
              )}

              <h1 className="fw-bold">{product.name}</h1>

              <div className="mb-3">
                <span className="text-warning fs-4">⭐ {averageRating}</span>
                <span className="text-muted ms-2">({reviews.length} reviews)</span>
              </div>

              <div className="mb-3">
                <h2 className="text-success fw-bold mb-0">₹ {finalPrice}</h2>

                {product.discount_price && (
                  <p className="text-muted text-decoration-line-through mb-0">
                    ₹ {product.price}
                  </p>
                )}
              </div>

              <p className="text-muted mt-3">{product.description}</p>

              <div className="d-flex gap-2 mb-3 flex-wrap">
                <span className="badge bg-secondary">Size: {product.size}</span>

                {product.color && (
                  <span className="badge bg-dark">Color: {product.color}</span>
                )}

                {product.brand && (
                  <span className="badge bg-info text-dark">Brand: {product.brand}</span>
                )}

                <span
                  className={`badge ${
                    product.stock > 5
                      ? "bg-success"
                      : product.stock > 0
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {product.stock > 5
                    ? `In Stock: ${product.stock}`
                    : product.stock > 0
                    ? `Low Stock: ${product.stock}`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <label className="fw-semibold">Quantity</label>

                <input
                  type="number"
                  className="form-control"
                  style={{ width: "100px" }}
                  value={quantity}
                  min="1"
                  max={product.stock}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={product.stock <= 0}
                />
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-dark px-4"
                  onClick={addToCart}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button className="btn btn-outline-danger px-4" onClick={addWishlist}>
                  Add to Wishlist
                </button>

                <Link to="/cart" className="btn btn-success px-4">
                  Go to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg p-4 mb-5">
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div>
              <h3 className="fw-bold">Reviews & Ratings</h3>
              <p className="text-muted mb-0">Customer feedback for this product</p>
            </div>

            <div className="text-end">
              <h2 className="text-warning mb-0">⭐ {averageRating}</h2>
              <small className="text-muted">{reviews.length} total reviews</small>
            </div>
          </div>

          <form onSubmit={submitReview} className="card bg-light border-0 p-3 mb-4">
            <h5 className="fw-bold">Write a Review</h5>

            <select
              className="form-select mb-3"
              value={review.rating}
              onChange={(e) =>
                setReview({
                  ...review,
                  rating: e.target.value,
                })
              }
            >
              <option value="5">5 Star</option>
              <option value="4">4 Star</option>
              <option value="3">3 Star</option>
              <option value="2">2 Star</option>
              <option value="1">1 Star</option>
            </select>

            <textarea
              className="form-control mb-3"
              rows="4"
              placeholder="Write your review"
              value={review.comment}
              onChange={(e) =>
                setReview({
                  ...review,
                  comment: e.target.value,
                })
              }
              required
            />

            <button className="btn btn-dark">Submit Review</button>
          </form>

          {reviews.length === 0 ? (
            <div className="text-center text-muted p-4">
              No reviews yet. Be the first to review this product.
            </div>
          ) : (
            reviews.map((item) => (
              <div className="card border-0 shadow-sm p-3 mb-3" key={item.id}>
                <div className="d-flex justify-content-between">
                  <strong>{item.username}</strong>
                  <span className="text-warning">⭐ {item.rating}</span>
                </div>

                <p className="mb-1 mt-2">{item.comment}</p>

                {item.created_at && (
                  <small className="text-muted">
                    {new Date(item.created_at).toLocaleString()}
                  </small>
                )}
              </div>
            ))
          )}
        </div>

        {recentProducts.length > 0 && (
          <div className="card border-0 shadow-lg p-4">
            <h3 className="fw-bold mb-4">Recently Viewed</h3>

            <div className="row">
              {recentProducts.map((item) => (
                <div className="col-md-3 mb-3" key={item.id}>
                  <Link
                    to={`/products/${item.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card h-100 border-0 shadow-sm">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="card-img-top"
                        style={{
                          height: "170px",
                          objectFit: "cover",
                        }}
                      />

                      <div className="card-body">
                        <h6 className="fw-bold">{item.name}</h6>
                        <p className="text-success mb-0">
                          ₹ {item.discount_price || item.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;