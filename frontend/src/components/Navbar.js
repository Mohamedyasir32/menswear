import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

function Navbar() {
  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "access"
    );

  const username =
    localStorage.getItem(
      "username"
    );

  const isStaff =
    localStorage.getItem(
      "is_staff"
    ) === "true";

  const [search,
    setSearch] =
    useState("");

  const [cartCount,
    setCartCount] =
    useState(0);

  const [wishlistCount,
    setWishlistCount] =
    useState(0);

  useEffect(() => {
    updateCounts();

    window.addEventListener(
      "storage",
      updateCounts
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateCounts
      );
    };
  }, []);

  const updateCounts =
    () => {
      const cart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          )
        ) || [];

      const wishlist =
        JSON.parse(
          localStorage.getItem(
            "wishlist"
          )
        ) || [];

      setCartCount(
        cart.length
      );

      setWishlistCount(
        wishlist.length
      );
    };

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  const handleSearch = (
    e
  ) => {
    e.preventDefault();

    if (
      search.trim()
    ) {
      navigate(
        `/products?search=${search}`
      );
    } else {
      navigate(
        "/products"
      );
    }
  };

  const navClass = ({
    isActive,
  }) =>
    isActive
      ? "nav-link fw-bold text-warning"
      : "nav-link text-light";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top shadow-lg"
      style={{
        background:
          "rgba(0,0,0,0.92)",
        backdropFilter:
          "blur(10px)",
      }}
    >
      <div className="container">
        {/* Logo */}

        <Link
          className="navbar-brand fw-bold fs-3"
          to="/"
        >
          Mens
          <span className="text-warning">
            Wear
          </span>
        </Link>

        {/* Toggle */}

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          {/* Search */}

          <form
            className="d-flex mx-lg-4 my-3 my-lg-0"
            onSubmit={
              handleSearch
            }
            style={{
              maxWidth:
                "350px",
              width:
                "100%",
            }}
          >
            <div className="input-group">
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search products..."
                value={
                  search
                }
                onChange={(
                  e
                ) =>
                  setSearch(
                    e.target
                      .value
                  )
                }
                style={{
                  borderRadius:
                    "50px 0 0 50px",
                }}
              />

              <button
                className="btn btn-warning px-4 fw-bold"
                type="submit"
                style={{
                  borderRadius:
                    "0 50px 50px 0",
                }}
              >
                🔍
              </button>
            </div>
          </form>

          {/* Links */}

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {/* Home */}

            <li className="nav-item">
              <NavLink
                className={
                  navClass
                }
                to="/"
              >
                Home
              </NavLink>
            </li>

            {/* Products */}

            <li className="nav-item">
              <NavLink
                className={
                  navClass
                }
                to="/products"
              >
                Products
              </NavLink>
            </li>

            {/* Guest */}

            {!token && (
              <>
                <li className="nav-item">
                  <NavLink
                    className={
                      navClass
                    }
                    to="/login"
                  >
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-warning rounded-pill px-4 fw-bold"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* Admin */}

            {token &&
              isStaff && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/admin/dashboard"
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/admin/products"
                    >
                      Products
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/admin/orders"
                    >
                      Orders
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/admin/payments"
                    >
                      Payments
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/admin/users"
                    >
                      Users
                    </NavLink>
                  </li>
                </>
              )}

            {/* Normal User */}

            {token &&
              !isStaff && (
                <>
                  {/* Cart */}

                  <li className="nav-item position-relative">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/cart"
                    >
                       Cart
                    </NavLink>

                    {cartCount >
                      0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                          fontSize:
                            "10px",
                        }}
                      >
                        {
                          cartCount
                        }
                      </span>
                    )}
                  </li>

                  {/* Wishlist */}

                  <li className="nav-item position-relative">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/wishlist"
                    >
                       Wishlist
                    </NavLink>

                    {wishlistCount >
                      0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                        style={{
                          fontSize:
                            "10px",
                        }}
                      >
                        {
                          wishlistCount
                        }
                      </span>
                    )}
                  </li>

                  {/* Orders */}

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/orders"
                    >
                      Orders
                    </NavLink>
                  </li>

                  {/* Payments */}

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/payments"
                    >
                      Payments
                    </NavLink>
                  </li>

                  {/* Profile */}

                  <li className="nav-item">
                    <NavLink
                      className={
                        navClass
                      }
                      to="/profile"
                    >
                      Profile
                    </NavLink>
                  </li>
                </>
              )}

            {/* User Dropdown */}

            {token && (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-light rounded-pill dropdown-toggle px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <span
                    className="rounded-circle bg-warning text-dark me-2 d-inline-flex align-items-center justify-content-center"
                    style={{
                      width:
                        "30px",
                      height:
                        "30px",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {username
                      ?.charAt(
                        0
                      )
                      .toUpperCase()}
                  </span>

                  {username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg">
                  {!isStaff && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/profile"
                        >
                          My Profile
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/orders"
                        >
                          My Orders
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/wishlist"
                        >
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
                        >
                          Admin Dashboard
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/add-product"
                        >
                          Add Product
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/orders"
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
                      onClick={
                        logout
                      }
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