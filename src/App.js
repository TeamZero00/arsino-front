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

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <div className="App">
        {/* <LandingPage />
        <Header />
        <InfoChart /> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade" element={<Total />} />
          <Route path="/swap" element={<Swap />} />
        </Routes>
      </div>
    </BalanceContext.Provider>
  );
}

export default App;
