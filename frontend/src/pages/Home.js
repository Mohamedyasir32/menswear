import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Hero Section */}

      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "90vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="container text-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            padding: "60px",
            borderRadius: "20px",
          }}
        >
          <h1 className="display-3 fw-bold mb-4">
            Premium Menswear Collection
          </h1>

          <p className="lead mb-4">
            Discover stylish fashion, premium quality and modern outfits for men
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/products" className="btn btn-warning btn-lg px-4">
              Shop Now
            </Link>

            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}

      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Shop By Category</h2>
          <p className="text-muted">
            Explore the latest menswear categories
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card border-0 shadow text-center h-100">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"
                alt="T-Shirts"
                className="card-img-top"
                height="300"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body">
                <h4>T-Shirts</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow text-center h-100">
              <img
                src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop"
                alt="Shirts"
                className="card-img-top"
                height="300"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body">
                <h4>Shirts</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow text-center h-100">
              <img
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop"
                alt="Jeans"
                className="card-img-top"
                height="300"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body">
                <h4>Jeans</h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card border-0 shadow text-center h-100">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
                alt="Shoes"
                className="card-img-top"
                height="300"
                style={{ objectFit: "cover" }}
              />

              <div className="card-body">
                <h4>Shoes</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}

      <section className="bg-dark text-white py-5">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4">
                <h2>🚚</h2>
                <h4>Fast Delivery</h4>
                <p>Quick and secure delivery to your doorstep</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <h2>💳</h2>
                <h4>Secure Payment</h4>
                <p>Safe payment methods with full protection</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <h2>⭐</h2>
                <h4>Premium Quality</h4>
                <p>High-quality menswear products for modern fashion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="container py-5 text-center">
        <h2 className="fw-bold mb-4">
          Upgrade Your Fashion Style
        </h2>

        <p className="lead text-muted mb-4">
          Explore our latest collection and redefine your wardrobe
        </p>

        <Link to="/products" className="btn btn-dark btn-lg px-5">
          Explore Products
        </Link>
      </section>
    </div>
  );
}

export default Home;