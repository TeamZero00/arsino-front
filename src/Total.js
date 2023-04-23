import { useState, useEffect } from "react";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import WalletConnectionContext from "./WalletConnectionContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Total({ price, pool, bettingList, winner, chart, newChart, setting }) {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div>
      {setting && (
        <WalletConnectionContext.Provider
          value={{ isConnected, setIsConnected }}
        >
          <Header />
          <InfoChart
            isConnected={isConnected}
            price={price}
            pool={pool}
            bettingList={bettingList}
            winner={winner}
            chart={chart}
            newChart={newChart}
          />
        </WalletConnectionContext.Provider>
      )}
    </div>
  );
}

export default Total;
