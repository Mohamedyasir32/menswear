import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts();

    if (localStorage.getItem("darkMode") === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await API.get("products/");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) =>
    product.image_url ||
    product.image ||
    "https://via.placeholder.com/500x600?text=No+Image";

  const getProductPrice = (product) =>
    Number(product.discount_price || product.price || 0);

  const getCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem("cart"));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const addToCart = (product) => {
    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    const cart = getCart();
    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (exists) {
      const newQuantity = Number(exists.quantity || 1) + 1;

      if (newQuantity > stock) {
        toast.error("Quantity cannot be more than stock");
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
              price: getProductPrice(product),
              image: getProductImage(product),
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          price: getProductPrice(product),
          image: getProductImage(product),
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Added to cart");
  };

  const addToWishlist = async (product) => {
    try {
      await API.post("wishlist/", {
        product: product.id,
      });

      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Added to wishlist");
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("Please login or product already added");
    }
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return products.filter((product) => {
      const productName = product.name || "";
      const productCategory = product.category || "";
      const productBrand = product.brand || "";
      const productSku = product.sku || "";

      const matchesSearch =
        productName.toLowerCase().includes(keyword) ||
        productCategory.toLowerCase().includes(keyword) ||
        productBrand.toLowerCase().includes(keyword) ||
        productSku.toLowerCase().includes(keyword);

      const matchesCategory = !category || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
      <div className="container py-4 py-md-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold display-6 mb-2">Menswear Collection</h1>
            <p className={darkMode ? "text-light mb-0" : "text-muted mb-0"}>
              Discover premium fashion products
            </p>
          </div>

          <button
            className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="row g-3 mb-4 mb-md-5">
          <div className="col-12 col-md-8">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Search products, category, brand or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select form-select-lg shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Tshirt">Tshirt</option>
              <option value="Shirt">Shirt</option>
              <option value="Jeans">Jeans</option>
              <option value="Shoes">Shoes</option>
              <option value="Jacket">Jacket</option>
              <option value="Hoodie">Hoodie</option>
            </select>
          </div>
        </div>

        {currentProducts.length === 0 ? (
          <div className="card border-0 shadow text-center py-5">
            <h3>No products found</h3>
            <p className="text-muted mb-3">Try another search or category</p>
            <button
              className="btn btn-dark mx-auto"
              onClick={() => {
                setSearch("");
                setCategory("");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {currentProducts.map((product) => {
              const stock = Number(product.stock || 0);
              const finalPrice = getProductPrice(product);
              const hasDiscount = Boolean(product.discount_price);
              const discountPercent =
                hasDiscount && Number(product.price) > 0
                  ? Math.round(
                      ((Number(product.price) - Number(product.discount_price)) /
                        Number(product.price)) *
                        100
                    )
                  : 0;

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                  <div
                    className={`card border-0 shadow-lg h-100 product-card ${
                      darkMode ? "bg-secondary text-white" : "bg-white"
                    }`}
                    style={{
                      borderRadius: "24px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="position-relative product-image-wrap">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={getProductImage(product)}
                          alt={product.name || "Product"}
                          className="card-img-top product-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/500x600?text=No+Image";
                          }}
                        />
                      </Link>

                      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2">
                        {product.is_featured && (
                          <span className="badge bg-warning text-dark px-3 py-2">
                            Featured
                          </span>
                        )}

                        {hasDiscount && (
                          <span className="badge bg-danger px-3 py-2">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                        onClick={() => addToWishlist(product)}
                        title="Add to wishlist"
                        style={{
                          width: "42px",
                          height: "42px",
                        }}
                      >
                        ❤
                      </button>
                    </div>

                    <div className="card-body d-flex flex-column p-3 p-md-4">
                      <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
                        <span className="badge bg-dark">
                          {product.category || "Category"}
                        </span>

                        {product.sku && (
                          <small className={darkMode ? "text-light" : "text-muted"}>
                            SKU: {product.sku}
                          </small>
                        )}
                      </div>

                      <h4 className="fw-bold mb-2 product-title">
                        {product.name || "Product"}
                      </h4>

                      <p
                        className={`product-description ${
                          darkMode ? "text-light" : "text-muted"
                        }`}
                      >
                        {(product.description || "").slice(0, 85)}
                        {(product.description || "").length > 85 ? "..." : ""}
                      </p>

                      <div className="d-flex gap-2 flex-wrap mb-3">
                        {product.size && (
                          <span className="badge bg-primary">
                            Size: {product.size}
                          </span>
                        )}

                        {product.color && (
                          <span className="badge bg-secondary">
                            {product.color}
                          </span>
                        )}

                        {product.brand && (
                          <span className="badge bg-info text-dark">
                            {product.brand}
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        {stock > 5 ? (
                          <span className="badge bg-success">In Stock</span>
                        ) : stock > 0 ? (
                          <span className="badge bg-warning text-dark">
                            Low Stock: {stock}
                          </span>
                        ) : (
                          <span className="badge bg-danger">Out of Stock</span>
                        )}
                      </div>

                      <div className="mb-3">
                        <h3 className="text-success fw-bold mb-0">
                          ₹ {finalPrice.toLocaleString("en-IN")}
                        </h3>

                        {hasDiscount && (
                          <div>
                            <span className="text-decoration-line-through text-muted">
                              ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-danger fw-semibold ms-2">
                              Save {discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto d-grid gap-2">
                        <Link
                          to={`/products/${product.id}`}
                          className={`btn ${
                            darkMode ? "btn-light" : "btn-outline-dark"
                          }`}
                        >
                          View Details
                        </Link>

                        <button
                          className="btn btn-dark"
                          onClick={() => addToCart(product)}
                          disabled={stock <= 0}
                        >
                          {stock <= 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination flex-wrap justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      <style>
        {`
          .product-card {
            transition: transform 0.25s ease, box-shadow 0.25s ease;
          }

          .product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.18) !important;
          }

          .product-image-wrap {
            height: 280px;
            overflow: hidden;
            background: #f8f9fa;
          }

          .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.35s ease;
          }

          .product-card:hover .product-image {
            transform: scale(1.06);
          }

          .product-title {
            min-height: 58px;
          }

          .product-description {
            min-height: 48px;
          }

          @media (max-width: 575px) {
            .product-image-wrap {
              height: 330px;
            }

            .product-title,
            .product-description {
              min-height: auto;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Products;