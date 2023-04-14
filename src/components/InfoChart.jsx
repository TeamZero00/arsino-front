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
  const [coinInfo, setCoinInfo] = useState({
    current: null,
    previous: null,
  });
  const [priceChangePercent, setPriceChangePercent] = useState(null);
  const [highPrice, setHighPrice] = useState(null);
  const [lowPrice, setLowPrice] = useState(null);
  const [changePrice, setChangePrice] = useState(null);

  useEffect(() => {
    const tickerClient = new W3CWebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
    //클라인 클라이언트
    tickerClient.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    tickerClient.onmessage = (message) => {
      const tickerData = JSON.parse(message.data);

      setCoinInfo((prevState) => ({
        current: Number(tickerData.c),
        previous: prevState.current,
      }));
      setPriceChangePercent(Number(tickerData.P).toFixed(2));
      setHighPrice(Number(tickerData.h).toFixed(2));
      setLowPrice(Number(tickerData.l).toFixed(2));
      setChangePrice(Number(tickerData.p).toFixed(2));
      // console.log(klineData.k);
    };
    return () => {
      tickerClient.close();
    };
  }, []);

  return (
    <InfoMain>
      <LeftRight>
        <TopChartInfo>
          {coinInfo ? <TitleInner>BTC/USDT</TitleInner> : <TitleInner>Loading...</TitleInner>}
          <ChartDiv>
            <InnerTopChartInfo>
              <DataTitle>Price</DataTitle>
              <WidthInnerData
                style={{
                  color: coinInfo.previous && coinInfo.current > coinInfo.previous ? "#0ecb82" : "#f7465d",
                }}
              >
                {coinInfo.current ? <div>$ {coinInfo.current.toFixed(2)}</div> : <div> wait...</div>}
              </WidthInnerData>
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Change</DataTitle>
              {priceChangePercent ? (
                <WidthInnerData style={{ color: priceChangePercent > 0 ? "#0ecb82" : "#f7465d" }}>
                  {changePrice} {priceChangePercent > 0 ? `+${priceChangePercent}` : priceChangePercent}%
                </WidthInnerData>
              ) : (
                <div> wait...</div>
              )}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h High</DataTitle>
              {highPrice ? <div>{highPrice}</div> : <div> wait...</div>}
            </InnerTopChartInfo>
            <InnerTopChartInfo>
              <DataTitle>24h Low</DataTitle>
              {lowPrice ? <div>{lowPrice}</div> : <div> wait...</div>}
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
