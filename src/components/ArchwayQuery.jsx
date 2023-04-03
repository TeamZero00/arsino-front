import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js";

import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useState } from "react";
import styled from "styled-components";

const ExecuteBtnDiv = styled.div`
  border: 3px solid orange;
  display: flex;
  justify-content: center;
  margin: 40px 0;
`;

const ExecuteButton = styled.button`
  width: 80%;
  height: 100px;
  font-size: 20px;
  color: white;
  background-color: #f76a2d;
  &:hover {
    background-color: #ff4d00;
  }
`;

const SmartContractButton = () => {
  const [count, setCount] = useState(0);
  const network = {
    chainId: "constantine-2",
    endpoint: "https://rpc.constantine-2.archway.tech",
    prefix: "archway",
  };
  const ExecuteClick = async () => {
    try {
      const gasPrice = GasPrice.fromString("0.05uconst");
      const executeFee = calculateFee(300_000, gasPrice);
      const offlineSigner = window.getOfflineSigner(network.chainId);
      const accounts = await offlineSigner.getAccounts();
      const testClient = await SigningArchwayClient.connectWithSigner(network.endpoint, offlineSigner);
      const clientBalance = await testClient.getBalance(accounts[0].address, "uconst");

      const executeContractAddress = "archway17n9jx8prmvgd75shthmmpdg5hprx3j0xdgvxcx4kdgz8229ett7qavxcc5";
      const msg = { increment: {} };
      //   console.log(accounts[0].address.sequence);
      //   console.log(clientBalance);
      console.log(accounts[0].address.sequence);

      const { transactionHash, height } = await testClient.execute(
        accounts[0].address,
        executeContractAddress,
        msg,
        // "auto"

        executeFee
      );
      console.log(transactionHash);
      console.log(height);
      console.log("gasPrice:", gasPrice);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async () => {
    try {
      //testing

      //arch3.js
      const client = await ArchwayClient.connect("https://rpc.constantine-1.archway.tech");
      const contractAddress = "archway17n9jx8prmvgd75shthmmpdg5hprx3j0xdgvxcx4kdgz8229ett7qavxcc5";
      const msg = { get_count: {} };
      const { count } = await client.queryContractSmart(contractAddress, msg);
      setCount(count);

      //   console.log(clientBalance);
      //   console.log(client);

      //   console.log(offlineSigner);
      //   console.log(accounts[0].address);
      //   console.log(testClient);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <ExecuteBtnDiv>
        <ExecuteButton onClick={ExecuteClick}>Execute Smart Contract</ExecuteButton>
      </ExecuteBtnDiv>
      <div>
        <button onClick={handleClick}>Query Smart Contract</button>
        <div>Count: {count}</div>
      </div>
    </div>
  );
};

export default SmartContractButton;
