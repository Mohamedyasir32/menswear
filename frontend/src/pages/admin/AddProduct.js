import { useState } from "react";
import API from "../../api/axios";

const initialForm = {
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
};

function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imageError, setImageError] = useState(false);

  const categories = ["Tshirt", "Shirt", "Jeans", "Shoes", "Jacket", "Hoodie"];
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "image_url") {
      setImageError(false);
    }
  };

  const validateForm = () => {
    const price = Number(form.price);
    const discountPrice = form.discount_price
      ? Number(form.discount_price)
      : null;
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      alert("Please enter product name");
      return false;
    }

    if (!form.category) {
      alert("Please select category");
      return false;
    }

    if (!form.description.trim()) {
      alert("Please enter description");
      return false;
    }

    if (!price || price <= 0) {
      alert("Price must be greater than 0");
      return false;
    }

    if (discountPrice !== null && discountPrice <= 0) {
      alert("Discount price must be greater than 0");
      return false;
    }

    if (discountPrice !== null && discountPrice >= price) {
      alert("Discount price must be less than original price");
      return false;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Stock must be 0 or greater");
      return false;
    }

    if (!form.size) {
      alert("Please select size");
      return false;
    }

    if (!form.image_url.trim()) {
      alert("Please enter product image URL");
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    name: form.name.trim(),
    category: form.category,
    description: form.description.trim(),
    price: Number(form.price),
    discount_price: form.discount_price ? Number(form.discount_price) : null,
    size: form.size,
    color: form.color.trim() || null,
    brand: form.brand.trim() || null,
    sku: form.sku.trim() || null,
    stock: Number(form.stock),
    image_url: form.image_url.trim(),
    is_featured: form.is_featured,
    is_available: form.is_available,
  });

  const getErrorMessage = (error) => {
    const errorData = error.response?.data;

    if (!errorData) {
      return "Failed to add product. Please check your login and backend API.";
    }

    if (typeof errorData === "string") {
      return errorData;
    }

    if (Array.isArray(errorData)) {
      return errorData[0];
    }

    if (typeof errorData === "object") {
      const firstKey = Object.keys(errorData)[0];
      const firstValue = errorData[firstKey];

      if (Array.isArray(firstValue)) {
        return `${firstKey}: ${firstValue[0]}`;
      }

      return `${firstKey}: ${firstValue}`;
    }

    return "Failed to add product. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await API.post("products/create/", buildPayload());

      alert("Product added successfully");

      setForm(initialForm);
      setImageError(false);
    } catch (error) {
      console.log(error.response?.data || error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const displayPrice = form.discount_price || form.price || 0;
  const stockNumber = Number(form.stock || 0);

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
            <h1 className="fw-bold">Add Product</h1>
            <p className="mb-0 opacity-75">
              Create products using an image URL
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <form onSubmit={handleSubmit}>
                  <label className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    className="form-control form-control-lg mb-3"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  <label className="form-label fw-semibold">Category</label>
                  <select
                    name="category"
                    className="form-select form-select-lg mb-3"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <label className="form-label fw-semibold">Description</label>
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
                      <label className="form-label fw-semibold">Price</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="form-control form-control-lg mb-3"
                        value={form.price}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Discount Price
                      </label>
                      <input
                        type="number"
                        name="discount_price"
                        placeholder="Discount Price"
                        className="form-control form-control-lg mb-3"
                        value={form.discount_price}
                        onChange={handleChange}
                        min="1"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        className="form-control form-control-lg mb-3"
                        value={form.stock}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">SKU</label>
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
                      <label className="form-label fw-semibold">Size</label>
                      <select
                        name="size"
                        className="form-select form-select-lg mb-3"
                        value={form.size}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Size</option>
                        {sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Color</label>
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
                      <label className="form-label fw-semibold">Brand</label>
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

                  <label className="form-label fw-semibold">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    placeholder="Paste product image URL"
                    className="form-control form-control-lg mb-3"
                    value={form.image_url}
                    onChange={handleChange}
                    required
                  />

                  <div className="form-check mb-2">
                    <input
                      id="is_featured"
                      className="form-check-input"
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_featured">
                      Featured Product
                    </label>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      id="is_available"
                      className="form-check-input"
                      type="checkbox"
                      name="is_available"
                      checked={form.is_available}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="is_available">
                      Available
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              className="card border-0 shadow-lg sticky-top"
              style={{ top: "20px" }}
            >
              <div className="card-body p-4">
                <h4 className="fw-bold mb-4">Live Preview</h4>

                {form.image_url && !imageError ? (
                  <img
                    src={form.image_url}
                    alt={form.name || "Product preview"}
                    className="img-fluid rounded shadow-sm mb-4"
                    style={{
                      width: "100%",
                      height: "320px",
                      objectFit: "cover",
                    }}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center mb-4 text-muted text-center p-3"
                    style={{ height: "320px" }}
                  >
                    {imageError ? "Image URL is not loading" : "No Image URL"}
                  </div>
                )}

                <h4 className="fw-bold">{form.name || "Product Name"}</h4>
                <p className="text-muted">{form.category || "Category"}</p>

                <h3 className="text-success fw-bold">₹ {displayPrice}</h3>

                {form.discount_price && form.price && (
                  <p className="text-muted text-decoration-line-through">
                    ₹ {form.price}
                  </p>
                )}

                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {form.size && (
                    <span className="badge bg-dark">Size: {form.size}</span>
                  )}

                  {form.color && (
                    <span className="badge bg-secondary">{form.color}</span>
                  )}

                  {form.brand && (
                    <span className="badge bg-info text-dark">{form.brand}</span>
                  )}

                  {form.is_featured && (
                    <span className="badge bg-warning text-dark">Featured</span>
                  )}

                  {!form.is_available && (
                    <span className="badge bg-danger">Unavailable</span>
                  )}
                </div>

                <span
                  className={`badge ${
                    stockNumber > 5
                      ? "bg-success"
                      : stockNumber > 0
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}
                >
                  {stockNumber > 5
                    ? `In Stock: ${stockNumber}`
                    : stockNumber > 0
                    ? `Low Stock: ${stockNumber}`
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;