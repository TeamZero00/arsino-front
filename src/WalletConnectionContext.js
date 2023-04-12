import { createContext } from "react";

const WalletConnectionContext = createContext({
  isConnected: false,
  setIsConnected: () => {},
});

export default WalletConnectionContext;
