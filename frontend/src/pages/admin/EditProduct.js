import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discount_price: "",
    size: "",
    color: "",
    brand: "",
    sku: "",
    stock: "",
    image_url: "",
    is_featured: false,
    is_available: true,
  });

  const fetchProduct = useCallback(async () => {
    setLoading(true);

    try {
      const response = await API.get(`products/${id}/`);
      const product = response.data;

      setForm({
        name: product.name || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price || "",
        discount_price: product.discount_price || "",
        size: product.size || "",
        color: product.color || "",
        brand: product.brand || "",
        sku: product.sku || "",
        stock: product.stock || "",
        image_url: product.image_url || product.image || "",
        is_featured: Boolean(product.is_featured),
        is_available: product.is_available !== false,
      });

      setPreviewError(false);
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Product not found");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image_url") {
      setPreviewError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = Number(form.price);
    const discountPrice = form.discount_price
      ? Number(form.discount_price)
      : null;
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!form.category) {
      alert("Category is required");
      return;
    }

    if (!form.description.trim()) {
      alert("Description is required");
      return;
    }

    if (!form.size.trim()) {
      alert("Size is required");
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (discountPrice !== null && discountPrice >= price) {
      alert("Discount price must be less than original price");
      return;
    }

    if (stock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    if (!form.image_url.trim()) {
      alert("Image URL is required");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price,
      discount_price: discountPrice,
      size: form.size.trim(),
      color: form.color.trim(),
      brand: form.brand.trim(),
      sku: form.sku.trim(),
      stock,
      image_url: form.image_url.trim(),
      is_featured: form.is_featured,
      is_available: form.is_available,
    };

    try {
      await API.patch(`products/update/${id}/`, payload);

      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Update failed. Please check product details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product...</p>
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
            <h1 className="fw-bold">Edit Product</h1>
            <p className="mb-0 opacity-75">
              Update product details, stock, price and image URL
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    className="form-control form-control-lg mb-3"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  <select
                    name="category"
                    className="form-select form-select-lg mb-3"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Tshirt">Tshirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Hoodie">Hoodie</option>
                  </select>

                  <textarea
                    name="description"
                    placeholder="Description"
                    className="form-control mb-3"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="form-control form-control-lg mb-3"
                        value={form.price}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="number"
                        name="discount_price"
                        placeholder="Discount Price"
                        className="form-control form-control-lg mb-3"
                        value={form.discount_price}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        className="form-control form-control-lg mb-3"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="text"
                        name="sku"
                        placeholder="SKU"
                        className="form-control form-control-lg mb-3"
                        value={form.sku}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <input
                        type="text"
                        name="size"
                        placeholder="Size"
                        className="form-control form-control-lg mb-3"
                        value={form.size}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        name="color"
                        placeholder="Color"
                        className="form-control form-control-lg mb-3"
                        value={form.color}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        name="brand"
                        placeholder="Brand"
                        className="form-control form-control-lg mb-3"
                        value={form.brand}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <input
                    type="url"
                    name="image_url"
                    placeholder="Product Image URL"
                    className="form-control form-control-lg mb-3"
                    value={form.image_url}
                    onChange={handleChange}
                    required
                  />

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Featured Product
                    </label>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="is_available"
                      checked={form.is_available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">Available</label>
                  </div>

                  <div className="d-flex gap-3 flex-wrap">
                    <button
                      className="btn btn-dark px-5 py-2"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Update Product"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary px-5 py-2"
                      onClick={() => navigate("/admin/products")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Live Preview</h4>

                {form.image_url && !previewError ? (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="img-fluid rounded shadow-sm mb-4"
                    style={{
                      width: "100%",
                      height: "320px",
                      objectFit: "cover",
                    }}
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center mb-4 text-muted"
                    style={{ height: "320px" }}
                  >
                    No Image Preview
                  </div>
                )}

                <h4 className="fw-bold">{form.name || "Product Name"}</h4>
                <p className="text-muted">{form.category || "Category"}</p>

                <h3 className="text-success fw-bold">
                  ₹ {form.discount_price || form.price || 0}
                </h3>

                {form.discount_price && (
                  <p className="text-muted text-decoration-line-through">
                    ₹ {form.price}
                  </p>
                )}

                <div className="d-flex gap-2 flex-wrap mb-3">
                  {form.size && (
                    <span className="badge bg-dark">Size: {form.size}</span>
                  )}

                  {form.color && (
                    <span className="badge bg-secondary">{form.color}</span>
                  )}

                  {form.brand && (
                    <span className="badge bg-info text-dark">
                      {form.brand}
                    </span>
                  )}

                  {form.is_featured && (
                    <span className="badge bg-warning text-dark">
                      Featured
                    </span>
                  )}

                  {!form.is_available && (
                    <span className="badge bg-danger">Unavailable</span>
                  )}
                </div>

                <span
                  className={`badge ${
                    Number(form.stock) > 5
                      ? "bg-success"
                      : Number(form.stock) > 0
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  Stock: {form.stock || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-muted">
          <small>MensWear Admin Panel © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;