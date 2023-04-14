import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js";
import dotenv from "dotenv";
import BalanceContext from "./BalanceContext";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useState } from "react";
import styled from "styled-components";
import { useContext } from "react";
import { useEffect } from "react";

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

const SmartContractButton = ({ betAmount, betType: positionType, localGetBalance, disabled }) => {
  const { setBalance } = useContext(BalanceContext);
  const [count, setCount] = useState(0);
  const executeBalance = localGetBalance;
  const [afterBalance, setAfterBalance] = useState(0);

  const network = {
    chainId: "constantine-2",
    endpoint: "https://rpc.constantine-2.archway.tech",
    prefix: "archway",
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
      const testClient = await SigningArchwayClient.connectWithSigner(network.endpoint, offlineSigner, {
        gasPrice,
        prefix: network.prefix,
      });
      const clientBalance = await testClient.getBalance(accounts[0].address, "uconst");
      const duration = 50;
      const position = positionType.toLowerCase();

      const bettingAmount = betAmount;
      console.log(testClient);
      console.log(executeBalance);
      console.log(position);
      console.log(disabled);
      const executeContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
      const msg = {
        betting: {
          position,
          duration,
        },
      };

      console.log("hi CA :", process.env.REACT_APP_CONTRACT_ADDRESS);
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
      const updatedClientBalance = await testClient.getBalance(accounts[0].address, "uconst");
      setBalance(updatedClientBalance);
      updateAfterBalance();

      console.log(executeFee);
      console.log(transactionHash);
      console.log(height);
      console.log(logs);
      console.log(updatedClientBalance);
      console.log("gasPrice:", gasPrice);
    } catch (err) {
      console.error(err);
    }
  };
  const updateAfterBalance = async () => {
    setAfterBalance(afterBalance);
  };

  return (
    <div>
      <ExecuteBtnDiv>
        <ExecuteButton disabled={disabled} onClick={ExecuteClick}>
          {!disabled ? "Execute Smart Contract" : "Connected Wallet"}
          {/* Execute Smart Contract */}
        </ExecuteButton>
      </ExecuteBtnDiv>
    </div>
  );
};

export default SmartContractButton;
