import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import { useState, useEffect } from "react";
import BalanceContext from "./components/BalanceContext";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import connectWallet from "./wallet/connect";
import SmartContractButton from "./components/ArchwayQuery";
import LandingPage from "./components/LandingPage";
import { Route, Routes } from "react-router-dom";
import Total from "./Total";

function App({ getInfo }) {
  const [balance, setBalance] = useState(null);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <div className="App">
        {/* <LandingPage />
        <Header />
        <InfoChart /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade" element={<Total />} />
        </Routes>
      </div>
    </BalanceContext.Provider>
  );
}

export default App;
