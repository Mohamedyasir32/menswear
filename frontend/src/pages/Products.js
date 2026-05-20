import { useEffect, useMemo, useState } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();

    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");

    if (localStorage.getItem("darkMode") === "true") {
      setDarkMode(true);
    }
  }, [location.search]);

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

  const viewProduct = (id) => {
    if (!id) {
      toast.error("Invalid product");
      return;
    }

    navigate(`/products/${id}`);
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

        <div className="row g-3 mb-4">
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
                navigate("/products");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row g-3 g-md-4">
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
                <div className="col-6 col-md-4 col-xl-3" key={product.id}>
                  <div
                    className={`card border-0 shadow-sm h-100 product-card ${
                      darkMode ? "bg-secondary text-white" : "bg-white"
                    }`}
                  >
                    <div className="position-relative product-image-wrap">
                      <button
                        type="button"
                        className="image-link-btn"
                        onClick={() => viewProduct(product.id)}
                      >
                        <img
                          src={getProductImage(product)}
                          alt={product.name || "Product"}
                          className="card-img-top product-image"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/500x600?text=No+Image";
                          }}
                        />
                      </button>

                      <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                        {product.is_featured && (
                          <span className="badge bg-warning text-dark small-badge">
                            Featured
                          </span>
                        )}

                        {hasDiscount && (
                          <span className="badge bg-danger small-badge">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle shadow-sm wishlist-btn"
                        onClick={() => addToWishlist(product)}
                      >
                        ❤
                      </button>
                    </div>

                    <div className="card-body d-flex flex-column p-2 p-md-3">
                      <div className="d-flex justify-content-between align-items-center mb-1 gap-1">
                        <span className="badge bg-dark small-badge">
                          {product.category || "Category"}
                        </span>

                        {product.sku && (
                          <small
                            className={`sku-text ${
                              darkMode ? "text-light" : "text-muted"
                            }`}
                          >
                            {product.sku}
                          </small>
                        )}
                      </div>

                      <h6 className="fw-bold mb-1 product-title">
                        {product.name || "Product"}
                      </h6>

                      <p
                        className={`product-description mb-2 ${
                          darkMode ? "text-light" : "text-muted"
                        }`}
                      >
                        {(product.description || "").slice(0, 38)}
                        {(product.description || "").length > 38 ? "..." : ""}
                      </p>

                      <div className="mb-2">
                        {stock > 5 ? (
                          <span className="badge bg-success small-badge">In Stock</span>
                        ) : stock > 0 ? (
                          <span className="badge bg-warning text-dark small-badge">
                            Low: {stock}
                          </span>
                        ) : (
                          <span className="badge bg-danger small-badge">Out</span>
                        )}
                      </div>

                      <div className="mb-2">
                        <h6 className="text-success fw-bold mb-0 price-text">
                          ₹ {finalPrice.toLocaleString("en-IN")}
                        </h6>

                        {hasDiscount && (
                          <div>
                            <small className="text-decoration-line-through text-muted old-price">
                              ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                            </small>
                            <small className="text-danger fw-semibold ms-1 old-price">
                              Save {discountPercent}%
                            </small>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto d-grid gap-1">
                        <button
                          type="button"
                          className={`btn action-btn ${
                            darkMode ? "btn-light" : "btn-outline-dark"
                          }`}
                          onClick={() => viewProduct(product.id)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="btn btn-dark action-btn"
                          onClick={() => addToCart(product)}
                          disabled={stock <= 0}
                        >
                          {stock <= 0 ? "Out of Stock" : "Add Cart"}
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
                      type="button"
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
          .image-link-btn {
            border: 0;
            padding: 0;
            width: 100%;
            background: transparent;
            display: block;
          }

          .product-card {
            border-radius: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .product-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.12) !important;
          }

          .product-image-wrap {
            height: 180px;
            overflow: hidden;
            background: #f8f9fa;
            position: relative;
          }

          .product-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.35s ease;
          }

          .product-card:hover .product-image {
            transform: scale(1.05);
          }

          .product-title {
            font-size: 14px;
            line-height: 1.3;
            min-height: 36px;
          }

          .product-description {
            font-size: 11px;
            line-height: 1.3;
            min-height: 28px;
          }

          .small-badge {
            font-size: 9px;
            padding: 4px 6px;
            border-radius: 8px;
          }

          .sku-text {
            font-size: 9px;
            max-width: 60px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .wishlist-btn {
            width: 30px;
            height: 30px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }

          .price-text {
            font-size: 17px;
          }

          .old-price {
            font-size: 11px;
          }

          .action-btn {
            font-size: 12px;
            padding: 7px 10px;
            border-radius: 10px;
            font-weight: 600;
          }

          @media (max-width: 575px) {
            .product-image-wrap {
              height: 145px;
            }

            .product-title {
              font-size: 13px;
              min-height: 34px;
            }

            .product-description {
              font-size: 10px;
              min-height: 24px;
            }

            .card-body {
              padding: 10px !important;
            }

            .action-btn {
              font-size: 11px;
              padding: 6px 8px;
            }

            .price-text {
              font-size: 15px;
            }

            .sku-text {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Products;