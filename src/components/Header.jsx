import { useContext, useState } from "react";
import styled from "styled-components";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import BalanceContext from "./BalanceContext";

const HeaderDiv = styled.div`
  border-bottom: solid 1px gray;
  background-color: #181818;
  display: flex;
  justify-content: space-between;
  padding: 10px 50px;
`;

const LeftHeaderNavi = styled.div`
  display: flex;
`;
const RightHeaderNavi = styled.div`
  display: flex;
  align-items: center;
`;
const RightWalletConnect = styled.button`
  background-color: #16182e;
  font-size: 20px;
  color: #e4e9f0;
`;

const ArsinoImg = styled.img`
  height: 100%;
`;

function Header() {
  const { balance, setBalance } = useContext(BalanceContext);
  // connectWallet에서 받아올 값
  const [client, setClient] = useState();
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState();
  const [isVisible, setVisible] = useState(false);

  // connectWallet 으로 전달할 함수
  const getInfo = (client, address, returnedBalance, chainId) => {
    setClient(client);
    setAddress(address);
    setBalance(returnedBalance);
    setChainId(chainId);
  };

  // connectWallet으로 가져온 정보를 초기화
  const disconnect = (event) => {
    setClient();
    setChainId();
    setAddress();
    setBalance();
  };
  const disBtnClick = () => {
    setVisible(!isVisible);
  };
  // 네트워크 별로 chainId에 따라서 DISCONNECT와 CONNECT 버튼이 나타나도록 구현
  const renderBtn = () => {
    return Object.keys(networkInfo).map((id) => {
      if (chainId === id) {
        return (
          // <RightWalletConnect type="button" onClick={(event) => disconnect(event)}>

          <RightWalletConnect type="button" onClick={disBtnClick}>
            {address.slice(0, 4) + "...." + address.slice(-6)}
          </RightWalletConnect>
        );
      }
      return (
        <RightWalletConnect
          type="button"
          onClick={(event) => connectWallet(event, networkInfo[id], { getInfo })}
          className="connect-btn"
        >
          Connect Wallet
        </RightWalletConnect>
      );
    });
  };
  return (
    <HeaderDiv>
      <LeftHeaderNavi>
        <ArsinoImg alt="brandMark" src="src/arsinoMark.png" />
      </LeftHeaderNavi>
      <RightHeaderNavi>
        <div>{renderBtn()}</div>
      </RightHeaderNavi>
    </HeaderDiv>
  );
}
export default Header;
