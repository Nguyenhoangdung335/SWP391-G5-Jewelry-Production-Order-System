import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Revenue",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: $${context.raw}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 35,
        minRotation: 35,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Revenue ($)',
      },
    },
  },
};

const LineChartRevenue = (dashboard) => {
  const [ labels, setLabels ] = useState([]);
  const [ datas, setDatas ] = useState([]);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: datas,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        pointBackgroundColor: "blue",
        pointBorderColor: "blue",
        tension: 0.4,
      }
    ],
  };

  useEffect(() => {
    if (dashboard.data) {
      console.log(dashboard.data);
      setLabels(dashboard.data.labelsList);
      setDatas(dashboard.data.dataList);
    }
  }, [dashboard]);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChartRevenue;
