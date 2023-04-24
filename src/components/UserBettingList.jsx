import { SigningArchwayClient } from "@archwayhq/arch3.js/build";
import { GasPrice } from "@cosmjs/stargate";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import config from "../config";
import { WalletContext } from "../App";

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
  font-size: 14px;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const fetchHistory = async (address) => {
  const { data } = await axios.get(
    `${config.serverEndpoint}/bet_history/${address}`
  );

  return data;
};

function UserBettingList({ bettingList, winner }) {
  const { wallet } = useContext(WalletContext);

  const [userHistory, setUserHistory] = useState([]);

  useEffect(() => {
    getUserHistory();
  }, [wallet, bettingList]);

  const getUserHistory = async () => {
    if (!wallet) {
      setUserHistory([]);
      return;
    }

    const address = wallet.name.bech32Address;

    const data = await fetchHistory(address);

    const history = await Promise.all(
      data.map(async (item) => {
        const {
          data: {
            result: {
              signed_header: {
                header: { time },
              },
            },
          },
        } = await axios.get(
          `https://rpc.constantine-2.archway.tech/commit?height=${item.startHeight}`
        );

        return { ...item, time };
      })
    );
    history.sort((a, b) => b.id - a.id);

    setUserHistory(history);
  };

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
        {/* <PositionTopInfoDiv>startHeight</PositionTopInfoDiv>
        <PositionTopInfoDiv>targetHeight</PositionTopInfoDiv> */}
        <PositionTopInfoDiv>Position</PositionTopInfoDiv>
        <PositionTopInfoDiv>Amount(CONST)</PositionTopInfoDiv>
        <PositionTopInfoDiv>Status</PositionTopInfoDiv>
        <PositionTopInfoDiv>BasePrice</PositionTopInfoDiv>
        <PositionTopInfoDiv>RoundPrice</PositionTopInfoDiv>
        <PositionTopInfoDiv>WinAmount</PositionTopInfoDiv>
      </PositionTopInfo>

      {userHistory.length === 0 && !wallet ? (
        <div></div>
      ) : (
        userHistory.map((history) => {
          const {
            position,
            time,
            amount,
            status,
            winAmount,
            roundPrice,
            basePrice,
          } = history;

          return (
            <PositionInfo key={history.id}>
              <PositionInfoData>{formatDate(time)}</PositionInfoData>
              {/* <PositionInfoData>{startHeight}</PositionInfoData>
              <PositionInfoData>{targetHeight}</PositionInfoData> */}
              <PositionInfoData
                style={{ color: position === "Long" ? "#0ecb82" : "#f7465d" }}
              >
                {position}
              </PositionInfoData>
              <PositionInfoData>{amount / 1000000}</PositionInfoData>
              <PositionInfoData>{status}</PositionInfoData>
              <PositionInfoData>{basePrice.toFixed(5)}</PositionInfoData>
              <PositionInfoData>{roundPrice.toFixed(5)}</PositionInfoData>
              <PositionInfoData
                style={{ color: status === "Lose" ? "#555555" : "none" }}
              >
                {winAmount / 1000000}
              </PositionInfoData>
            </PositionInfo>
          );
        })
      )}
    </PositionTotal>
  );
}
export default UserBettingList;
