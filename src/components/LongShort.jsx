import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { GasPrice } from "@cosmjs/stargate";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import RealtimePosition from "./RealtimePosition";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import WalletConnectionContext from "../WalletConnectionContext";
import SmartContractButton from "./ArchwayQuery";
import BalanceContext from "./BalanceContext";
import TostContainer from "./TostContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { WalletContext } from "../App";

const RightTotalInfo = styled.div`
  border: 0.5px solid #2e2e2e;
  border-radius: 3px;
  margin: 10px 0 0 10px;
  height: ${({ rightHeight }) => rightHeight}px;
  padding: 10px;
  width: 30%;
  background-color: black;
`;
const BtnTotal = styled.div`
  border: 1px solid #2e2e2e;
  display: flex;
  flex: 1 1;

  margin-bottom: 15px;
`;

const LongButton = styled.button`
  font-size: 20px;
  border: none;
  width: 100%;
  padding: 8px;
  color: #777777;
  background-color: #181818;
  &.active {
    background-color: #ff4d00;
    color: white;
  }
  &:hover {
    background-color: #f76a2d;
    color: white;
    cursor: pointer;
  }
`;
const ShortButton = styled.button`
  font-size: 20px;
  border: none;
  width: 100%;
  padding: 8px;
  color: #777777;
  background-color: #181818;
  &:hover {
    cursor: pointer;
    background-color: #f76a2d !important;
    color: white !important;
  }
`;

const InputDiv = styled.div`
  border: 0.5px solid #2e2e2e;
  border-radius: 10px;
  margin-bottom: 15px;
  background-color: #181818;
`;
const InputPayBalnace = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: white;
  margin: 10px;
`;
const InputAmount = styled.input`
  width: 85%;
  height: 30px;
  font-size: 20px;
  background-color: #181818;
  border: none;
  color: white;
  margin-bottom: 10px;
  outline: none;
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
//
//아웃풋 박스
const OutputDiv = styled.div`
  border: 0.5px solid #2e2e2e;
  background-color: #181818;
  border-radius: 10px;
`;
const OutputAmount = styled.div`
  color: #e4e9f0;
  font-size: 20px;
  font-weight: 600;
  margin: 10px;
`;

//
// 30,50 btn
const PredictedBtn = styled.div`
  display: flex;
  justify-content: space-around;

  button {
    border-radius: 10px;
    width: 40px;
    margin-right: 5px;
    /* background-color: */
    font-size: 14px;
    font-weight: 600;
    border: none;
    &:hover {
      cursor: pointer;
      background-color: #ff621f !important;
      color: white !important;
    }
  }
`;

function LongShort({ bettingList }) {
  const { isConnected } = useContext(WalletConnectionContext);
  const { balance, setBalance } = useContext(BalanceContext);
  const { wallet } = useContext(WalletContext);
  const [inputValue, setInPutValue] = useState("");
  const [clickValue, setClickValue] = useState("Long");
  const [duration, setDuration] = useState(30);
  const [isShortClick, setIsShortClick] = useState(false);
  const [isLongClick, setIsLongClick] = useState(true);
  const [rightHeight, setRightHeight] = useState(window.innerHeight * 0.45);
  const [localGetBalance, setLocalGetBalance] = useState(0);
  const [is30Click, setIs30Click] = useState(true);
  const [is50Click, setIs50Click] = useState(false);

  const network = {
    chainId: "constantine-2",
    endpoint: "https://rpc.constantine-2.archway.tech",
    prefix: "archway",
  };

  const GetMyBalance = async () => {
    const gasPrice = GasPrice.fromString("0.01uconst");
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
    const clientBalance = await testClient.getBalance(
      accounts[0].address,
      "uconst"
    );
    setLocalGetBalance(clientBalance.amount);
  };
  useEffect(() => {
    GetMyBalance();
  }, []);

  const updateRightHeight = () => {
    setRightHeight(window.innerHeight * 0.45);
  };

  const handleLongClick = () => {
    setIsShortClick(false);
    setIsLongClick(true);
  };
  const handleShortClick = () => {
    setIsShortClick(true);
    setIsLongClick(false);
  };
  const handle50Click = () => {
    setIs30Click(false);
    setIs50Click(true);
  };
  const handle30Click = () => {
    setIs30Click(true);
    setIs50Click(false);
  };

  const handleClickValue = (e) => {
    setClickValue(e.target.value);
  };
  const handleInputchange = (e) => {
    let value = e.target.value;
    let regex = /^(\d+)?([.]?\d{0,6})?$/; // deciaml can six number
    if (parseFloat(value) < 0) {
      value = "0";
    }
    if (value.startsWith(".")) {
      value = "0" + value;
    }
    if (value === "" || regex.test(value)) {
      setInPutValue(value);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateRightHeight);

    return () => {
      window.removeEventListener("resize", updateRightHeight);
    };
  }, []);

  return (
    <RightTotalInfo>
      <BtnTotal>
        <LongButton
          className={isLongClick ? "active" : ""}
          onClick={(e) => {
            setClickValue("Long");
            handleLongClick();
          }}
        >
          Long
        </LongButton>
        <ShortButton
          onClick={(e) => {
            setClickValue("Short");
            handleShortClick();
          }}
          style={{
            backgroundColor: isShortClick ? "#ff4d00" : "#181818",
            color: isShortClick ? "white" : "#777777",
          }}
        >
          {" "}
          Short{" "}
        </ShortButton>
      </BtnTotal>
      <InputDiv>
        <InputPayBalnace>
          <PredictedBtn>
            <div>
              <button
                onClick={() => {
                  setDuration(30);
                  handle30Click();
                }}
                style={{
                  backgroundColor: is30Click ? "#ff4d00" : "#181818",
                  color: is30Click ? "white" : "#777777",
                }}
              >
                30
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  setDuration(50);
                  handle50Click();
                }}
                style={{
                  backgroundColor: is50Click ? "#ff4d00" : "#181818",
                  color: is50Click ? "white" : "#777777",
                }}
              >
                {" "}
                50
              </button>
            </div>
          </PredictedBtn>

          <div>
            {" "}
            {wallet != null
              ? `Balance: ${parseFloat(localGetBalance / 1000000).toFixed(6)}`
              : "Balance: 0"}
          </div>
        </InputPayBalnace>
        <InputAmount
          type="number"
          placeholder="0.0"
          value={inputValue}
          onChange={handleInputchange}
        />
      </InputDiv>
      <OutputDiv>
        <InputPayBalnace>
          <div>{clickValue} 1.97x</div>
          <div>
            <div>Predicted Blocks</div>
            <div>{duration}</div>
          </div>
        </InputPayBalnace>
        <OutputAmount>
          {inputValue ? (
            <div>
              Prize: {Math.floor(inputValue * 1.97 * 1000000) / 1000000} Const
            </div>
          ) : (
            <div>Prize: 0.00 Const</div>
          )}
        </OutputAmount>
      </OutputDiv>

      <SmartContractButton
        onClick={GetMyBalance()}
        betType={clickValue}
        betAmount={inputValue}
        localGetBalance={localGetBalance}
        duration={duration}
        disabled={!sessionStorage.getItem("walletConnection")}
      />
      <div>
        <RealtimePosition
          height={`${rightHeight - 195}px`}
          bettingList={bettingList}
        />
      </div>
    </RightTotalInfo>
  );
}
export default LongShort;
