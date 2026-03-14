import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import axios from "axios";
import AIPrediction from "../components/AIPrediction";
import DashboardCards from "../components/DashboardCards";
import StockChart from "../components/StockChart";

function Dashboard() {
  const [lowStock, setLowStock] = useState([]);

  const exportExcel = () => {
    // Use lowStock instead of undefined 'products'
    const worksheet = XLSX.utils.json_to_sheet(lowStock);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "inventory.xlsx");
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/lowstock")
      .then(res => {
        setLowStock(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <button
        onClick={exportExcel}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Export Inventory
      </button>

      {lowStock.length > 0 && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <h2 className="text-red-700 font-bold">⚠ Low Stock Alert</h2>
          {lowStock.map(p => (
            <p key={p.id}>
              {p.name} only {p.quantity} left
            </p>
          ))}
        </div>
      )}

      {/* Other dashboard components */}
      <DashboardCards />
      <StockChart />
      <AIPrediction />
    </div>
  );
}

export default Dashboard;