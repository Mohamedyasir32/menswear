import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductImage = (item) =>
    item?.image_url ||
    item?.image ||
    "https://via.placeholder.com/600x700?text=No+Image";

  const fetchProduct = useCallback(async () => {
    setLoading(true);

    try {
      const productResponse = await API.get(`products/${id}/`);
      setProduct(productResponse.data);

      try {
        const reviewResponse = await API.get(`products/${id}/reviews/`);
        setReviews(Array.isArray(reviewResponse.data) ? reviewResponse.data : []);
      } catch {
        setReviews([]);
      }
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Product not found");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";

    const total = reviews.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const finalPrice = Number(product?.discount_price || product?.price || 0);
  const stock = Number(product?.stock || 0);

  const getCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const increaseQty = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning("Quantity cannot be more than stock");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const addToCart = () => {
    if (!product) return;

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const cart = getCart();
    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (exists) {
      const newQuantity = Number(exists.quantity || 1) + quantity;

      if (newQuantity > stock) {
        toast.error("Quantity cannot be more than stock");
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              price: finalPrice,
              image: getProductImage(product),
            }
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
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  const addWishlist = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      toast.error("Please login to add wishlist");
      navigate("/login");
      return;
    }

    try {
      await API.post("wishlist/", {
        product: product.id,
      });

      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Added to wishlist");
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Already added or login required");
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-vh-100 py-4 py-md-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg p-3 p-md-4 mb-5">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="overflow-hidden rounded product-main-image">
                <img
                  src={getProductImage(product)}
                  alt={product.name || "Product"}
                  className="img-fluid w-100"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x700?text=No+Image";
                  }}
                />
              </div>
            </div>

            <div className="col-lg-7">
              <div className="product-info">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-dark">
                    {product.category || "Category"}
                  </span>

                  {product.is_featured && (
                    <span className="badge bg-warning text-dark">
                      Featured
                    </span>
                  )}

                  {stock > 5 ? (
                    <span className="badge bg-success">In Stock: {stock}</span>
                  ) : stock > 0 ? (
                    <span className="badge bg-warning text-dark">
                      Low Stock: {stock}
                    </span>
                  ) : (
                    <span className="badge bg-danger">Out of Stock</span>
                  )}
                </div>

                <h1 className="fw-bold mb-3">{product.name}</h1>

                <div className="mb-3">
                  <span className="text-warning fs-4">⭐ {averageRating}</span>
                  <span className="text-muted ms-2">
                    ({reviews.length} reviews)
                  </span>
                </div>

                <div className="mb-3">
                  <h2 className="text-success fw-bold mb-0">
                    ₹ {finalPrice.toLocaleString("en-IN")}
                  </h2>

                  {product.discount_price && (
                    <p className="text-muted text-decoration-line-through mb-0">
                      ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <p className="text-muted">{product.description}</p>

                <div className="d-flex gap-2 flex-wrap mb-4">
                  {product.sku && (
                    <span className="badge bg-light text-dark border">
                      SKU: {product.sku}
                    </span>
                  )}

                  {product.size && (
                    <span className="badge bg-primary">
                      Size: {product.size}
                    </span>
                  )}

                  {product.color && (
                    <span className="badge bg-secondary">
                      Color: {product.color}
                    </span>
                  )}

                  {product.brand && (
                    <span className="badge bg-info text-dark">
                      Brand: {product.brand}
                    </span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-3 mb-4">
                  <label className="fw-semibold">Quantity</label>

                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-dark btn-sm"
                      onClick={decreaseQty}
                      disabled={quantity <= 1}
                    >
                      −
                    </button>

                    <span className="mx-3 fw-bold">{quantity}</span>

                    <button
                      className="btn btn-dark btn-sm"
                      onClick={increaseQty}
                      disabled={quantity >= stock || stock <= 0}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-grid d-md-flex gap-2">
                  <button
                    className="btn btn-dark px-4 py-3"
                    onClick={addToCart}
                    disabled={stock <= 0}
                  >
                    {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <button
                    className="btn btn-outline-danger px-4 py-3"
                    onClick={addWishlist}
                  >
                    Wishlist
                  </button>

                  <Link to="/cart" className="btn btn-success px-4 py-3">
                    Go to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg p-3 p-md-4">
          <h3 className="fw-bold mb-3">Reviews & Ratings</h3>

          {reviews.length === 0 ? (
            <p className="text-muted mb-0">No reviews yet.</p>
          ) : (
            reviews.map((item) => (
              <div className="card border-0 shadow-sm p-3 mb-3" key={item.id}>
                <div className="d-flex justify-content-between">
                  <strong>{item.username || "Customer"}</strong>
                  <span className="text-warning">⭐ {item.rating}</span>
                </div>

                <p className="mt-2 mb-1">{item.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <style>
        {`
          .product-main-image {
            background: #f8f9fa;
          }

          .product-main-image img {
            max-height: 540px;
            object-fit: cover;
            transition: transform 0.35s ease;
          }

          .product-main-image:hover img {
            transform: scale(1.04);
          }

          .product-info {
            position: sticky;
            top: 90px;
          }

          @media (max-width: 991px) {
            .product-info {
              position: static;
            }

            .product-main-image img {
              max-height: 420px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ProductDetails;