import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    payments: 0,
    low_stock: 0,
    total_sales: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("admin/dashboard-stats/");
      const data = response.data || {};

      setStats({
        products: Number(data.products || 0),
        users: Number(data.users || 0),
        orders: Number(data.orders || 0),
        payments: Number(data.payments || 0),
        low_stock: Number(data.low_stock || 0),
        total_sales: Number(data.total_sales || 0),
      });
    } catch (error) {
      console.log(error.response?.data || error);
      setError("Admin access only or failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const actions = useMemo(
    () => [
      {
        icon: "➕",
        title: "Add Product",
        text: "Create new menswear products",
        link: "/admin/add-product",
        button: "Add Product",
        color: "btn-dark",
      },
      {
        icon: "📦",
        title: "Manage Products",
        text: "Edit, update and delete products",
        link: "/admin/products",
        button: "Manage",
        color: "btn-primary",
      },
      {
        icon: "🛒",
        title: "Orders",
        text: "Track and update customer orders",
        link: "/admin/orders",
        button: "View Orders",
        color: "btn-success",
      },
      {
        icon: "💳",
        title: "Payments",
        text: "View payments and invoices",
        link: "/admin/payments",
        button: "Payments",
        color: "btn-warning",
      },
      {
        icon: "👥",
        title: "Users",
        text: "View registered customers",
        link: "/admin/users",
        button: "View Users",
        color: "btn-info",
      },
      {
       icon: "📊",
       title: "Analytics",
       text: "View sales, revenue and performance reports",
       link: "/admin/analytics",
       button: "View Analytics",
       color: "btn-info",
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: "#f5f7fa" }}>
      <div className="container py-5">
        <div className="card border-0 shadow-lg mb-5 overflow-hidden">
          <div
            className="p-5 text-white"
            style={{
              background: "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="fw-bold mb-2">Admin Dashboard</h1>
                <p className="mb-0 opacity-75">
                  Manage products, users, orders and payments
                </p>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-warning fw-bold" onClick={fetchStats}>
                  Refresh
                </button>

                <button className="btn btn-danger fw-bold" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-danger" onClick={fetchStats}>
              Retry
            </button>
          </div>
        )}

        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg h-100 text-center p-4">
              <div className="fs-1">📦</div>
              <h2 className="fw-bold">{stats.products}</h2>
              <p className="text-muted mb-0">Total Products</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg h-100 text-center p-4">
              <div className="fs-1">👥</div>
              <h2 className="fw-bold">{stats.users}</h2>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg h-100 text-center p-4">
              <div className="fs-1">🛒</div>
              <h2 className="fw-bold">{stats.orders}</h2>
              <p className="text-muted mb-0">Total Orders</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-lg h-100 text-center p-4">
              <div className="fs-1">💳</div>
              <h2 className="fw-bold">{stats.payments}</h2>
              <p className="text-muted mb-0">Payments</p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-lg h-100 p-4">
              <h5 className="fw-bold mb-4">Total Revenue</h5>
              <h1 className="text-success fw-bold">
                ₹ {formatAmount(stats.total_sales)}
              </h1>
              <p className="text-muted mb-0">
                Total sales from completed payments
              </p>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-lg h-100 p-4">
              <h5 className="fw-bold mb-4">Stock Alerts</h5>
              <h1 className="text-danger fw-bold">{stats.low_stock}</h1>
              <p className="text-muted">Products are low in stock</p>

              {stats.low_stock > 0 ? (
                <div className="alert alert-warning mt-3 mb-0">
                  ⚠️ Please restock products soon
                </div>
              ) : (
                <div className="alert alert-success mt-3 mb-0">
                  ✅ Stock levels look good
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">
          {actions.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.title}>
              <div className="card border-0 shadow-lg h-100">
                <div className="card-body text-center p-5">
                  <div className="mb-4" style={{ fontSize: "50px" }}>
                    {item.icon}
                  </div>

                  <h4 className="fw-bold">{item.title}</h4>
                  <p className="text-muted">{item.text}</p>

                  <Link to={item.link} className={`btn ${item.color} w-100`}>
                    {item.button}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5 text-muted">
          <small>MensWear Admin Panel © 2026</small>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;