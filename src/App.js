import "./App.css";
import { useState, createContext } from "react";

import LandingPage from "./components/LandingPage";
import { Route, Routes } from "react-router-dom";
import Total from "./Total";
import Swap from "./components/Page/Swap";

export const WalletContext = createContext();

function App({ getInfo }) {
  const [wallet, setWallet] = useState();
  return (
    <div className="App">
      <WalletContext.Provider value={{ wallet, setWallet }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/trade" element={<Total />} />
          <Route path="/bank" element={<Swap />} />
        </Routes>
      </WalletContext.Provider>
    </div>
  );
}

export default App;
