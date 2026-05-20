import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

function Navbar() {

  const navigate =
    useNavigate();

  const [cartCount,
    setCartCount] =
    useState(0);

  const [wishlistCount,
    setWishlistCount] =
    useState(0);

  const [menuOpen,
    setMenuOpen] =
    useState(false);

  const token =
    localStorage.getItem(
      "access"
    );

  const username =
    localStorage.getItem(
      "username"
    ) || "User";

  const isStaff =
    localStorage.getItem(
      "is_staff"
    ) === "true";

  const safeParse = (key) => {

    try {

      const data =
        JSON.parse(
          localStorage.getItem(key)
        );

      return Array.isArray(data)
        ? data
        : [];

    } catch {

      return [];
    }
  };

  const updateCounts =
    useCallback(() => {

      const cart =
        safeParse("cart");

      const wishlist =
        safeParse("wishlist");

      setCartCount(
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.quantity || 1
            ),
          0
        )
      );

      setWishlistCount(
        wishlist.length
      );

    }, []);

  useEffect(() => {

    updateCounts();

    window.addEventListener(
      "storage",
      updateCounts
    );

    window.addEventListener(
      "cartUpdated",
      updateCounts
    );

    window.addEventListener(
      "wishlistUpdated",
      updateCounts
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateCounts
      );

      window.removeEventListener(
        "cartUpdated",
        updateCounts
      );

      window.removeEventListener(
        "wishlistUpdated",
        updateCounts
      );
    };

  }, [updateCounts]);

  const closeMenu = () =>
    setMenuOpen(false);

  const logout = () => {

    localStorage.removeItem(
      "access"
    );

    localStorage.removeItem(
      "refresh"
    );

    localStorage.removeItem(
      "is_staff"
    );

    localStorage.removeItem(
      "username"
    );

    closeMenu();

    navigate("/login");
  };

  const navClass =
    ({ isActive }) =>

      isActive
        ? "nav-link active-link"
        : "nav-link normal-link";

  return (

    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top navbar-custom"
    >

      <div className="container">

        {/* Logo */}

        <Link
          className="navbar-brand fw-bold logo-text"
          to="/"
          onClick={closeMenu}
        >
          Mens
          <span className="text-warning">
            Wear
          </span>
        </Link>

        {/* Mobile Toggle */}

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() =>
            setMenuOpen(
              !menuOpen
            )
          }
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}

        <div
          className={`collapse navbar-collapse ${
            menuOpen
              ? "show"
              : ""
          }`}
        >

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2 text-center">

            <li className="nav-item">
              <NavLink
                className={navClass}
                to="/"
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className={navClass}
                to="/products"
                onClick={closeMenu}
              >
                Products
              </NavLink>
            </li>

            {!token && (

              <li className="nav-item">

                <NavLink
                  className={navClass}
                  to="/login"
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

              </li>
            )}

            {/* USER NAV */}

            {token && !isStaff && (
              <>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/cart"
                    onClick={closeMenu}
                  >

                    Cart

                    {cartCount > 0 && (

                      <span className="badge rounded-pill bg-danger ms-1">

                        {cartCount}

                      </span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/wishlist"
                    onClick={closeMenu}
                  >

                    Wishlist

                    {wishlistCount > 0 && (

                      <span className="badge rounded-pill bg-warning text-dark ms-1">

                        {wishlistCount}

                      </span>
                    )}
                  </NavLink>
                </li>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/orders"
                    onClick={closeMenu}
                  >
                    Orders
                  </NavLink>

                </li>
              </>
            )}

            {/* ADMIN NAV */}

            {token && isStaff && (
              <>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/admin/dashboard"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </NavLink>

                </li>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/admin/products"
                    onClick={closeMenu}
                  >
                    Products
                  </NavLink>

                </li>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/admin/orders"
                    onClick={closeMenu}
                  >
                    Orders
                  </NavLink>

                </li>

                <li className="nav-item">

                  <NavLink
                    className={navClass}
                    to="/admin/coupons"
                    onClick={closeMenu}
                  >
                    Coupons
                  </NavLink>

                </li>

              </>
            )}

            {/* USER DROPDOWN */}

            {token && (

              <li className="nav-item dropdown mt-2 mt-lg-0">

                <button
                  className="btn profile-btn dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >

                  <span
                    className="profile-avatar"
                  >

                    {username
                      .charAt(0)
                      .toUpperCase()}

                  </span>

                  <span className="username-text">

                    {username}

                  </span>

                </button>

                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg">

                  {!isStaff && (
                    <>
                      <li>

                        <Link
                          className="dropdown-item"
                          to="/profile"
                          onClick={closeMenu}
                        >
                          My Profile
                        </Link>

                      </li>

                      <li>

                        <Link
                          className="dropdown-item"
                          to="/payments"
                          onClick={closeMenu}
                        >
                          Payments
                        </Link>

                      </li>
                    </>
                  )}

                  {isStaff && (
                    <>
                      <li>

                        <Link
                          className="dropdown-item"
                          to="/admin/analytics"
                          onClick={closeMenu}
                        >
                          Analytics
                        </Link>

                      </li>

                      <li>

                        <Link
                          className="dropdown-item"
                          to="/admin/payments"
                          onClick={closeMenu}
                        >
                          Payments
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

      {/* CSS */}

      <style>
        {`

          .navbar-custom {
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(12px);
            padding: 12px 0;
          }

          .logo-text {
            font-size: 28px;
            letter-spacing: 1px;
          }

          .normal-link {
            color: rgba(255,255,255,0.85) !important;
            font-weight: 500;
            transition: 0.3s;
          }

          .normal-link:hover {
            color: #ffc107 !important;
          }

          .active-link {
            color: #ffc107 !important;
            font-weight: 700;
          }

          .profile-btn {
            background: rgba(255,255,255,0.08);
            color: white;
            border: none;
            border-radius: 50px;
            padding: 7px 14px;
          }

          .profile-btn:hover {
            background: rgba(255,255,255,0.14);
            color: white;
          }

          .profile-avatar {
            width: 32px;
            height: 32px;
            background: #ffc107;
            color: black;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 8px;
          }

          .username-text {
            font-size: 14px;
            font-weight: 600;
          }

          .dropdown-menu {
            border-radius: 14px;
            overflow: hidden;
          }

          .dropdown-item {
            padding: 10px 16px;
            font-weight: 500;
          }

          .dropdown-item:hover {
            background: #f5f5f5;
          }

          @media (max-width: 991px) {

            .navbar-collapse {
              margin-top: 18px;
              background: rgba(0,0,0,0.98);
              padding: 18px;
              border-radius: 18px;
            }

            .nav-link {
              padding: 12px 0 !important;
            }

            .profile-btn {
              width: 100%;
              justify-content: center;
              margin-top: 12px;
            }
          }

        `}
      </style>
    </nav>
  );
}

export default Navbar;