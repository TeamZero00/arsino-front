import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { useContext, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import TostContainer from "./TostContainer";
import styled from "styled-components";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { WalletContext } from "../App";
import config from "../config";

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
  const { myBalance, setDepositIsOpen, network, gasPrice, offlineSigner, isAccount } = props;

  const [amount, setAmount] = useState("");
  const [isReceiveLP, setIsReceiveLP] = useState("0");
  const [getTotalLP, isGetTotalLp] = useState("0");
  const { wallet } = useContext(WalletContext);
  const memoizedHandAmount = useMemo(
    () => (event) => {
      setAmount(event.target.value);
    },
    [amount]
  );
  const ClickedIsOpen = () => {
    setDepositIsOpen(false);
  };

  const getReceiveLp = async () => {
    const client = await ArchwayClient.connect(network.endpoint);
    const getLPTotalSupply = async () => {
      try {
        const getTotalMsg = {
          total_supply: {},
        };
        const getPoolMsg = {
          get_pool: {},
        };
        const bankContract = process.env.REACT_APP_BANK_CONTRACT_ADDRESS;
        const totalSupply = await client.queryContractSmart(process.env.REACT_APP_LP_CONTRACT_ADDRESS, getTotalMsg);
        const { balance } = await client.queryContractSmart(bankContract, getPoolMsg);
        setIsReceiveLP(balance);
        isGetTotalLp(totalSupply);
      } catch (err) {
        console.log(err);
      }
    };
    getLPTotalSupply();
  };
  getReceiveLp();

  const depositContract = async () => {
    const signer = await SigningArchwayClient.connectWithSigner(network.endpoint, offlineSigner, {
      gasPrice,
      prefix: network.prefix,
    });
    const executeContract = process.env.REACT_APP_BANK_CONTRACT_ADDRESS;
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
            amount: (amount * 1000000).toString(),
          },
        ]
      );

      await getReceiveLp();
      setIsReceiveLP(isReceiveLP);

      toast.success(`Tx Hash ${transactionHash}`);

      const respose = await axios.post(`${config.serverEndpoint}/deposit`, {
        address: wallet.name.bech32Address,
        amount: (amount * 1000000).toString(),
      });

      return {
        height,
        transactionHash,
        gasUsed,
        logs,
      };
    } catch (err) {
      console.log(err);
      toast.error(`error ${err}`);
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
            <input type="number" placeholder="0.0" value={amount} onChange={memoizedHandAmount} />
            <DepositModalInputAmount>balance: {wallet ? wallet.balance.amount / 1000000 : "0"}</DepositModalInputAmount>
          </DepositModalInputDiv>
        </DepositModalInputTotal>
        <DepositModalOutputDiv>
          <div>receive LP</div>
          <div>{amount ? ((amount / isReceiveLP) * getTotalLP).toFixed(6) : "0"} Token</div>
        </DepositModalOutputDiv>
        <DepositContractDiv>
          <button onClick={depositContract}>Deposit</button>
        </DepositContractDiv>
      </DepositModalDiv>
      <TostContainer />
    </DepositModalWrapper>
  );
}
export default DepositModal;
