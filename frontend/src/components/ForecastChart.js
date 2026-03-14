import ForecastChart from "./ForecastChart";
import { Line } from "react-chartjs-2";

function ForecastChart() {

  const data = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [
      {
        label: "Product Demand Forecast",
        data: [20,25,30,28,40,45]
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <Line data={data}/>
    </div>
  );
}

<ForecastChart />

export default ForecastChart;