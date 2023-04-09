import { ArchwayClient } from "@archwayhq/arch3.js/build";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import SmartContractButton from "./ArchwayQuery";
import BalanceContext from "./BalanceContext";

const RightTotalInfo = styled.div`
  border: 0.5px solid #2e2e2e;
  border-radius: 3px;
  margin: 10px 0 0 10px;
  height: (rightHeight);
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
`;
const OutputAmount = styled.div`
  color: #e4e9f0;
  font-size: 20px;
  margin: 10px;
`;

function LongShort() {
  const { balance } = useContext(BalanceContext);
  const [inputValue, setInPutValue] = useState();
  const [clickValue, setClickValue] = useState("Long");
  const [isShortClick, setIsShortClick] = useState(false);
  const [isLongClick, setIsLongClick] = useState(true);
  const [rightHeight, setRightHeight] = useState(window.innerHeight * 0.5);
  const updateRightHeight = () => {
    setRightHeight(window.innerHeight * 0.5);
  };

  //arch3.js

  const handleLongClick = () => {
    setIsShortClick(false);
    setIsLongClick(true);
  };
  const handleShortClick = () => {
    setIsShortClick(true);
    setIsLongClick(false);
  };
  const handleClickValue = (e) => {
    setClickValue(e.target.value);
  };
  const handleInputchange = (e) => {
    setInPutValue(e.target.value);
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
          {inputValue ? <div>Pay: {Math.floor(inputValue * 100) / 100} arch</div> : <div>Pay: 0.00 arch</div>}

          <div>Balance: {balance && balance.amount ? parseFloat(balance.amount / 1000000).toFixed(6) : "0.000000"}</div>
        </InputPayBalnace>
        <InputAmount type="number" placeholder="0.0" value={inputValue} onChange={handleInputchange} />
      </InputDiv>
      <OutputDiv>
        <InputPayBalnace>
          <div>{clickValue}</div>
          <div>Leverage 2x</div>
        </InputPayBalnace>
        <OutputAmount>
          {inputValue ? (
            <div>Win: {Math.floor(inputValue * 1.96 * 1000000) / 1000000} arch</div>
          ) : (
            <div>Win: 0.00 arch</div>
          )}
        </OutputAmount>
      </OutputDiv>
      <SmartContractButton />
    </RightTotalInfo>
  );
}
export default LongShort;
