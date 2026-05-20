import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "react-toastify";

import API from "../../api/axios";

function Coupons() {

  const [coupons, setCoupons] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("all");

  const [form, setForm] =
    useState({
      code: "",
      discount_percent: "",
      active: true,
    });

  const [editId, setEditId] =
    useState(null);

  const fetchCoupons =
    useCallback(async () => {

      setLoading(true);

      try {

        const response =
          await API.get(
            "admin/coupons/"
          );

        setCoupons(
          Array.isArray(
            response.data
          )
            ? response.data
            : []
        );

      } catch (error) {

        console.log(
          error.response?.data ||
          error
        );

        toast.error(
          "Failed to load coupons"
        );

      } finally {

        setLoading(false);
      }
    }, []);

  useEffect(() => {

    fetchCoupons();

  }, [fetchCoupons]);

  const filteredCoupons =
    useMemo(() => {

      return coupons.filter(
        (coupon) => {

          const code =
            coupon.code || "";

          const matchesSearch =
            code
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            statusFilter ===
              "all" ||

            (
              statusFilter ===
                "active" &&
              coupon.active
            ) ||

            (
              statusFilter ===
                "inactive" &&
              !coupon.active
            );

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      coupons,
      search,
      statusFilter,
    ]);

  const activeCoupons =
    coupons.filter(
      (coupon) =>
        coupon.active
    ).length;

  const inactiveCoupons =
    coupons.filter(
      (coupon) =>
        !coupon.active
    ).length;

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value.toUpperCase(),
    }));
  };

  const resetForm = () => {

    setForm({
      code: "",
      discount_percent: "",
      active: true,
    });

    setEditId(null);
  };

  const validateForm = () => {

    const code =
      form.code
        .trim()
        .toUpperCase();

    const discount =
      Number(
        form.discount_percent
      );

    if (!code) {

      toast.error(
        "Coupon code required"
      );

      return false;
    }

    if (
      !discount ||
      discount < 1 ||
      discount > 100
    ) {

      toast.error(
        "Discount must be between 1 and 100"
      );

      return false;
    }

    return true;
  };

  const saveCoupon =
    async (e) => {

      e.preventDefault();

      if (
        !validateForm()
      ) return;

      setSaving(true);

      const payload = {
        code:
          form.code
            .trim()
            .toUpperCase(),

        discount_percent:
          Number(
            form.discount_percent
          ),

        active:
          form.active,
      };

      try {

        if (editId) {

          await API.put(
            `admin/coupons/${editId}/`,
            payload
          );

          toast.success(
            "Coupon updated"
          );

        } else {

          await API.post(
            "admin/coupons/",
            payload
          );

          toast.success(
            "Coupon created"
          );
        }

        resetForm();

        fetchCoupons();

      } catch (error) {

        console.log(
          error.response?.data ||
          error
        );

        toast.error(
          error.response?.data?.error ||
          "Failed to save coupon"
        );

      } finally {

        setSaving(false);
      }
    };

  const editCoupon =
    (coupon) => {

      setEditId(
        coupon.id
      );

      setForm({
        code:
          coupon.code || "",

        discount_percent:
          coupon.discount_percent ||
          "",

        active:
          Boolean(
            coupon.active
          ),
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  const toggleCoupon =
    async (coupon) => {

      try {

        await API.patch(
          `admin/coupons/${coupon.id}/`,
          {
            active:
              !coupon.active,
          }
        );

        toast.success(
          coupon.active
            ? "Coupon deactivated"
            : "Coupon activated"
        );

        fetchCoupons();

      } catch (error) {

        console.log(
          error.response?.data ||
          error
        );

        toast.error(
          "Update failed"
        );
      }
    };

  const deleteCoupon =
    async (id) => {

      if (
        !window.confirm(
          "Delete this coupon?"
        )
      ) return;

      try {

        await API.delete(
          `admin/coupons/${id}/`
        );

        toast.success(
          "Coupon deleted"
        );

        fetchCoupons();

      } catch (error) {

        console.log(
          error.response?.data ||
          error
        );

        toast.error(
          "Delete failed"
        );
      }
    };

  if (loading) {

    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-dark"
          role="status"
        ></div>

        <p className="mt-3 text-muted">
          Loading coupons...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-4 py-md-5"
      style={{
        background:
          "#f5f7fa",
      }}
    >
      <div className="container">

        <div className="card border-0 shadow-lg mb-4 overflow-hidden">

          <div
            className="p-4 p-md-5 text-white"
            style={{
              background:
                "linear-gradient(135deg, #000000, #343a40)",
            }}
          >
            <h1 className="fw-bold">
              Coupon Management
            </h1>

            <p className="mb-0 opacity-75">
              Create and manage coupons
            </p>
          </div>
        </div>

        <div className="row g-4">

          <div className="col-lg-4">

            <div className="card border-0 shadow-lg">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-4">

                  {editId
                    ? "Edit Coupon"
                    : "Create Coupon"}

                </h4>

                <form
                  onSubmit={saveCoupon}
                >

                  <label className="form-label fw-semibold">
                    Coupon Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    className="form-control form-control-lg mb-3"
                    placeholder="WELCOME10"
                    value={form.code}
                    onChange={handleChange}
                  />

                  <label className="form-label fw-semibold">
                    Discount %
                  </label>

                  <input
                    type="number"
                    name="discount_percent"
                    className="form-control form-control-lg mb-3"
                    placeholder="10"
                    value={form.discount_percent}
                    onChange={handleChange}
                    min="1"
                    max="100"
                  />

                  <div className="form-check mb-4">

                    <input
                      id="active"
                      type="checkbox"
                      name="active"
                      className="form-check-input"
                      checked={form.active}
                      onChange={handleChange}
                    />

                    <label
                      htmlFor="active"
                      className="form-check-label"
                    >
                      Active
                    </label>

                  </div>

                  <button
                    className="btn btn-dark w-100 py-3 fw-bold"
                    disabled={saving}
                  >

                    {saving
                      ? "Saving..."
                      : editId
                        ? "Update Coupon"
                        : "Create Coupon"}

                  </button>

                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">

            <div className="card border-0 shadow-lg">

              <div className="card-body p-4">

                <div className="row mb-3">

                  <div className="col-md-8 mb-2">

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search coupon..."
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <div className="col-md-4 mb-2">

                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value
                        )
                      }
                    >
                      <option value="all">
                        All
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>

                    </select>
                  </div>
                </div>

                <div className="table-responsive">

                  <table className="table align-middle">

                    <thead>

                      <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>

                    </thead>

                    <tbody>

                      {filteredCoupons.map(
                        (coupon) => (

                          <tr key={coupon.id}>

                            <td className="fw-bold">
                              {coupon.code}
                            </td>

                            <td>
                              {
                                coupon.discount_percent
                              }%
                            </td>

                            <td>

                              <span
                                className={`badge ${
                                  coupon.active
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {coupon.active
                                  ? "Active"
                                  : "Inactive"}
                              </span>

                            </td>

                            <td>

                              <div className="d-flex gap-2 flex-wrap">

                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() =>
                                    editCoupon(
                                      coupon
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className={`btn btn-sm ${
                                    coupon.active
                                      ? "btn-outline-secondary"
                                      : "btn-success"
                                  }`}
                                  onClick={() =>
                                    toggleCoupon(
                                      coupon
                                    )
                                  }
                                >
                                  {coupon.active
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>

                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    deleteCoupon(
                                      coupon.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>
                            </td>
                          </tr>
                        )
                      )}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-5 text-muted">
          <small>
            MensWear Admin Panel © 2026
          </small>
        </div>
      </div>
    </div>
  );
}

export default Coupons;