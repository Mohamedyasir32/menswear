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

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") setDarkMode(true);
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
    product.discount_price || product.price || 0;

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

      const matchesSearch =
        productName.toLowerCase().includes(keyword) ||
        productCategory.toLowerCase().includes(keyword) ||
        productBrand.toLowerCase().includes(keyword);

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
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mb-md-5">
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

        <div className="row mb-4 mb-md-5">
          <div className="col-md-8 mb-3">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Search products, category or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-3">
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

              return (
                <div className="col-12 col-sm-6 col-lg-4" key={product.id}>
                  <div
                    className={`card border-0 shadow-lg h-100 ${
                      darkMode ? "bg-secondary text-white" : ""
                    }`}
                    style={{
                      borderRadius: "22px",
                      overflow: "hidden",
                    }}
                  >
                    <div className="position-relative">
                      <img
                        src={getProductImage(product)}
                        alt={product.name || "Product"}
                        className="card-img-top"
                        style={{
                          height: "260px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/500x600?text=No+Image";
                        }}
                      />

                      {product.is_featured && (
                        <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 px-3 py-2">
                          Featured
                        </span>
                      )}

                      <button
                        className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
                        onClick={() => addToWishlist(product)}
                        title="Add to wishlist"
                      >
                        ❤
                      </button>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="mb-2">
                        <span className="badge bg-dark">
                          {product.category || "Category"}
                        </span>
                      </div>

                      <h4 className="fw-bold">{product.name || "Product"}</h4>

                      <p className={darkMode ? "text-light" : "text-muted"}>
                        {(product.description || "").slice(0, 90)}
                        {(product.description || "").length > 90 ? "..." : ""}
                      </p>

                      <div className="d-flex gap-2 flex-wrap mb-2">
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
                        {product.discount_price ? (
                          <>
                            <h3 className="text-success fw-bold mb-0">
                              ₹ {product.discount_price}
                            </h3>
                            <span className="text-decoration-line-through text-muted">
                              ₹ {product.price}
                            </span>
                          </>
                        ) : (
                          <h3 className="text-success fw-bold">
                            ₹ {product.price}
                          </h3>
                        )}
                      </div>

                      <div className="mt-auto">
                        <Link
                          to={`/products/${product.id}`}
                          className={`btn w-100 mb-2 ${
                            darkMode ? "btn-light" : "btn-outline-dark"
                          }`}
                        >
                          View Details
                        </Link>

                        <button
                          className="btn btn-dark w-100"
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
    </div>
  );
}

export default Products;