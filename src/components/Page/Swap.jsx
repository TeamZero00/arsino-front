import { useContext, useState } from "react";
import styled from "styled-components";
import BalanceContext from "../BalanceContext";
import Header from "../Header";

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

// start deposit Modal
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
  }
`;
//start WithdrawFrom
const WithdrawModalWrapper = styled.div`
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
const WithdrawModalDiv = styled.div`
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
const WithdrawModalTitle = styled.div`
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
const WithdrawModalContent = styled.div`
  color: #f76a2d;
  padding: 10px 20px;
  border-bottom: 2px solid #ff4d00;
  div {
    font-size: 25px;
  }
`;
const WithdrawModalInputTotal = styled.div`
  display: flex;
  background-color: #181818;
  margin: 20px 10px;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #2e2e2e;
`;
const WithdrawModalInputDiv = styled.div`
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
const WithdrawModalInputAmount = styled.div`
  display: flex;
  justify-content: left;
  font-size: 13px;
  color: #c3c3c3;
  margin-top: 10px;
`;
const WithdrawModalOutputDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 2px solid #2e2e2e;
  font-size: 13px;
`;
const WithdrawContractDiv = styled.div`
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
  }
`;

function Swap() {
  const { balance, setBalance } = useContext(BalanceContext);
  const [clickDeposit, setClickDeposit] = useState(true);
  const [clickWithdraw, setClickWithdraw] = useState(false);
  const [depositIsOpen, setDepositIsOpen] = useState(false);

  const ClickedIsOpen = () => {
    setDepositIsOpen(!depositIsOpen);
  };
  const ClickedDeposit = (event) => {
    setClickDeposit(true);
    setClickWithdraw(false);
  };
  const ClickedWithdraw = (event) => {
    setClickDeposit(false);
    setClickWithdraw(true);
  };

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
              <div>1234.23</div>
            </DepositAssetInner>
          </button>
        </DepositAsset>
        {depositIsOpen && <ViewdepositModal />}
      </div>
    );
  };

  const ViewdepositModal = () => {
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
              <input type="number" placeholder="0.0"></input>
              <DepositModalInputAmount>
                balance: {balance && balance.amount ? balance.amount : "0"}
              </DepositModalInputAmount>
            </DepositModalInputDiv>
          </DepositModalInputTotal>
          <DepositModalOutputDiv>
            <div>receive LP</div>
            <div>0 Token</div>
          </DepositModalOutputDiv>
          <DepositContractDiv>
            <button>Enter</button>
          </DepositContractDiv>
        </DepositModalDiv>
      </DepositModalWrapper>
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
              <div>AMG (LP)</div>
            </WithdrawAssetInner>
            <WithdrawAssetInner>
              <div>1234.23</div>
            </WithdrawAssetInner>
          </button>
        </WithdrawAsset>
        {depositIsOpen && <ViewWithdrawModal />}
      </div>
    );
  };

  const ViewWithdrawModal = () => {
    return (
      <WithdrawModalWrapper>
        <WithdrawModalDiv>
          <WithdrawModalTitle>
            AMG (LP)<button onClick={ClickedIsOpen}>X</button>
          </WithdrawModalTitle>
          <div>
            <WithdrawModalContent>
              <div>Withdraw</div>
            </WithdrawModalContent>
          </div>
          <WithdrawModalInputTotal>
            <WithdrawModalInputDiv>
              <input type="number" placeholder="0.0"></input>
              <WithdrawModalInputAmount>
                (ex. LP BALANCE) balance: {balance && balance.amount ? balance.amount : "0"}
              </WithdrawModalInputAmount>
            </WithdrawModalInputDiv>
          </WithdrawModalInputTotal>
          <WithdrawModalOutputDiv>
            <div>receive CONST</div>
            <div>0 CONST</div>
          </WithdrawModalOutputDiv>
          <WithdrawContractDiv>
            <button>Enter</button>
          </WithdrawContractDiv>
        </WithdrawModalDiv>
      </WithdrawModalWrapper>
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
            <BankWrapperRewards>123.24</BankWrapperRewards>
            <button>Claim</button>
          </BankWrapperInfos>
        </BankWrapperHeader>
        <BankTotalPool>
          <BankTotalPoolDiv>
            <BankTotalPoolInner>Total Pool Balance</BankTotalPoolInner>
            <BankTotalPoolData>123456789.00</BankTotalPoolData>
          </BankTotalPoolDiv>
          <BankTotalPoolDiv>
            <BankTotalPoolInner>Balance in Play</BankTotalPoolInner>
            <BankTotalPoolData>123456789.00</BankTotalPoolData>
          </BankTotalPoolDiv>
        </BankTotalPool>
        <BankWrapperSupply>
          <button
            onClick={(event) => {
              ClickedDeposit();
            }}
            style={{ borderBottom: clickDeposit ? "2px solid #ff4d00" : "none" }}
          >
            Deposit
          </button>
          <button
            onClick={(event) => {
              ClickedWithdraw();
            }}
            style={{ borderBottom: clickWithdraw ? "2px solid #ff4d00" : "none" }}
          >
            Withdraw
          </button>
        </BankWrapperSupply>
        <DepositDiv>{clickDeposit ? <DepositForm /> : <WithdrawForm />}</DepositDiv>
      </BankWrapper>
    </div>
  );
}
export default Swap;
