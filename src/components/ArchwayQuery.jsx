import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js";
import dotenv from "dotenv";
import BalanceContext from "./BalanceContext";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useState } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { useEffect } from "react";
import config from "../config";
import TostContainer from "./TostContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContext } from "../App";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";

dotenv.config();

const ExecuteBtnDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
`;

const ExecuteButton = styled.button`
  width: 100%;
  height: 70px;
  border: none;
  font-size: 20px;
  font-weight: 600;
  border-radius: 10px;
  color: white;
  background-color: #f76a2d;
  &:hover {
    background-color: #ff4d00;
    cursor: pointer;
  }
`;

const SmartContractButton = ({
  betAmount,
  betType: positionType,
  localGetBalance,
  duration,
  disabled,
}) => {
  const { setBalance } = useContext(BalanceContext);
  const { wallet, setWallet } = useContext(WalletContext);
  const executeBalance = localGetBalance;
  const [afterBalance, setAfterBalance] = useState(0);
  const [isLogs, setIsLogs] = useState(null);
  const [isTxHash, setIsTxHash] = useState(null);

  const network = {
    chainId: "constantine-2",
    endpoint: "https://rpc.constantine-2.archway.tech",
    prefix: "archway",
  };
  const showToast = () => {};

  const errToast = () => {
    toast.error("error, check something");
  };

  const ExecuteClick = async () => {
    if (!betAmount || betAmount <= "0") {
      alert("you need change the pay");
      return;
    }
    try {
      const gasPrice = GasPrice.fromString("0.01uconst");
      const executeFee = calculateFee(700_000, gasPrice);
      const offlineSigner = window.getOfflineSigner(network.chainId, gasPrice);
      const accounts = await offlineSigner.getAccounts();
      const testClient = await SigningArchwayClient.connectWithSigner(
        network.endpoint,
        offlineSigner,
        {
          gasPrice,
          prefix: network.prefix,
        }
      );

      const position = positionType.toLowerCase();

      const bettingAmount = betAmount;
      const executeContractAddress = config.gameContarct;
      const msg = {
        betting: {
          position,
          duration,
        },
      };

      const { transactionHash, height, logs } = await testClient.execute(
        accounts[0].address,
        executeContractAddress,
        msg,
        // "auto",
        executeFee,
        undefined,
        [
          {
            amount: (bettingAmount * 1000000).toString(),
            denom: "uconst",
          },
        ]
      );
      const updatedClientBalance = await testClient.getBalance(
        accounts[0].address,
        "uconst"
      );
      setBalance(updatedClientBalance);
      updateAfterBalance();

      console.log(executeFee);
      console.log(transactionHash);
      console.log(height);
      console.log(logs[0].events[5].attributes);
      setIsLogs(logs);
      setIsTxHash(transactionHash);
      console.log(updatedClientBalance);
      console.log("gasPrice:", gasPrice);
      toast.success(`Tx Hash ${transactionHash}`);
    } catch (err) {
      console.error(err);
      toast.error(`${err}`);
    }
  };
  const updateAfterBalance = async () => {
    setAfterBalance(afterBalance);
  };

  return (
    <div>
      <ExecuteBtnDiv>
        <ExecuteButton
          onClick={async () => {
            if (!wallet) {
              const { name, signer, balance } = await connectWallet(
                networkInfo
              );

              setWallet({
                name,
                balance,
                signer,
              });
            } else {
              ExecuteClick();
            }
          }}
        >
          {wallet ? "Play BET" : "Connected Wallet"}
        </ExecuteButton>
      </ExecuteBtnDiv>
      <TostContainer />
    </div>
  );
};

export default SmartContractButton;
