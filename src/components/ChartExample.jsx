import React, { useRef, useState, useEffect, useCallback } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
// [
//   1499040000000,      // Kline open time
//   "0.01634790",       // Open price
//   "0.80000000",       // High price
//   "0.01575800",       // Low price
//   "0.01577100",       // Close price
//   "148976.11427815",  // Volume
//   1499644799999,      // Kline Close time
//   "2434.19055334",    // Quote asset volume
//   308,                // Number of trades
//   "1756.87402397",    // Taker buy base asset volume
//   "28.46694368",      // Taker buy quote asset volume
//   "0"                 // Unused field, ignore.
// ]
const ChartExample = () => {
  const chartRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (chart) {
      chart.destroy();
    }

    const myChartRef = chartRef.current.getContext("2d");

    // Sample data
    const labels = ["January", "February", "March", "April", "May", "June", "July"];
    const data = [65, 59, 80, 81, 56, 55, 40];

    const newChart = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Price",
            data: data,
            borderColor: "rgba(0, 123, 255, 1)",
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 10,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "rgba(0, 123, 255, 1)",
            pointHoverBorderColor: "rgba(0, 123, 255, 1)",
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              color: "rgba(169, 172, 183, 0.1)",
              borderDash: [5, 5],
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "rgba(255, 255, 255, 1)",
            bodyColor: "rgba(255, 255, 255, 1)",
          },
        },
      },
    });

    setChart(newChart);
    return () => {
      newChart.destroy();
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default ChartExample;
