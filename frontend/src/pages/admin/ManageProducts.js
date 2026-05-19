import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("products/");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return products;

    return products.filter((product) => {
      const name = product.name || "";
      const category = product.category || "";
      const brand = product.brand || "";
      const sku = product.sku || "";

      return (
        name.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword) ||
        brand.toLowerCase().includes(keyword) ||
        sku.toLowerCase().includes(keyword)
      );
    });
  }, [products, search]);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`products/delete/${id}/`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      alert("Product deleted successfully");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Delete failed. Please try again.");
    }
  };

  const getProductImage = (product) => {
    return (
      product.image_url ||
      product.image ||
      "https://via.placeholder.com/500x500?text=No+Image"
    );
  };

  const getStockBadge = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) return "bg-danger";
    if (value <= 5) return "bg-warning text-dark";
    return "bg-success";
  };

  const getStockText = (stock) => {
    const value = Number(stock || 0);

    if (value <= 0) return "Out of Stock";
    if (value <= 5) return "Low Stock";
    return "In Stock";
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalProducts = products.length;
  const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5).length;
  const outOfStock = products.filter((p) => Number(p.stock || 0) <= 0).length;
  const availableProducts = products.filter((p) => p.is_available !== false).length;

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: "#f5f7fa" }}>
      <div className="container">
        <div className="card border-0 shadow-lg mb-5 overflow-hidden">
          <div
            className="p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="fw-bold">Manage Products</h1>
                <p className="mb-0 opacity-75">
                  Edit, update and manage your products
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-light fw-bold" onClick={fetchProducts}>
                  Refresh
                </button>

                <Link to="/admin/add-product" className="btn btn-warning fw-bold">
                  + Add Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-danger" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-4 text-center">
                <h5 className="text-muted">Total Products</h5>
                <h1 className="fw-bold">{totalProducts}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-4 text-center">
                <h5 className="text-muted">Available</h5>
                <h1 className="fw-bold text-success">{availableProducts}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-4 text-center">
                <h5 className="text-muted">Low Stock</h5>
                <h1 className="fw-bold text-warning">{lowStock}</h1>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow-lg h-100">
              <div className="card-body p-4 text-center">
                <h5 className="text-muted">Out of Stock</h5>
                <h1 className="fw-bold text-danger">{outOfStock}</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg mb-5">
          <div className="card-body p-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by product name, category, brand or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="card border-0 shadow-lg">
            <div className="card-body text-center py-5">
              <h4>No products found</h4>
              <p className="text-muted mb-0">
                Try another search or add a new product.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProducts.map((product) => (
              <div className="col-lg-4 col-md-6" key={product.id}>
                <div className="card border-0 shadow-lg h-100 overflow-hidden">
                  <div style={{ height: "280px", overflow: "hidden" }}>
                    <img
                      src={getProductImage(product)}
                      alt={product.name || "Product"}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500x500?text=No+Image";
                      }}
                    />
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                      <h4 className="fw-bold mb-0">
                        {product.name || "Unnamed Product"}
                      </h4>

                      <span className={`badge ${getStockBadge(product.stock)}`}>
                        {getStockText(product.stock)}
                      </span>
                    </div>

                    <p className="text-muted mb-2">
                      {product.category || "No category"}
                    </p>

                    <div className="mb-3">
                      <h3 className="text-success fw-bold mb-0">
                        ₹ {formatAmount(product.discount_price || product.price)}
                      </h3>

                      {product.discount_price && (
                        <span className="text-muted text-decoration-line-through">
                          ₹ {formatAmount(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      {product.size && (
                        <span className="badge bg-dark">Size: {product.size}</span>
                      )}

                      {product.color && (
                        <span className="badge bg-secondary">{product.color}</span>
                      )}

                      {product.brand && (
                        <span className="badge bg-info text-dark">
                          {product.brand}
                        </span>
                      )}

                      {product.sku && (
                        <span className="badge bg-light text-dark">
                          SKU: {product.sku}
                        </span>
                      )}

                      {product.is_featured && (
                        <span className="badge bg-warning text-dark">Featured</span>
                      )}

                      {product.is_available === false && (
                        <span className="badge bg-danger">Unavailable</span>
                      )}
                    </div>

                    <p className="text-muted mb-4">
                      Stock: {Number(product.stock || 0)}
                    </p>

                    <div className="d-flex gap-2 mt-auto">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="btn btn-warning flex-fill"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-danger flex-fill"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5 text-muted">
          <small>MensWear Admin Panel © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default ManageProducts;