import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  { month: "Jan", stock: 30 },
  { month: "Feb", stock: 45 },
  { month: "Mar", stock: 40 },
  { month: "Apr", stock: 60 },
  { month: "May", stock: 55 }
];

function StockChart() {

  return (

    <div className="bg-white shadow rounded-xl p-6 mt-10">

      <h2 className="text-xl mb-4">
        AI Inventory Trend
      </h2>

      <LineChart width={600} height={300} data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="month" />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="stock"
          stroke="#6366f1"
        />

      </LineChart>

    </div>

  );
}

export default StockChart;