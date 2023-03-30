import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import InfoChart from "./components/InfoChart";
import LongShort from "./components/LongShort";

function App() {
  return (
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
  );
}

export default App;
