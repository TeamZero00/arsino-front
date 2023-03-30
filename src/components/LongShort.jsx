import { useState } from "react";
import styled from "styled-components";

const RightTotalInfo = styled.div`
  border: 3px solid gray;
  margin: 10px;
  height: 600px;
  padding: 10px;
  width: 30%;
  background-color: #16182e;
`;
const BtnTotal = styled.div`
  border: 3px solid orange;
  display: flex;
  flex: 1 1;
  margin-bottom: 15px;
`;

const LongButton = styled.button`
  font-size: 20px;
  border: none;
  width: 100%;
  padding: 8px;
  background-color: gray;
  &:hover {
    background-color: blue;
  }
`;
const ShortButton = styled.button`
  font-size: 20px;
  border: none;
  width: 100%;
  padding: 8px;
  background-color: gray;
  &:hover {
    background-color: blue;
  }
`;

const InputDiv = styled.div`
  border: 3px solid orange;
  margin-bottom: 15px;
  background-color: gray;
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
  background-color: gray;
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
  border: 3px solid orange;
  background-color: gray;
`;
const OutputAmount = styled.div`
  color: white;
  font-size: 20px;
  margin: 10px;
`;

function LongShort() {
  const [inputValue, setInPutValue] = useState();
  const handleInputchange = (e) => {
    setInPutValue(e.target.value);
  };

  return (
    <RightTotalInfo>
      <BtnTotal>
        <LongButton> Long </LongButton>
        <ShortButton> Short </ShortButton>
      </BtnTotal>
      <InputDiv>
        <InputPayBalnace>
          {inputValue ? <div>Pay: {Math.floor(inputValue * 100) / 100} arch</div> : <div>Pay: 0.00 arch</div>}

          <div>Balance: 0.0000</div>
        </InputPayBalnace>
        <InputAmount type="number" placeholder="0.0" value={inputValue} onChange={handleInputchange} />
      </InputDiv>
      <OutputDiv>
        <InputPayBalnace>
          <div>Long</div>
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
    </RightTotalInfo>
  );
}
export default LongShort;
