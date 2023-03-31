import { createContext } from "react";

const BalanceContext = createContext({
  balance: null,
  setBalance: () => {},
});

export default BalanceContext;
