import { useContext, useState } from "react";
import styled from "styled-components";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import BalanceContext from "./BalanceContext";
import { FiExternalLink, FiCopy } from "react-icons/fi";

const HeaderDiv = styled.div`
  border-bottom: solid 1px gray;
  background-color: #181818;
  display: flex;
  justify-content: space-between;
  padding: 10px 50px;
`;
const LogoName = styled.div`
  font-size: 30px;
  font-weight: 700;
  color: white;
  margin-left: 15px;
  display: flex;
  align-items: center;
`;

const LeftHeaderNavi = styled.div`
  display: flex;
`;
const RightHeaderNavi = styled.div`
  display: flex;
  align-items: center;
`;
const RightWalletConnect = styled.button`
  background-color: #f76a2d;
  border: none;
  padding: 5px 10px;
  font-weight: 700;
  font-size: 20px;
  color: #e4e9f0;
  border-radius: 5px;
  &:hover {
    background-color: #ff4d00;
    cursor: pointer;
  }
`;
const RightConnectedWallet = styled.button`
  background-color: #181818;
  border: none;
  padding: 5px 10px;
  font-weight: 700;
  font-size: 20px;
  color: #e4e9f0;
  border-radius: 5px;
  &:hover {
    background-color: #2a2a2a;
    color: #ff4d00;
    cursor: pointer;
  }
`;

const ArsinoImg = styled.img`
  width: 50px;
`;

const DownBtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1 1;
`;
const CloseButton = styled.button`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  width: 45%;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 0;
  background-color: #ff4d00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2d2d2dab;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
`;
const ModalTopContentDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28px;
  font-weight: 650;
  color: #e4e9f0;
  background-color: black;
`;
const ModalTopContent = styled.button`
  padding: 20px 0;
  background-color: black;
  border: none;
  justify-content: right;
  align-items: center;
  border-radius: 5px;
  color: #e4e9f0;
  font-size: 25px;
  font-weight: 650;
  &:hover {
    color: #ff4d00;
    cursor: pointer;
  }
`;
const ModalContent = styled.div`
  justify-content: space-between;
  background-color: black;

  padding: 10px 30px;
  border-radius: 10px;
`;
const ModalMainDiv = styled.div`
  color: #a3a3a3;
  background-color: black;

  justify-content: left;
  align-items: center;
`;
const ModalMainInnerDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #777777;
  font-size: 13px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  button {
    display: flex;
    align-items: center;
    padding: 5px;
    margin-left: 10px;
    background-color: #777777;
    border: none;
    cursor: pointer;
  }
`;

function Header() {
  const { balance, setBalance } = useContext(BalanceContext);
  // connectWallet에서 받아올 값
  const [client, setClient] = useState();
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState();
  const [walletName, setWalletName] = useState();
  const [isVisible, setVisible] = useState(false);

  // connectWallet 으로 전달할 함수
  const getInfo = (client, address, returnedBalance, chainId, walletName) => {
    setClient(client);
    setAddress(address);
    setBalance(returnedBalance);
    setChainId(chainId);
    setWalletName(walletName);
  };

  const Modal = ({ onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleModal = () => {
      setIsOpen(!isOpen);
    };

    return (
      <>
        {isOpen && (
          <ModalWrapper>
            <ModalContent>
              <ModalTopContentDiv>
                {" "}
                Accounts
                <ModalTopContent onClick={toggleModal}>X</ModalTopContent>
              </ModalTopContentDiv>

              <ModalMainDiv>
                <h3>Wallet Address</h3>
                <ModalMainInnerDiv>
                  {address}
                  <button>
                    <FiCopy />
                  </button>
                </ModalMainInnerDiv>
              </ModalMainDiv>
              <DownBtnDiv>
                <CloseButton
                  onClick={() => window.open(`https://testnet.mintscan.io/archway-testnet/account/${address}`)}
                >
                  Explorer <FiExternalLink />
                </CloseButton>
                <CloseButton onClick={disconnect}>Disconnect</CloseButton>
              </DownBtnDiv>
            </ModalContent>
          </ModalWrapper>
        )}
        <RightConnectedWallet type="button" onClick={toggleModal}>
          {walletName.name}
        </RightConnectedWallet>
      </>
    );
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

          <Modal />
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
        <ArsinoImg alt="brandMark" src="src/ArchwayBrandmark.svg" />
        <LogoName>Arsino</LogoName>
      </LeftHeaderNavi>
      <RightHeaderNavi>
        <div>{renderBtn()}</div>
      </RightHeaderNavi>
    </HeaderDiv>
  );
}

export default Header;
