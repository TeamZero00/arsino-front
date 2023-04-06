import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import { useState, useEffect } from "react";
import BalanceContext from "./components/BalanceContext";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import connectWallet from "./wallet/connect";
import SmartContractButton from "./components/ArchwayQuery";

function App({ getInfo }) {
  const [balance, setBalance] = useState(null);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <div className="App">
        <Header />
        <InfoChart />
      </div>
    </BalanceContext.Provider>
  );
}

export default App;
