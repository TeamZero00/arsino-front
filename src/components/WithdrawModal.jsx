import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { useContext, useMemo, useState } from "react";
import styled from "styled-components";

import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TostContainer from "./TostContainer";
import axios from "axios";

import config from "../config";
import { WalletContext } from "../App";
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
  poolBalance,
  setIsPoolBalance,
  userBalance,
  lpBalance,
}) {
  const { wallet } = useContext(WalletContext);
  const [amount, setAmount] = useState("");
  const [myBalance, setMyBalance] = useState(userBalance);
  const ClickedIsOpen = () => {
    setDepositIsOpen(false);
  };

  const memoizedHandAmount = useMemo(
    () => (event) => {
      setAmount(event.target.value);
      setMyBalance(myBalance - event.target.value);
    },
    [amount]
  );

  const withdrawContract = async () => {
    const signer = await SigningCosmWasmClient.connectWithSigner(
      network.endpoint,
      offlineSigner,
      {
        gasPrice,
        prefix: network.prefix,
      }
    );
    // const { amount } = await signer.getBalance(
    //   wallet.name.bech32Address,
    //   "uconst"
    // );
    try {
      console.log(amount, lpBalance, userBalance);
      const decimalAmount = Number(amount) * 1000000;
      const decimalUserBalance = Number(userBalance) * 1000000;
      console.log((decimalAmount / decimalUserBalance) * lpBalance);
      console.log("lpBalance", lpBalance);
      const withdrawLp = (decimalAmount / decimalUserBalance) * lpBalance;
      console.log(withdrawLp);
      const allowanceMsg = {
        increase_allowance: {
          spender: process.env.REACT_APP_BANK_CONTRACT_ADDRESS,
          amount: withdrawLp.toString(),
          // not defined. what is this data???????????????????????????????????????????? 0.892007
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

      const { transactionHash, executeMulti } = await signer.executeMultiple(
        isAccount,
        messages,
        "auto",
        undefined
      );
      const balance2 = await signer.getBalance(
        wallet.name.bech32Address,
        "uconst"
      );
      console.log(amount, balance2.amount);
      console.log(Number(amount) - Number(balance2.amount));
      await axios.post(`${config.serverEndpoint}/withdraw`, {
        address: wallet.name.bech32Address,
        amount: Number(amount) - Number(balance2.amount),
      });
      toast.success(`Tx Hash ${transactionHash}`);
    } catch (err) {
      console.log(err);
      toast.error(`error ${err}`);
    }
  };
  return (
    <WithdrawModalWrapper>
      <WithdrawModalDiv>
        <WithdrawModalTitle>
          CONST<button onClick={ClickedIsOpen}>X</button>
        </WithdrawModalTitle>
        <div>
          <WithdrawModalContent>
            <div>Withdraw</div>
          </WithdrawModalContent>
        </div>
        <WithdrawModalInputTotal>
          <WithdrawModalInputDiv>
            <input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={memoizedHandAmount}
            ></input>
            <WithdrawModalInputAmount>
              {/* LP balance: {isLPBalance != null ? isLPBalance / 1000000 : "0"} */}
            </WithdrawModalInputAmount>
          </WithdrawModalInputDiv>
        </WithdrawModalInputTotal>
        <WithdrawModalOutputDiv>
          <div>Remain Balance</div>
          <div>{myBalance}</div>
        </WithdrawModalOutputDiv>
        <WithdrawContractDiv>
          <button onClick={withdrawContract}>Withdraw</button>
        </WithdrawContractDiv>
      </WithdrawModalDiv>
      <TostContainer />
    </WithdrawModalWrapper>
  );
}
export default WithdrawModal;
