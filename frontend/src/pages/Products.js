import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const response = await API.get("products/");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    return (
      product.image_url ||
      product.image ||
      "https://via.placeholder.com/500x600?text=No+Image"
    );
  };

  const getProductPrice = (product) => {
    return product.discount_price || product.price;
  };

  const addToCart = (product) => {
    if (Number(product.stock) <= 0) {
      alert("This product is out of stock");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = cart.find((item) => item.id === product.id);

    let updatedCart;

    if (exists) {
      if (exists.quantity + 1 > Number(product.stock)) {
        alert("Quantity cannot be more than stock");
        return;
      }

      updatedCart = cart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
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
    alert("Added to cart");
  };

  const addToWishlist = async (product) => {
    try {
      await API.post("wishlist/", {
        product: product.id,
      });

      alert("Added to wishlist");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Please login or product already added");
    }
  };

  const filteredProducts = products.filter((product) => {
    const productName = product.name || "";

    return (
      productName.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || product.category === category)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-5">
          <div>
            <h1 className="fw-bold display-5">Menswear Collection</h1>
            <p className={darkMode ? "text-light" : "text-muted"}>
              Discover premium fashion products
            </p>
          </div>

          <button
            className={`btn ${darkMode ? "btn-light" : "btn-dark"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="row mb-5">
          <div className="col-md-8 mb-3">
            <input
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Search products..."
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

        <div className="row">
          {currentProducts.map((product) => (
            <div className="col-lg-4 col-md-6 mb-4" key={product.id}>
              <div
                className={`card border-0 shadow-lg h-100 ${
                  darkMode ? "bg-secondary text-white" : ""
                }`}
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  transition: "0.3s ease",
                }}
              >
                <div className="position-relative">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="card-img-top"
                    style={{
                      height: "320px",
                      objectFit: "cover",
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
                    <span className="badge bg-dark">{product.category}</span>
                  </div>

                  <h4 className="fw-bold">{product.name}</h4>

                  <p className={darkMode ? "text-light" : "text-muted"}>
                    {product.description?.slice(0, 90)}...
                  </p>

                  <div className="mb-2 text-warning">⭐⭐⭐⭐⭐</div>

                  <div className="d-flex gap-2 flex-wrap mb-2">
                    <span className="badge bg-primary">Size: {product.size}</span>

                    {product.color && (
                      <span className="badge bg-secondary">{product.color}</span>
                    )}
                  </div>

                  <div className="mb-3">
                    {Number(product.stock) > 5 ? (
                      <span className="badge bg-success">In Stock</span>
                    ) : Number(product.stock) > 0 ? (
                      <span className="badge bg-warning text-dark">
                        Low Stock: {product.stock}
                      </span>
                    ) : (
                      <span className="badge bg-danger">Out of Stock</span>
                    )}
                  </div>

                  <div className="mb-3">
                    {product.discount_price ? (
                      <>
                        <h3 className="text-success fw-bold">₹ {product.discount_price}</h3>
                        <span className="text-decoration-line-through text-muted">
                          ₹ {product.price}
                        </span>
                      </>
                    ) : (
                      <h3 className="text-success fw-bold">₹ {product.price}</h3>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Link
                      to={`/products/${product.id}`}
                      className="btn btn-outline-dark w-100 mb-2"
                    >
                      View Details
                    </Link>

                    <button
                      className="btn btn-dark w-100"
                      onClick={() => addToCart(product)}
                      disabled={Number(product.stock) <= 0}
                    >
                      {Number(product.stock) <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentProducts.length === 0 && (
          <div className="text-center py-5">
            <h3>No products found</h3>
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination pagination-lg">
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
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
