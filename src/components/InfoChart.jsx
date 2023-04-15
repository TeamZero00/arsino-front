import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CandlestickChart from "./CandlestickChart";
import LongShort from "./LongShort";
import Position from "./Position";
import { w3cwebsocket as W3CWebSocket } from "websocket";

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
  width: 130px;
  justify-content: center;
`;
const ChartDiv = styled.div`
  display: flex;

  justify-content: left;
`;
const TopChartInfo = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: #181818;
  margin: 10px 0px;

  border: 0.5px solid #2e2e2e;
  border-radius: 3px;
`;
const InnerTopChartInfo = styled.div`
  color: white;
  margin: 10px 0 10px 0;
  padding-right: 20px;
`;
const TitleInner = styled.div`
  padding: 10px 30px;
  font-size: 1.2rem;
  color: #e4e9f0;
  font-weight: 600;
  align-items: center;
`;
const DataTitle = styled.div`
  color: #999999;
  font-size: 12px;
`;

function InfoChart() {
  const [eurInfo, setEurInfo] = useState({
    current: null,
    previous: null,
  });

  // eur/usd state
  const [eurDefinedLowPrice, setEurDefinedLowPrice] = useState(null);
  const [eurDefinedHighPrice, setEurDefinedHighPrice] = useState(null);
  const [eurDefinedNowPrice, setEurDefinedNowPrice] = useState(null);
  const [eurDefinedbefore24hPrice, setEurDefinedbefore24hPrice] = useState(null);
  const [eurDefinedCalc24hPrice, setEurDefinedCalc24hPrice] = useState(null);
  const [eurDefinedCalc24hPricePercent, setEurDefinedCalc24hPricePercent] = useState(null);
  // EUR/USD
  useEffect(() => {
    const eurClient = new W3CWebSocket("ws://66.42.38.167:8080");
    // DB WS
    eurClient.onopen = () => {
      console.log("EUR/USD Client Connected");
    };
    eurClient.onmessage = (message) => {
      const eurData = JSON.parse(message.data);

      if (eurData.data.lowPrice !== undefined) {
        let definedLowPrice = eurData.data.lowPrice;
        setEurDefinedLowPrice(definedLowPrice);
      }
      if (eurData.data.highPrice !== undefined) {
        let definedHighPrice = eurData.data.highPrice;
        setEurDefinedHighPrice(definedHighPrice);
      }
      if (eurData.data.nowPrice !== undefined) {
        let definedNowPrice = eurData.data.nowPrice;
        setEurDefinedNowPrice(definedNowPrice);
        setEurInfo((prevState) => ({
          current: eurData.data.nowPrice,
          previous: prevState.current,
        }));
      }
      if (eurData.data.befor24HourPrice !== undefined) {
        let definedBefore24hPrice = eurData.data.befor24HourPrice;
        setEurDefinedbefore24hPrice(definedBefore24hPrice);
      }
      if (eurData.data.nowPrice !== undefined && eurData.data.befor24HourPrice !== undefined) {
        let definedCalc24hPrice = eurData.data.nowPrice - eurData.data.befor24HourPrice;
        let FixedCalc24hPrice = definedCalc24hPrice.toFixed(5);
        let definedCalc24hPricePercent =
          ((eurData.data.nowPrice - eurData.data.befor24HourPrice) / eurData.data.befor24HourPrice) * 100;
        let FixedCalc24hPricePercent = definedCalc24hPricePercent.toFixed(2);
        setEurDefinedCalc24hPricePercent(FixedCalc24hPricePercent);
        setEurDefinedCalc24hPrice(FixedCalc24hPrice);
      }
    };
    return () => {
      eurClient.close();
    };
  }, []);

  const getColor = () => {
    if (eurInfo.previous && eurInfo.current > eurInfo.previous) {
      return "#0ecb82";
    } else if (eurInfo.previous && eurInfo.current < eurInfo.previous) {
      return "#f7465d";
    } else {
      return "currentColor";
    }
  };

  return (
    <InfoMain>
      <LeftRight>
        <TopChartInfo>
          {eurInfo ? <TitleInner>EUR/USD</TitleInner> : <TitleInner>Loading...</TitleInner>}
          <ChartDiv>
            <InnerTopChartInfo>
              <DataTitle>Price</DataTitle>
              <WidthInnerData
                style={{
                  color: getColor(),
                }}
              >
                {eurDefinedNowPrice !== null ? <div>$ {eurDefinedNowPrice}</div> : <div>wait..</div>}
              </WidthInnerData>
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Change</DataTitle>
              {eurDefinedCalc24hPrice ? (
                <WidthInnerData style={{ color: eurDefinedCalc24hPricePercent > 0 ? "#0ecb82" : "#f7465d" }}>
                  {eurDefinedCalc24hPrice}{" "}
                  {eurDefinedCalc24hPricePercent > 0
                    ? `+${eurDefinedCalc24hPricePercent}`
                    : eurDefinedCalc24hPricePercent}
                  %
                </WidthInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h High</DataTitle>
              {eurDefinedHighPrice ? <div>{eurDefinedHighPrice}</div> : <div> wait...</div>}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Low</DataTitle>
              {eurDefinedLowPrice ? <div>{eurDefinedLowPrice}</div> : <div> wait...</div>}
            </InnerTopChartInfo>
          </ChartDiv>
        </TopChartInfo>
        <CandlestickChart />
        <Position />
      </LeftRight>
      <LongShort />
    </InfoMain>
  );
}
export default InfoChart;
