import { useState } from "react";
import styled from "styled-components";
import connectWallet from "../wallet/connectWallet";

const HeaderDiv = styled.div`
  border: solid 5px orange;
  display: flex;

  justify-content: space-between;
  padding: 0 50px;
`;

const LeftHeaderNavi = styled.div`
  display: flex;
`;
const RightHeaderNavi = styled.div`
  display: flex;
  align-items: center;
`;

const ArsinoImg = styled.img`
  height: 100%;
`;

function Header() {
  return (
    <HeaderDiv>
      <LeftHeaderNavi>
        <ArsinoImg alt="brandMark" src="src/arsinoMark.png" />
      </LeftHeaderNavi>
      <RightHeaderNavi>
        <button onClick={connectWallet}>버튼</button>
      </RightHeaderNavi>
    </HeaderDiv>
  );
}
export default Header;
