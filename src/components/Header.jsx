/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import BalanceContext from "./BalanceContext";
import { FiExternalLink, FiCopy } from "react-icons/fi";
import { Link, Route, useLocation } from "react-router-dom";
import { WalletContext } from "../App";
import dotenv from "dotenv";
import Swap from "./Page/Swap";
import WalletConnectionContext from "../WalletConnectionContext";
dotenv.config();

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
const LeftHeaderLink = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 640;
  margin-left: 5px;

  a {
    border-radius: 10px;
    padding: 3px 10px;
    color: white;
    &:hover {
      background-color: #2e2e2e;
      color: #ff4d00;
    }
  }
`;
const RightHeaderNavi = styled.div`
  display: flex;
  align-items: center;
`;
const RightWalletConnect = styled.button`
  background-color: #f76a2d;
  border: none;
  padding: 10px 25px;
  font-weight: 700;
  font-size: 15px;
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
  font-size: 18px;
  color: #e4e9f0;
  border-radius: 5px;
  &:hover {
    background-color: #2a2a2a;
    color: #ff4d00;
    cursor: pointer;
  }
`;

const TradeLinkBtn = styled.div`
  background-color: green;
  font-size: 18px;
`;

const ArsinoImg = styled.img`
  height: 40px;
  padding: 10px;
  margin-right: 20px;
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

const FaucetBtn = styled.button`
  border: none;
  padding: 10px 15px;
  font-size: 15px;
  font-weight: 600;
  background-color: #ff4d00;
  margin-right: 10px;
  border-radius: 5px;
  color: white;
  &:hover {
    cursor: pointer;
  }
`;
function Header() {
  const { balance, setBalance } = useContext(BalanceContext);
  const { wallet, setWallet } = useContext(WalletContext);

  // connectWallet에서 받아올 값
  const [client, setClient] = useState();
  const [address, setAddress] = useState();
  const [chainId, setChainId] = useState();
  const [walletName, setWalletName] = useState();
  const [isVisible, setVisible] = useState(false);
  const { isConnected, setIsConnected } = useContext(WalletConnectionContext);
  const [isTradeClicked, setIsTradeClicked] = useState(false);
  const [isBankClicked, setIsBankClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const TradeLinkClicked = () => {
    setIsTradeClicked(true);
    setIsBankClicked(false);
  };
  const BankLinkClicked = () => {
    setIsTradeClicked(false);
    setIsBankClicked(true);
  };
  useEffect(() => {
    if (location.pathname === "/trade") {
      setIsTradeClicked(true);
      setIsBankClicked(false);
    } else if (location.pathname === "/bank") {
      setIsTradeClicked(false);
      setIsBankClicked(true);
    }
  }, [location]);
  // connectWallet 으로 전달할 함수
  const getInfo = (client, address, returnedBalance, chainId, walletName) => {
    setClient(client);
    setAddress(address);
    setBalance(returnedBalance);
    setChainId(chainId);
    setWalletName(walletName);
    sessionStorage.setItem("client", JSON.stringify(client));
    sessionStorage.setItem("address", address);
    sessionStorage.setItem("balance", JSON.stringify(returnedBalance));
    sessionStorage.setItem("chainId", chainId);
    sessionStorage.setItem("walletName", JSON.stringify(walletName));
    sessionStorage.setItem("walletConnection", true);
  };
  useEffect(() => {
    const savedClient = JSON.parse(sessionStorage.getItem("client"));
    const savedAddress = sessionStorage.getItem("address");
    const savedBalance = JSON.parse(sessionStorage.getItem("balance"));
    const savedChainId = sessionStorage.getItem("chainId");
    const savedWalletName = JSON.parse(sessionStorage.getItem("walletName"));

    if (savedClient && savedAddress && savedBalance && savedChainId && savedWalletName) {
      setClient(savedClient);
      setAddress(savedAddress);
      setBalance(savedBalance);
      setChainId(savedChainId);
      setWalletName(savedWalletName);
    }
  }, []);

  const Modal = ({ onClick }) => {
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
    setWallet(null);

    setClient();
    setChainId();
    setAddress();
    setBalance();
    setIsConnected(false);
    sessionStorage.removeItem("client");
    sessionStorage.removeItem("address");
    sessionStorage.removeItem("balance");
    sessionStorage.removeItem("chainId");
    sessionStorage.removeItem("walletName");
    sessionStorage.removeItem("walletConnection");
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
          onClick={async (event) => {
            const { name, signer, balance } = await connectWallet(event, networkInfo[id], { getInfo });
            console.log("name", name, signer, balance);
            setWallet({
              name,
              balance,
              signer,
            });
          }}
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
        <ArsinoImg alt="brandMark" src="src/HeaderBrandMark.svg" />
        <LeftHeaderLink>
          <Link
            to={"/trade"}
            style={{
              textDecoration: "none",
              color: isTradeClicked ? "#ff4d00" : "none",
            }}
            onClick={TradeLinkClicked}
          >
            Trade
          </Link>
        </LeftHeaderLink>
        <LeftHeaderLink>
          <Link
            to={"/bank"}
            style={{
              textDecoration: "none",
              color: isBankClicked ? "#ff4d00" : "none",
            }}
            onClick={BankLinkClicked}
          >
            Bank
          </Link>
        </LeftHeaderLink>
      </LeftHeaderNavi>

      <RightHeaderNavi>
        <FaucetBtn onClick={() => window.open(process.env.REACT_APP_FAUCET_URL)}>Faucet</FaucetBtn>
        <div>{renderBtn()}</div>
      </RightHeaderNavi>
    </HeaderDiv>
  );
}

export default Header;
