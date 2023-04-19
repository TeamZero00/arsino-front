import { SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { GasPrice } from "@cosmjs/stargate";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

const PositionTotal = styled.div`
  width: 100%;
  height: 200px;
  background-color: #181818;
  overflow: auto;
  border: 0.5px solid #2e2e2e;
  border-radius: 2px;
  //스크롤바 없애기
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const PositionTopInfo = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  position: sticky;
  top: 0;
  color: #777777;
  border-bottom: 0.5px solid #2e2e2e;
  background-color: #181818;
`;

const PositionTopInfoDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #999999;
  width: 100%;
`;

const PositionInfo = styled.div`
  margin: 10px;
  display: flex;
  justify-content: space-between;
  overflow-y: auto;
  max-height: 160px; /* 아래 예시에서 40px 여백을 주기 위해 높이를 조정합니다 */
`;
const PositionInfoData = styled.div`
  color: #ffffff;
  display: flex;

  justify-content: center;
  align-items: center;
  width: 100%;
`;

function Position({ initGameData }) {
  const [isAccounts, getIsAccounts] = useState(null);
  const [history, isHistory] = useState(null);
  const [isBalance, getIsBalance] = useState(null);
  const [additionalData, setAdditionalData] = useState([]);

  const getAccounts = async () => {
    try {
      const network = {
        chainId: "constantine-2",
        endpoint: "https://rpc.constantine-2.archway.tech",
        prefix: "archway",
      };
      const gasPrice = GasPrice.fromString("0.01uconst");
      const offlineSigner = window.getOfflineSigner("constantine-2", gasPrice);
      const accounts = await offlineSigner.getAccounts();
      const client = await SigningArchwayClient.connectWithSigner(network.endpoint, offlineSigner, {
        gasPrice,
        prefix: network.prefix,
      });
      const balance = await client.getBalance(accounts[0].address, "uconst");

      getIsAccounts(accounts[0].address);
      getIsBalance(balance.amount);
      console.log(isAccounts, isBalance);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAccounts();
    const axiosGet = async () => {
      if (isAccounts && isBalance) {
        await axios
          .get(`http://66.42.38.167:4000/bet_history/${isAccounts}`)
          .then((res) => {
            isHistory(res.data.slice().reverse());
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    axiosGet();
  }, [initGameData]);

  console.log("history", history);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (isAccounts && isBalance) {
        const fetchedData = await Promise.all(
          history.map(async (item) => {
            const response = await axios.get(
              `https://rpc.constantine-2.archway.tech/commit?height=${item.startHeight}`
            );
            return { ...item, additionalData: response.data };
          })
        );
        setAdditionalData(fetchedData);
      }
    };
    fetchAdditionalData();
  }, [initGameData]);

  console.log("addi", additionalData);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  return (
    <PositionTotal>
      <PositionTopInfo>
        <PositionTopInfoDiv>Date</PositionTopInfoDiv>
        <PositionTopInfoDiv>Position</PositionTopInfoDiv>
        <PositionTopInfoDiv>Amount(CONST)</PositionTopInfoDiv>
        <PositionTopInfoDiv>Result</PositionTopInfoDiv>
        <PositionTopInfoDiv>Total(CONST)</PositionTopInfoDiv>
      </PositionTopInfo>
      {additionalData
        ? additionalData.map((data) => (
            <PositionInfo key={data.id}>
              <PositionInfoData style={{ color: data.status == "Lose" ? "#5c5c5c" : "#ffffff" }}>
                {formatDate(data.additionalData.result.signed_header.header.time)}
              </PositionInfoData>
              <PositionInfoData style={{ color: data.position == "Long" ? "#0ecb82" : "#f7465d" }}>
                {data.position}
              </PositionInfoData>
              <PositionInfoData style={{ color: data.status == "Lose" ? "#5c5c5c" : "#ffffff" }}>
                {data.amount / 1000000}
              </PositionInfoData>
              <PositionInfoData style={{ color: data.status == "Lose" ? "#5c5c5c" : "#ffffff" }}>
                {data.status}
              </PositionInfoData>
              <PositionInfoData style={{ color: data.status == "Lose" ? "#5c5c5c" : "#ffffff" }}>
                {data.winAmount / 1000000}
              </PositionInfoData>
            </PositionInfo>
          ))
        : "wait"}
    </PositionTotal>
  );
}
export default Position;
