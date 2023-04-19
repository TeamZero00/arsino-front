import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { useState } from "react";
import styled from "styled-components";

const DepositModalWrapper = styled.div`
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
const DepositModalDiv = styled.div`
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
const DepositModalTitle = styled.div`
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
const DepositModalContent = styled.div`
  color: #f76a2d;
  padding: 10px 20px;
  border-bottom: 2px solid #ff4d00;
  div {
    font-size: 25px;
  }
`;
const DepositModalInputTotal = styled.div`
  display: flex;
  background-color: #181818;
  margin: 20px 10px;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #2e2e2e;
`;
const DepositModalInputDiv = styled.div`
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
const DepositModalInputAmount = styled.div`
  display: flex;
  justify-content: left;
  font-size: 13px;
  color: #c3c3c3;
  margin-top: 10px;
`;
const DepositModalOutputDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 2px solid #2e2e2e;
  font-size: 13px;
`;
const DepositContractDiv = styled.div`
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
      background-color: #999999;
      cursor: not-allowed;
    }
  }
`;

function DepositModal(props) {
  const {
    myBalance,
    isMyBalance,
    depositIsOpen,
    setDepositIsOpen,
    network,
    gasPrice,
    setGasPrice,
    offlineSigner,
    setOfflineSigner,
    isAccount,
    setIsAccount,
    isPoolBalance,
    setIsPoolBalance,
  } = props;
  const [handleInputAmount, setHandleInputAmount] = useState("");
  const [isReceiveLP, setIsReceiveLP] = useState("0");
  const [getTotalLP, isGetTotalLp] = useState("0");
  const disabled = sessionStorage.getItem("walletConnection") != "true";

  const ClickedIsOpen = () => {
    setDepositIsOpen(false);
  };
  const handleInput = (e) => {
    setHandleInputAmount(e.target.value);
    console.log(e.target.value);
    console.log("input amount", handleInputAmount);
  };

  const getReceiveLp = async () => {
    const client = await ArchwayClient.connect(network.endpoint);
    const getLPTotalSupply = async () => {
      try {
        const getTotalMsg = {
          total_supply: {},
        };
        const totalResult = await client.queryContractSmart(process.env.REACT_APP_LPCONTRACT_ADDRESS, getTotalMsg);

        isGetTotalLp(totalResult);
        console.log("getTotalSupply", getTotalLP);
        return totalResult;
      } catch (err) {
        console.log(err);
      }
    };
    getLPTotalSupply();

    const getPoolMsg = {
      get_pool: {},
    };
    try {
      const bankContract = process.env.REACT_APP_BANKCONTRACT_ADDRESS;
      const result = await client.queryContractSmart(bankContract, getPoolMsg);
      setIsReceiveLP(result.balance);
      console.log("get Pool Balance", isReceiveLP);
    } catch (err) {
      console.log(err);
    }
  };
  getReceiveLp();

  const depositContract = async () => {
    const signer = await SigningArchwayClient.connectWithSigner(network.endpoint, offlineSigner, {
      gasPrice,
      prefix: network.prefix,
    });
    const executeContract = process.env.REACT_APP_BANKCONTRACT_ADDRESS;
    try {
      const msg = {
        deposit: {},
      };
      const { height, transactionHash, gasUsed, logs } = await signer.execute(
        isAccount,
        executeContract,
        msg,
        "auto",
        undefined,
        [
          {
            denom: "uconst",
            amount: handleInputAmount,
          },
        ]
      );

      console.log(height);
      console.log(transactionHash);
      console.log(logs);
      await getReceiveLp();
      setIsReceiveLP(isReceiveLP);
      console.log("isReceiveLP", isPoolBalance);
      console.log("isAccount", isAccount);
      console.log("myBalance", myBalance);
      return {
        height,
        transactionHash,
        gasUsed,
        logs,
      };
    } catch (err) {
      console.log("deposit error");
      console.log(err);
    }
  };

  return (
    <DepositModalWrapper>
      <DepositModalDiv>
        <DepositModalTitle>
          CONST<button onClick={ClickedIsOpen}>X</button>
        </DepositModalTitle>
        <div>
          <DepositModalContent>
            <div>Deposit</div>
          </DepositModalContent>
        </div>
        <DepositModalInputTotal>
          <DepositModalInputDiv>
            <input type="number" placeholder="0.0" value={handleInputAmount} onChange={handleInput} />
            <DepositModalInputAmount>
              balance: {sessionStorage.getItem("walletConnection") != null ? myBalance : "0"}
            </DepositModalInputAmount>
          </DepositModalInputDiv>
        </DepositModalInputTotal>
        <DepositModalOutputDiv>
          <div>receive LP</div>
          <div>{handleInputAmount ? (handleInputAmount / isReceiveLP) * getTotalLP : "0"} Token</div>
        </DepositModalOutputDiv>
        <DepositContractDiv>
          <button onClick={depositContract} disabled={disabled}>
            {!disabled ? "Enter" : "Connect Wallet"}
          </button>
        </DepositContractDiv>
      </DepositModalDiv>
    </DepositModalWrapper>
  );
}
export default DepositModal;
