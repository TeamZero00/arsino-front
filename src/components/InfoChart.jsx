import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CandlestickChart from "./CandlestickChart";
import LongShort from "./LongShort";
import Position from "./UserBettingList";
import UserBettingList from "./UserBettingList";
import { WalletContext } from "../App";
// import { w3cwebsocket as W3CWebSocket } from "websocket";

const InfoMain = styled.div`
  padding: 50px 50px;
  display: flex;
  background-color: black;
`;
const LeftRight = styled.div`
  flex: 3 2;
`;

const WidthInnerData = styled.div`
  display: flex;
  justify-content: left;
  font-size: 18px;
`;
const ChartDiv = styled.div`
  display: flex;
`;
const TopChartInfo = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: #181818;
  margin: 10px 0px;
  padding: 3px 0px;
  border: 0.5px solid #2e2e2e;
  border-radius: 3px;
`;
const InnerTopChartInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  color: white;
  margin: 10px 0 10px 0;
  padding-right: 30px;
`;
const TitleInner = styled.div`
  padding: 10px 30px;
  font-size: 1.2rem;
  color: #e4e9f0;
  font-weight: 600;
  align-items: center;
`;
const DataTitle = styled.div`
  display: flex;
  justify-content: left;
  align-items: left;
  color: #999999;
  font-size: 12px;
`;
const TitleInnerData = styled.div`
  display: flex;
  justify-content: left;
  font-size: 13px;
  font-weight: 500;
`;

function InfoChart({ isConnected, price, pool, bettingList, winner, chart }) {
  const [eurInfo, setEurInfo] = useState({
    current: null,
    previous: null,
  });

  const getColor = () => {
    if (eurInfo.previous && eurInfo.current > eurInfo.previous) {
      return "#0ecb82";
    } else if (eurInfo.previous && eurInfo.current < eurInfo.previous) {
      return "#f7465d";
    } else {
      return "currentColor";
    }
  };
  const {
    prices: {
      before24HourPrice = null,
      nowPrice = null,
      highPrice = null,
      lowPrice = null,
    } = {},
    height = null,
  } = price || {};
  return (
    <InfoMain>
      <LeftRight>
        <TopChartInfo>
          {eurInfo ? (
            <TitleInner>EUR/USD</TitleInner>
          ) : (
            <TitleInner>Loading...</TitleInner>
          )}
          <ChartDiv>
            <InnerTopChartInfo>
              <WidthInnerData
                style={{
                  color: getColor(),
                }}
              >
                {nowPrice !== null ? (
                  <div>${Number(nowPrice).toFixed(5)}</div>
                ) : (
                  <div>wait..</div>
                )}
              </WidthInnerData>
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Change</DataTitle>
              {before24HourPrice ? (
                <WidthInnerData
                  style={{
                    color:
                      nowPrice - before24HourPrice > 0 ? "#0ecb82" : "#f7465d",
                  }}
                >
                  <TitleInnerData>
                    {(nowPrice - before24HourPrice).toFixed(5)}
                  </TitleInnerData>
                  <TitleInnerData>
                    {nowPrice - before24HourPrice > 0
                      ? ` +${(
                          ((nowPrice - before24HourPrice) / before24HourPrice) *
                          100
                        ).toFixed(3)}`
                      : ` -${(
                          ((nowPrice - before24HourPrice) / before24HourPrice) *
                          100
                        ).toFixed(3)}`}
                    %
                  </TitleInnerData>
                </WidthInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h High</DataTitle>
              {highPrice ? (
                <TitleInnerData>{highPrice}</TitleInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Low</DataTitle>
              {lowPrice ? (
                <TitleInnerData>{lowPrice}</TitleInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>Now height</DataTitle>
              {height ? (
                <TitleInnerData>{height}</TitleInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
          </ChartDiv>
        </TopChartInfo>
        <CandlestickChart chart={chart} />

        <UserBettingList bettingList={bettingList} winner={winner} />
      </LeftRight>
      <LongShort bettingList={bettingList} />
    </InfoMain>
  );
}
export default InfoChart;
