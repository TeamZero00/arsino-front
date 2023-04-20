import dotenv from "dotenv";

dotenv.config();

const config = {
  lpContract: process.env.REACT_APP_LP_CONTRACT_ADDRESS,
  gameContarct: process.env.REACT_APP_GAME_CONTRACT_ADDRESS,
  bankContract: process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
  serverEndpoint: process.env.REACT_APP_SERVER_ADDRESS,
};
console.log("config", config);

export default config;
