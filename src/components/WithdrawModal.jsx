import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { useState } from "react";
import styled from "styled-components";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const WithdrawModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #181818dd;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
`;
const WithdrawModalDiv = styled.div`
  padding: 30px;
  background-color: black;
  color: #e4e9f0;
  width: 420px;
  border-radius: 10px;
  font-size: 25px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const WithdrawModalTitle = styled.div`
  width: 100%;
  display: flex;
  margin: 0 20px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  button {
    border: none;
    background-color: black;
    color: white;
    font-size: 25px;
    font-weight: 650;
    padding: 10px;
    &:hover {
      cursor: pointer;
      color: #ff4d00;
    }
  }
`;
const WithdrawModalContent = styled.div`
  color: #f76a2d;
  padding: 10px 20px;
  border-bottom: 2px solid #ff4d00;
  div {
    font-size: 25px;
  }
`;
const WithdrawModalInputTotal = styled.div`
  display: flex;
  background-color: #181818;
  margin: 20px 10px;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #2e2e2e;
`;
const WithdrawModalInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: left;
  color: #d3d3d3;

  input {
    background-color: #181818;
    border-radius: 5px;
    width: 400px;
    height: 35px;
    outline: none;
    color: #e4e9f0;
    font-size: 25px;
    font-weight: 500;
    border: none;
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;
const WithdrawModalInputAmount = styled.div`
  display: flex;
  justify-content: left;
  font-size: 13px;
  color: #c3c3c3;
  margin-top: 10px;
`;
const WithdrawModalOutputDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 2px solid #2e2e2e;
  font-size: 13px;
`;
const WithdrawContractDiv = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    background-color: #ff4d00;
    border: none;
    color: white;
    border-radius: 10px;
    font-size: 20px;
    font-weight: 640;
    width: 80%;
    height: 50px;
    &:hover {
      cursor: pointer;
    }
    &:disabled {
      cursor: not-allowed;
      background-color: #999999;
    }
  }
`;

function WithdrawModal({
  isAccount,
  gasPrice,
  offlineSigner,
  network,
  depositIsOpen,
  setDepositIsOpen,
  isLPBalance,
  setIsLPBalance,
  isPoolBalance,
  setIsPoolBalance,
}) {
  const [isLP, setIsLP] = useState("");
  const [isTotalLP, setIsTotalLP] = useState("");
  const disabled = sessionStorage.getItem("walletConnection") != "true";

  const ClickedIsOpen = () => {
    setDepositIsOpen(false);
  };
  const inputLPBalance = (e) => {
    let value = e.target.value;
    setIsLP(value);
    console.log(isLP);
  };
  console.log(isLPBalance);

  const getTotalLPBalance = async () => {
    const client = await ArchwayClient.connect(network.endpoint);
    const getLPTotalSupply = async () => {
      try {
        const getTotalMsg = {
          total_supply: {},
        };
        const totalResult = await client.queryContractSmart(process.env.REACT_APP_LP_CONTRACT_ADDRESS, getTotalMsg);

        setIsTotalLP(totalResult);
        console.log("getTotal", isTotalLP);
        return totalResult;
      } catch (err) {
        console.log(err);
      }
    };
    getLPTotalSupply();
  };
  getTotalLPBalance();
  console.log("total LP", isTotalLP);
  console.log("isAccount", isAccount);
  console.log("netwrok", offlineSigner);

  const withdrawContract = async () => {
    const signer = await SigningCosmWasmClient.connectWithSigner(network.endpoint, offlineSigner, {
      gasPrice,
      prefix: network.prefix,
    });

    try {
      const allowanceMsg = {
        increase_allowance: {
          spender: process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
          amount: (isLP * 1000000).toString(),
          // not defined. what is this data????????????????????????????????????????????
          //   expires: {
          //     at_height: expires,
          //   },
        },
      };
      const withdrawMsg = {
        withdraw: {},
      };
      const messages = [
        {
          contractAddress: process.env.REACT_APP_LP_CONTRACT_ADDRESS,
          msg: allowanceMsg,
        },
        {
          contractAddress: process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
          msg: withdrawMsg,
        },
      ];

      // const allowanceResult = await signer.execute(
      //   isAccount,
      //   process.env.REACT_APP_LP_CONTRACT_ADDRESS,
      //   allowanceMsg,
      //   "auto",
      //   undefined
      // );
      // console.log(allowanceResult);

      // // Execute withdraw transaction
      // const withdrawResult = await signer.execute(
      //   isAccount,
      //   process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
      //   withdrawMsg,
      //   "auto",
      //   undefined
      // );
      // console.log(withdrawResult);
      const executeMulti = await signer.executeMultiple(isAccount, messages, "auto", undefined);
      console.log(executeMulti);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <WithdrawModalWrapper>
      <WithdrawModalDiv>
        <WithdrawModalTitle>
          AMG (LP)<button onClick={ClickedIsOpen}>X</button>
        </WithdrawModalTitle>
        <div>
          <WithdrawModalContent>
            <div>Withdraw</div>
          </WithdrawModalContent>
        </div>
        <WithdrawModalInputTotal>
          <WithdrawModalInputDiv>
            <input type="number" placeholder="0.0" value={isLP} onChange={inputLPBalance}></input>
            <WithdrawModalInputAmount>
              LP balance: {isLPBalance != null ? isLPBalance / 1000000 : "0"}
            </WithdrawModalInputAmount>
          </WithdrawModalInputDiv>
        </WithdrawModalInputTotal>
        <WithdrawModalOutputDiv>
          <div>receive CONST</div>
          <div>{isLP ? ((isLP / isTotalLP) * isPoolBalance * 1000000).toFixed(6) : "0"}</div>
        </WithdrawModalOutputDiv>
        <WithdrawContractDiv>
          <button onClick={withdrawContract} disabled={disabled}>
            {!disabled ? "Enter" : "Connect Wallet"}
          </button>
        </WithdrawContractDiv>
      </WithdrawModalDiv>
    </WithdrawModalWrapper>
  );
}
export default WithdrawModal;
