import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import axios from "axios";

const CandlestickChart = () => {
  const [options, setOptions] = useState({
    chart: {
      background: "#16182e",
      type: "candlestick",
      height: 350,
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
      },
    },
    noData: {
      text: "Loading...",
      style: {
        color: "#ffffff",
      },
    },
    title: {
      text: "BTCUSDT Candlestick Chart",
      align: "left",
      style: {
        color: "#ffffff",
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
          colors: ["#ffffff"],
        },
        formatter: (value) => {
          return moment(value).format("HH:mm");
        },
      },
      labels: {
        style: {
          colors: "#ffffff",
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
          colors: "#ffffff",
        },
      },
    },
  });

  const [series, setSeries] = useState([{ data: [] }]);

  useEffect(() => {
    const symbol = "btcusdt";
    const interval = "1m";
    const websocketUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;

    let ws = null;
    let isMounted = true;

    const fetchChartData = async () => {
      const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=30`);
      const klines = response.data;
      const data = klines.map((kline) => {
        const timestamp = kline[0];
        const open = parseFloat(kline[1]);
        const high = parseFloat(kline[2]);
        const low = parseFloat(kline[3]);
        const close = parseFloat(kline[4]);
        return { x: timestamp, y: [open, high, low, close] };
      });
      setSeries([{ data }]);
    };
    fetchChartData();

    const connectWebSocket = () => {
      ws = new WebSocket(websocketUrl);
      ws.onopen = () => console.log(`Connected to ${websocketUrl}`);
      ws.onmessage = (event) => {
        const kline = JSON.parse(event.data).k;
        const timestamp = kline.t;
        const open = parseFloat(kline.o);
        const high = parseFloat(kline.h);
        const low = parseFloat(kline.l);
        const close = parseFloat(kline.c);
        const newCandlestick = {
          x: timestamp,
          y: [open, high, low, close],
        };

        if (isMounted) {
          setSeries((prevState) => {
            let data = [...prevState[0].data];
            const lastCandlestick = data[data.length - 1];

            if (lastCandlestick.x === newCandlestick.x) {
              // Update the last candlestick if it has the same timestamp
              data[data.length - 1] = newCandlestick;
            } else {
              // Add the new candlestick if the timestamp is different
              data.push(newCandlestick);

              if (data.length > 600) {
                data.shift();
              }
            }

            return [{ data }];
          });
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed.");
        // 웹소켓 연결 종료 시 재접속 시도
        if (isMounted) {
          setTimeout(() => {
            connectWebSocket();
          }, 1000);
        }
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const handleTooltip = ({ seriesIndex, dataPointIndex, w }) => {
    const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
    const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
    const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
    const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
    const tooltipTitle = moment(w.globals.seriesX[0][dataPointIndex]).format("YYYY-MM-DD HH:mm");
    return `
      <div>Open: ${o.toFixed(2)}</div>
      <div>High: ${h.toFixed(2)}</div>
      <div>Low: ${l.toFixed(2)}</div>
      <div>Close: ${c.toFixed(2)}</div>
    `;
  };

  return (
    <ReactApexChart
      options={{
        ...options,
        tooltip: {
          enabled: true,
          shared: true,
          intersect: false,
          custom: handleTooltip,
        },
      }}
      series={series}
      type="candlestick"
      height={350}
    />
  );
};

export default CandlestickChart;
