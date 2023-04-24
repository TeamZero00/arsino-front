import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import axios from "axios";
import styled from "styled-components";

const ChartDiv = styled.div`
  border: 1px solid #2e2e2e;
  border-radius: 2px;
  height: ${({ height }) => height + 2}px;
  margin: 10px 0;
  box-sizing: border-box;
`;

const CandlestickChart = ({ chart, newChart }) => {
  const [options, setOptions] = useState({
    chart: {
      background: "#181818",
      type: "candlestick",
      toolbar: false,
      animations: {
        enabled: false,
      },
    },
    candlestick: {
      wick: {
        useFillColor: false,
      },
      tooltip: {
        enabled: true,
        style: {
          colors: "#000000",
        },
      },
    },
    noData: {
      text: "Loading...",
      style: {
        color: "#777777",
      },
    },
    title: {
      text: "EUR Price",
      align: "left",
      style: {
        color: "#777777",
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 400,
          colors: ["#777777"],
        },
        formatter: (value) => {
          return moment(value).format("HH:mm");
        },
      },
      labels: {
        style: {
          colors: "#777777",
        },
        formatter: (value) => {
          return moment(value).format("HH:mm");
        },
      },
    },

    yaxis: {
      opposite: true,
      labels: {
        style: {
          colors: "#777777",
        },
      },
      min: undefined,
      max: undefined,
    },
  });
  const [chartHeight, setChartHeight] = useState(window.innerHeight * 0.45);
  const updateChartHeight = () => {
    setChartHeight(window.innerHeight * 0.45);
  };
  useEffect(() => {
    window.addEventListener("resize", updateChartHeight);

    return () => {
      window.removeEventListener("resize", updateChartHeight);
    };
  }, []);

  const [series, setSeries] = useState([{ data: [] }]);

  const sortWebsocketUrl = "wss://amg-backend.runeterra.info";
  const sortChart = chart.sort((a, b) => {
    return a.id - b.id;
  });
  useEffect(() => {
    const fetchChartData = async () => {
      const data = sortChart.map((item) => {
        const timestamp2 = parseInt(item.timestamp, 10);
        const open2 = parseFloat(item.open);
        const high2 = parseFloat(item.high);
        const low2 = parseFloat(item.low);
        const close2 = parseFloat(item.close);
        return { x: timestamp2, y: [open2, high2, low2, close2] };
      });

      const currentTime = Date.now();
      const threeHoursAgo = currentTime - 3 * 60 * 60 * 1000;
      const filteredData = data.filter(
        (candlestick) => candlestick.x >= threeHoursAgo
      );
      updateYAxisRange(filteredData);
      setSeries([{ data: filteredData }]);
      // console.log(data2, "data2");
    };
    fetchChartData();
  }, []);

  const updateXAxisRange = () => {
    const currentTime = Date.now();
    const threeHoursAgo = currentTime - 1 * 60 * 60 * 1000;

    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        min: threeHoursAgo,
        max: currentTime,
      },
    }));
  };
  const updateYAxisRange = (data) => {
    if (data.length === 0) {
      return;
    }

    let min = data[0].y[2]; // Low
    let max = data[0].y[1]; // High

    data.forEach((candlestick) => {
      min = Math.min(min, candlestick.y[2]); // Low
      max = Math.max(max, candlestick.y[1]); // High
    });

    const rangePadding = (max - min) * 0.2; // 10% 패딩 추가

    setOptions((prevOptions) => ({
      ...prevOptions,
      yaxis: {
        ...prevOptions.yaxis,
        min: min - rangePadding,
        max: max + rangePadding,
      },
    }));
  };

  const isInvalidValue = (value) => {
    return value === null || value === undefined || Number.isNaN(value);
  };

  const isValidChartData = (chartData) => {
    if (!chartData) {
      return false;
    }

    if (isInvalidValue(chartData.x)) {
      return false;
    }

    for (const value of chartData.y) {
      if (isInvalidValue(value)) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (isValidChartData(newChart)) {
      updateChartData(newChart);
    } else {
      console.error("Invalid newChartData:", newChart);
    }
  }, [newChart]);

  const updateChartData = (newChartData) => {
    setSeries((prevState) => {
      let data = [...prevState[0].data];
      const lastCandlestick = data[data.length - 1];

      if (lastCandlestick.x === newChartData.x) {
        data[data.length - 1] = newChartData;
      } else {
        data.push(newChartData);
        if (data.length > 600) {
          data.shift();
        }
      }

      updateXAxisRange();
      return [{ data: [...data] }];
    });
  };

  // const handleTooltip = ({ seriesIndex, dataPointIndex, w }) => {
  //   const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
  //   const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
  //   const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
  //   const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
  //   const tooltipTitle = moment(w.globals.seriesX[0][dataPointIndex]).format("YYYY-MM-DD HH:mm");

  //   return `
  //     <div>Open: ${o.toFixed(2)}</div>
  //     <div>High: ${h.toFixed(2)}</div>
  //     <div>Low: ${l.toFixed(2)}</div>
  //     <div>Close: ${c.toFixed(2)}</div>
  //   `;
  // };

  return (
    <ChartDiv height={chartHeight}>
      <ReactApexChart
        options={{
          ...options,
          tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            // custom: handleTooltip,
          },
        }}
        series={series}
        type="candlestick"
        height={chartHeight}
      />
    </ChartDiv>
  );
};

export default CandlestickChart;
