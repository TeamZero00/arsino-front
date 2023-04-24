import { ArchwayClient, SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { GasPrice } from "@cosmjs/stargate";
import { useEffect } from "react";

import { useContext, useState } from "react";
import styled from "styled-components";

import DepositModal from "../components/DepositModal";
import Header from "../components/Header";
import WithdrawModal from "../components/WithdrawModal";
import "react-toastify/dist/ReactToastify.css";

import config from "../config";
import { WalletContext } from "../App";
import connectWallet from "../wallet/connect";
import networkInfo from "../wallet/network_info";
import axios from "axios";

const BankWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e4e9f0;
  margin: 20px;
  flex-direction: column;
`;
const BankWrapperHeader = styled.div`
  border: 1px solid #2e2e2e;
  background-color: #181818;
  width: 550px;
  margin: 30px;
  border-radius: 5px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 25px;
  font-weight: 700;
`;
const BankWrapperInfos = styled.div`
  padding-top: 20px;
  font-size: 15px;
  color: #777777;
  font-weight: 700;
  display: flex;
  flex-direction: column;

  align-items: center;
  button {
    margin: 20px 0;
    background-color: #f76a2d;
    border-radius: 7px;
    width: 15%;
    border: none;
    height: 30px;
    color: white;

    &:hover {
      background-color: #ff4d00;
      cursor: pointer;
    }
  }
`;
const BankWrapperRewards = styled.div`
  font-size: 40px;
  color: white;
`;
const BankTotalPool = styled.div`
  background-color: #181818;
  padding: 20px 0;
  margin-top: -20px;
  border: 1px solid #2e2e2e;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 550px;
`;
const BankTotalPoolDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
`;
const BankTotalPoolInner = styled.div`
  font-size: 15px;
  color: #777777;
  font-weight: 600;
  display: flex;
  flex-direction: column;
`;
const BankTotalPoolData = styled.div`
  font-size: 20px;
  margin-top: 20px;
  color: white;
`;

const BankWrapperSupply = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 10px 0;
  margin-top: 70px;

  border-radius: 3px;
  width: 550px;
  button {
    background-color: black;
    width: 550px;
    font-size: 15px;
    font-weight: 700;
    height: 50px;
    color: white;
    border: none;
    &:hover {
      cursor: pointer;
    }
  }
`;

// deposit or withdraw click Div
const DepositDiv = styled.div`
  border-radius: 5px;
  width: 550px;
  margin-bottom: 20px;
`;
const DepositWrapper = styled.div`
  border: 1px solid #2e2e2e;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DepositTitle = styled.div`
  background-color: #181818;
  font-size: 18px;
  padding: 10px 0;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  height: 8px;
`;
const DepositAsset = styled.div`
  margin-top: 10px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    border: none;
    background-color: #f76a2d;
    border-radius: 5px;
    color: white;
    &:hover {
      background-color: #ff4d00;
      cursor: pointer;
    }
  }
`;
const DepositAssetInner = styled.div`
  width: 50%;
  font-size: 17px;
  font-weight: 600;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// end Deposit
// withdraw
const WithdrawDiv = styled.div`
  border-radius: 5px;
  width: 50%;
  margin-bottom: 20px;
`;
const WithdrawWrapper = styled.div`
  border: 1px solid #2e2e2e;
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const WithdrawTitle = styled.div`
  background-color: #181818;
  font-size: 18px;
  padding: 10px 0;
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  height: 8px;
`;
const WithdrawAsset = styled.div`
  margin-top: 10px;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    border: none;
    background-color: #f76a2d;
    border-radius: 5px;
    color: white;
    &:hover {
      background-color: #ff4d00;
      cursor: pointer;
    }
  }
`;
const WithdrawAssetInner = styled.div`
  width: 50%;
  font-size: 17px;
  font-weight: 600;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WalletConnect = styled.button`
  background-color: #ff4d00;
  border: none;
  margin-top: 50px;
  padding: 10px 25px;
  font-weight: 700;
  font-size: 15px;
  color: #e4e9f0;
  border-radius: 5px;
  &:hover {
    background-color: #f76a2d;
    cursor: pointer;
  }
`;

