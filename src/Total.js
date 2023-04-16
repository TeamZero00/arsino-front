import { useState } from "react";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import WalletConnectionContext from "./WalletConnectionContext";

function Total() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div>
      <WalletConnectionContext.Provider value={{ isConnected, setIsConnected }}>
        <Header />
        <InfoChart isConnected={isConnected} />
      </WalletConnectionContext.Provider>
    </div>
  );
}

export default Total;
