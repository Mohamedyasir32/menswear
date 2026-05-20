import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username") || "User";
  const isStaff = localStorage.getItem("is_staff") === "true";

  const safeParse = (key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const updateCounts = useCallback(() => {
    const cart = safeParse("cart");
    const wishlist = safeParse("wishlist");

    setCartCount(
      cart.reduce((total, item) => total + Number(item.quantity || 1), 0)
    );

    setWishlistCount(wishlist.length);
  }, []);

  useEffect(() => {
    updateCounts();

    window.addEventListener("storage", updateCounts);
    window.addEventListener("cartUpdated", updateCounts);
    window.addEventListener("wishlistUpdated", updateCounts);

    return () => {
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("cartUpdated", updateCounts);
      window.removeEventListener("wishlistUpdated", updateCounts);
    };
  }, [updateCounts]);

  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("is_staff");
    localStorage.removeItem("username");

    closeMenu();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = search.trim();

    if (keyword) {
      navigate(`/products?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate("/products");
    }

    closeMenu();
  };

  const navClass = ({ isActive }) =>
    isActive ? "nav-link fw-bold text-warning" : "nav-link text-light";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-lg"
      style={{
        background: "rgba(0,0,0,0.94)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/" onClick={closeMenu}>
          Mens<span className="text-warning">Wear</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <form
            className="d-flex mx-lg-4 my-3 my-lg-0 w-100"
            onSubmit={handleSearch}
            style={{ maxWidth: "380px" }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ borderRadius: "50px 0 0 50px" }}
              />

              <button
                className="btn btn-warning px-3 px-md-4 fw-bold"
                type="submit"
                style={{ borderRadius: "0 50px 50px 0" }}
              >
                🔍
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 text-center text-lg-start">
            <li className="nav-item">
              <NavLink className={navClass} to="/" onClick={closeMenu}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={navClass} to="/products" onClick={closeMenu}>
                Products
              </NavLink>
            </li>

            {!token && (
              <li className="nav-item">
                <NavLink className={navClass} to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
            )}

            {token && isStaff && (
              <>
                <li className="nav-item">
                  <NavLink className={navClass} to="/admin/dashboard" onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/admin/products" onClick={closeMenu}>
                    AddProducts
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/admin/orders" onClick={closeMenu}>
                    Orders
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/admin/payments" onClick={closeMenu}>
                    Payments
                  </NavLink>
                </li>
                <li className="nav-item">
                 <NavLink className={navClass} to="/admin/coupons" onClick={closeMenu}>
                   Coupons
                 </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/admin/users" onClick={closeMenu}>
                    Users
                  </NavLink>
                </li>
              </>
            )}

            {token && !isStaff && (
              <>
                <li className="nav-item">
                  <NavLink className={navClass} to="/cart" onClick={closeMenu}>
                    Cart
                    {cartCount > 0 && (
                      <span className="badge rounded-pill bg-danger ms-1">
                        {cartCount}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/wishlist" onClick={closeMenu}>
                    Wishlist
                    {wishlistCount > 0 && (
                      <span className="badge rounded-pill bg-warning text-dark ms-1">
                        {wishlistCount}
                      </span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/orders" onClick={closeMenu}>
                    Orders
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/payments" onClick={closeMenu}>
                    Payments
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={navClass} to="/profile" onClick={closeMenu}>
                    Profile
                  </NavLink>
                </li>
              </>
            )}

            {token && (
              <li className="nav-item dropdown mt-2 mt-lg-0">
                <button
                  className="btn btn-outline-light rounded-pill dropdown-toggle px-3 w-100"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <span
                    className="rounded-circle bg-warning text-dark me-2 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: "30px",
                      height: "30px",
                      fontWeight: "bold",
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </span>
                  {username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg">
                  {!isStaff && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/profile" onClick={closeMenu}>
                          My Profile
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/orders" onClick={closeMenu}>
                          My Orders
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/wishlist" onClick={closeMenu}>
                          Wishlist
                        </Link>
                      </li>
                    </>
                  )}

                  {isStaff && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/dashboard"
                          onClick={closeMenu}
                        >
                          Admin Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/add-product"
                          onClick={closeMenu}
                        >
                          Add Product
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/orders"
                          onClick={closeMenu}
                        >
                          Manage Orders
                        </Link>
                      </li>
       
                    </>
                  )}

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      type="button"
                      className="dropdown-item text-danger fw-bold"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;