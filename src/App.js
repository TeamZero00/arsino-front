import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import BalanceContext from "./components/BalanceContext";
import LandingPage from "./components/LandingPage";
import { Route, Routes } from "react-router-dom";
import Total from "./Total";
import Swap from "./components/Page/Swap";

function App({ getInfo }) {
  const [balance, setBalance] = useState(null);
  // const [socket, setSocket] = useState(null);
  // const [price, setPrice] = useState({
  //   before24HourPrice: "0",
  //   nowPrice: "0",
  //   highPrice: "0",
  //   lowPrice: "0",
  // });
  // const [pool, setPool] = useState("");
  // const [bettingList, setBettingList] = useState([]);
  // const [winner, setWinner] = useState({
  //   height: 0,
  //   winners: [],
  // });
  // const [chart, setChart] = useState([]);

  // useEffect(() => {
  //   // eslint-disable-next-line no-undef
  //   const ws = new WebSocket("ws://66.42.38.167:8080");
  //   setSocket(ws);
  //   // DB WS
  //   ws.onopen = () => {
  //     console.log("EUR/USD Client Connected");
  //   };
  //   ws.onmessage = (message) => {
  //     const data = JSON.parse(message.data);
  //     const method = data.method;
  //     console.log("method", method);
  //     switch (method) {
  //       case "new_winners":
  //         const newWinner = data.data;
  //         setWinner(newWinner);
  //         break;
  //       case "price_update":
  //         const newPrice = data.data;
  //         console.log("price", newPrice);
  //         setPrice(newPrice);
  //         break;
  //       case "betting_update":
  //         const newBettingList = data.data;
  //         setBettingList(newBettingList);
  //         break;
  //       case "new_chart":
  //         const newChart = [...chart, data];
  //         setChart(newChart);
  //         break;
  //       case "init": {
  //         console.log(data.data);
  //         const { chart, game, poolBalance, price } = data.data;
  //         setChart(chart);
  //         setBettingList(game);
  //         setPool(poolBalance);
  //         setPrice(price);
  //         break;
  //       }
  //       default:
  //         break;
  //     }
  //   };
  //   return () => {
  //     ws.close();
  //   };
  // }, []);
  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <div className="App">
        {/* <LandingPage />
        <Header />
        <InfoChart /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade" element={<Total />} />
          <Route path="/bank" element={<Swap />} />
        </Routes>
      </div>
    </BalanceContext.Provider>
  );
}

export default App;