async function testnetInfo() {
  const gasPrice = GasPrice.fromString("0.01uconst");
  const offlineSigner = window.getOfflineSigner("constantine-2", gasPrice);

  const accounts = await offlineSigner.getAccounts();
  const testClient = await SigningArchwayClient.connectWithSigner(
    "https://rpc.constantine-2.archway.tech",
    offlineSigner,
    {
      gasPrice,
      prefix: "archway",
    }
  );
  const clientBalance = await testClient.getBalance(
    accounts[0].address,
    "uconst"
  );
}
testnetInfo();

function Bank({ pool }) {
  const [lpBalance, setLpBalance] = useState("0");
  const [poolBalance, setPoolBalance] = useState("0");
  const [lpTotalSupply, setLpTotalSupply] = useState("0");
  const [userBalance, setUserBalance] = useState("Loading..");
  const { wallet, setWallet } = useContext(WalletContext);
  const [reward, setReward] = useState("Loading..");
  const [clickDeposit, setClickDeposit] = useState(true);
  const [clickWithdraw, setClickWithdraw] = useState(false);
  const [depositIsOpen, setDepositIsOpen] = useState(false);
  const [isPoolBalance, setIsPoolBalance] = useState("");
  const [myBalance, isMyBalance] = useState("");
  const [myAddress, setMyAddress] = useState("");
  // const [isLPBalance, setIsLPBalance] = useState("");
  const [handleInputAmount, setHandleInputAmount] = useState("");

  const [gasPrice, setGasPrice] = useState(null);
  const [offlineSigner, setOfflineSigner] = useState(null);
  const [isAccount, setIsAccount] = useState(null);
  const network = {
    chainId: "constantine-2",
    endpoint: "https://rpc.constantine-2.archway.tech",
    prefix: "archway",
  };

  const ClickedIsOpen = () => {
    console.log(depositIsOpen);
    setDepositIsOpen(!depositIsOpen);
    console.log(depositIsOpen);
  };
  const ClickedDeposit = (event) => {
    setClickDeposit(true);
    setClickWithdraw(false);
  };
  const ClickedWithdraw = (event) => {
    setClickDeposit(false);
    setClickWithdraw(true);
  };
  const networkInfo = async () => {
    const gasPrice = GasPrice.fromString("0.01uconst");
    const offlineSigner = window.getOfflineSigner(network.chainId, gasPrice);
    setGasPrice(gasPrice);
    setOfflineSigner(offlineSigner);

    const accounts = await offlineSigner.getAccounts();
    setIsAccount(accounts[0].address);
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
    const lpBalancemsg = {
      balance: { address: accounts[0].address },
    };
    const { balance } = await testClient.queryContractSmart(
      config.lpContract,
      lpBalancemsg
    );

    setLpBalance(balance);
    if (wallet) {
      const lpTotalmsg = {
        total_supply: {},
      };

      const lpTotalSupply = await testClient.queryContractSmart(
        config.lpContract,
        lpTotalmsg
      );
      setLpTotalSupply(lpTotalSupply);
      const poolmsg = {
        get_pool: {},
      };
      const pool = await testClient.queryContractSmart(
        config.bankContract,
        poolmsg
      );
      setPoolBalance(pool.balance);
      const initBalance = await fetchBalance();

      const reward = (
        ((balance / lpTotalSupply) * pool.balance - initBalance) /
        1000000
      ).toFixed(6);
      setReward(reward);
    } else {
      setReward(0);
    }

    const userBalance = (
      ((Number(lpBalance) / Number(lpTotalSupply)) * Number(pool.balance)) /
      1000000
    ).toFixed(6);

    console.log(userBalance);

    setUserBalance(userBalance);
    setLpBalance(balance);
    isMyBalance(clientBalance.amount / 1000000);
    setMyAddress(accounts[0].address);
  };
  useEffect(() => {
    networkInfo();
  }, []);
  const fetchBalance = async () => {
    if (!wallet) {
      return 0;
    }
    const { data } = await axios.get(
      `${config.serverEndpoint}/balance/${
        wallet ? wallet.name.bech32Address : "arhcway1"
      }`
    );
    const initBalance = data.balance;

    // console.log("initBalance", initBalance);
    return initBalance;
  };
  useEffect(() => {
    networkInfo();
  }, [pool]);

  const DepositForm = () => {
    return (
      <div>
        <DepositWrapper>
          <DepositTitle>
            <div>asset</div>
          </DepositTitle>
          <DepositTitle>
            <div>Balance</div>
          </DepositTitle>
        </DepositWrapper>
        <DepositAsset>
          <button onClick={ClickedIsOpen}>
            <DepositAssetInner>
              <div>CONST</div>
            </DepositAssetInner>
            <DepositAssetInner>
              <div>{(Number(wallet.balance.amount) / 1000000).toFixed(6)}</div>
            </DepositAssetInner>
          </button>
        </DepositAsset>
        {/* {depositIsOpen && <ViewdepositModal />} */}
        {depositIsOpen && (
          <DepositModal
            network={network}
            myBalance={myBalance}
            isMyBalance={isMyBalance}
            depositIsOpen={depositIsOpen}
            setDepositIsOpen={setDepositIsOpen}
            gasPrice={gasPrice}
            setGasPrice={setGasPrice}
            offlineSigner={offlineSigner}
            setOfflineSigner={setOfflineSigner}
            isAccount={isAccount}
            setIsAccount={setIsAccount}
            lpBalance={lpBalance}
            poolBalance={poolBalance}
          />
        )}
      </div>
    );
  };

  const WithdrawForm = () => {
    return (
      <div>
        <WithdrawWrapper>
          <WithdrawTitle>
            <div>asset</div>
          </WithdrawTitle>
          <WithdrawTitle>
            <div>Balance</div>
          </WithdrawTitle>
        </WithdrawWrapper>
        <WithdrawAsset>
          <button onClick={ClickedIsOpen}>
            <WithdrawAssetInner>
              <div>CONST</div>
            </WithdrawAssetInner>
            <WithdrawAssetInner>
              <div>{userBalance}</div>
            </WithdrawAssetInner>
          </button>
        </WithdrawAsset>
        {depositIsOpen && (
          <WithdrawModal
            depositIsOpen={depositIsOpen}
            setDepositIsOpen={setDepositIsOpen}
            isLPBalance={lpBalance}
            setIsLPBalance={setLpBalance}
            network={network}
            gasPrice={gasPrice}
            setGasPrice={setGasPrice}
            offlineSigner={offlineSigner}
            setOfflineSigner={setOfflineSigner}
            isAccount={isAccount}
            setIsAccount={setIsAccount}
            isPoolBalance={isPoolBalance}
            setIsPoolBalance={setIsPoolBalance}
            userBalance={userBalance}
            lpBalance={lpBalance}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <BankWrapper>
        <BankWrapperHeader>
          Bank
          <BankWrapperInfos>
            CONST Rewareds
            <BankWrapperRewards>{reward}</BankWrapperRewards>
            {/* <button>Claim</button> */}
          </BankWrapperInfos>
        </BankWrapperHeader>
        <BankTotalPool>
          <BankTotalPoolDiv>
            <BankTotalPoolInner>Total Pool Balance (CONST)</BankTotalPoolInner>
            <BankTotalPoolData>
              {(Number(pool.balance) / 1000000).toFixed(6)}
            </BankTotalPoolData>
          </BankTotalPoolDiv>
          <BankTotalPoolDiv>
            <BankTotalPoolInner>Balance in Play</BankTotalPoolInner>
            <BankTotalPoolData>
              {(Number(pool.nowGame) / 1000000).toFixed(6)}
            </BankTotalPoolData>
          </BankTotalPoolDiv>
        </BankTotalPool>
        {wallet ? (
          <>
            <BankWrapperSupply>
              <button
                onClick={(event) => {
                  ClickedDeposit();
                }}
                style={{
                  borderBottom: clickDeposit ? "2px solid #ff4d00" : "none",
                }}
              >
                Deposit
              </button>
              <button
                onClick={(event) => {
                  ClickedWithdraw();
                }}
                style={{
                  borderBottom: clickWithdraw ? "2px solid #ff4d00" : "none",
                }}
              >
                Withdraw
              </button>
            </BankWrapperSupply>
            <DepositDiv>
              {clickDeposit ? <DepositForm /> : <WithdrawForm />}
            </DepositDiv>
          </>
        ) : (
          <WalletConnect
            onClick={async () => {
              const { name, signer, balance } = await connectWallet(
                networkInfo
              );

              setWallet({
                name,
                balance,
                signer,
              });
            }}
          >
            Connect Wallet
          </WalletConnect>
        )}
      </BankWrapper>
    </div>
  );
}
export default Bank;
