import { useState } from "react";
import styled from "styled-components";
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
  width: 50%;
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
  width: 50%;
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
  border: 1px solid #2e2e2e;
  border-radius: 3px;
  width: 50%;
  button {
    background-color: #f76a2d;
    width: 50%;
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
  width: 50%;
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

function WithdrawForm() {
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
        <button>
          <WithdrawAssetInner>
            <div>AMG (LP)</div>
          </WithdrawAssetInner>
          <WithdrawAssetInner>
            <div>1234.23</div>
          </WithdrawAssetInner>
        </button>
      </WithdrawAsset>
    </div>
  );
}

// start Modal
const DepositModalWrapper = styled.div`
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

function ViewdepositModal() {
  return <DepositModalWrapper>viewit</DepositModalWrapper>;
}

function Swap() {
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
            style={{ backgroundColor: clickDeposit ? "#ff4d00" : "#181818" }}
          >
            Deposit
          </button>
          <button
            onClick={(event) => {
              ClickedWithdraw();
            }}
            style={{ backgroundColor: clickWithdraw ? "#ff4d00" : "#181818" }}
          >
            Withdraw
          </button>
        </BankWrapperSupply>
        <DepositDiv>{clickDeposit ? <DepositForm /> : <WithdrawForm>hi</WithdrawForm>}</DepositDiv>
      </BankWrapper>
    </div>
  );
}
export default Swap;
