import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Analytics() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    payments: 0,
    total_sales: 0,
    low_stock: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const response = await API.get("admin/dashboard-stats/");
    setStats(response.data);
  };

  const barData = [
    { name: "Products", value: stats.products },
    { name: "Users", value: stats.users },
    { name: "Orders", value: stats.orders },
    { name: "Payments", value: stats.payments },
  ];

  const pieData = [
    { name: "Sales", value: Number(stats.total_sales || 0) },
    { name: "Low Stock", value: Number(stats.low_stock || 0) },
  ];

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">Analytics Dashboard</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card p-3 shadow text-center">
            <h3>{stats.products}</h3>
            <p>Products</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow text-center">
            <h3>{stats.orders}</h3>
            <p>Orders</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow text-center">
            <h3>₹ {stats.total_sales}</h3>
            <p>Sales</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow text-center">
            <h3>{stats.low_stock}</h3>
            <p>Low Stock</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h5>Business Overview</h5>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#212529" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-4 shadow">
            <h5>Sales / Stock</h5>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  <Cell fill="#198754" />
                  <Cell fill="#dc3545" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;