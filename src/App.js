import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import { useState } from "react";
import BalanceContext from "./components/BalanceContext";

function App() {
  const [balance, setBalance] = useState(null);
  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      <div className="App">
        <Header />
        <InfoChart />

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div></div>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </BalanceContext.Provider>
  );
}

export default App;
