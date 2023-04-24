import "./App.css";
import { useState, createContext, useEffect } from "react";

import LandingPage from "./components/LandingPage";
import { Route, Routes } from "react-router-dom";
import Total from "./Total";
import Bank from "./Page/Bank";
import Score from "./Page/Score";
import { QueryClient, QueryClientProvider } from "react-query";
import connectWallet from "./wallet/connect";
import networkInfo from "./wallet/network_info";
export const WalletContext = createContext();
const queryClient = new QueryClient();
function App({ getInfo }) {
  const [wallet, setWallet] = useState();
  const [socket, setSocket] = useState(null);
  const [price, setPrice] = useState({
    before24HourPrice: "0",
    nowPrice: "0",
    highPrice: "0",
    lowPrice: "0",
  });
  const [pool, setPool] = useState("");
  const [bettingList, setBettingList] = useState([]);
  const [winner, setWinner] = useState({
    height: 0,
    winners: [],
  });
  const [chart, setChart] = useState([]);
  const [newChart, setNewChart] = useState([]);
  const [setting, setSetting] = useState(null);

  useEffect(() => {
    if (!wallet) {
      const wallet = sessionStorage.getItem("wallet");
      console.log(wallet);
      if (!wallet) {
        setWallet(wallet);
      }
    }
    const ws = new WebSocket("ws://66.42.38.167:8080");
    setSocket(ws);
    // DB WS
    ws.onopen = () => {
      console.log("EUR/USD Client Connected");
    };
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      const method = data.method;
      // console.log("method", method);
      switch (method) {
        case "new_pool":
          const pool = data.data;
          setPool(pool);
          break;
        case "new_winners":
          const newWinner = data.data;
          setWinner(newWinner);
          break;
        case "price_update":
          const newPrice = data.data;
          // console.log("price", newPrice);
          setPrice(newPrice);
          break;
        case "betting_update":
          const newBettingList = data.data;
          setBettingList(newBettingList);
          break;
        case "new_chart":
          const newChart = [data];
          const newChartTS = newChart[0].data.timestamp;
          const newChartOpen = newChart[0].data.open;
          const newChartHigh = newChart[0].data.high;
          const newChartLow = newChart[0].data.low;
          const newChartClose = newChart[0].data.close;
          // const newChartId = newChart[0].data.id;
          const newSetupChart = {
            x: newChartTS,
            y: [newChartOpen, newChartHigh, newChartLow, newChartClose],
          };

          setNewChart(newSetupChart);
          // console.log("뉴차트셋업", newSetupChart);
          break;
        case "init": {
          const { chart, game, pool, price } = data.data;
          // console.log("", data.data);
          setChart(chart);
          setBettingList(game);
          setPool(pool);
          setPrice(price);
          setSetting(true);
          break;
        }
        default:
          break;
      }
    };
    return () => {
      ws.close();
    };
  }, []);

  if (!setting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <WalletContext.Provider value={{ wallet, setWallet }}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/trade"
              element={
                <Total
                  setting={setting}
                  price={price}
                  pool={pool}
                  bettingList={bettingList}
                  winner={winner}
                  chart={chart}
                  newChart={newChart}
                />
              }
            />
            {/* <Route path="/score" element={<Score />} /> */}
            <Route path="/bank" element={<Bank pool={pool} />} />
          </Routes>
        </QueryClientProvider>
      </WalletContext.Provider>
    </div>
  );
}

export default App;
