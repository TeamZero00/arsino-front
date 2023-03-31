import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CandlestickChart from "./CandlestickChart";
import LongShort from "./LongShort";
import Position from "./Position";

const InfoMain = styled.div`
  padding: 50px 50px;
  display: flex;
  background-color: black;
`;
const LeftRight = styled.div`
  flex: 3 2;
`;

const ChartDiv = styled.div`
  border: solid 3px orange;
`;
const TopChartInfo = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: #181818;
  margin: 10px 0px;

  border: 0.5px solid gray;
  border-radius: 3px;
`;
const InnerTopChartInfo = styled.div`
  color: white;
  margin: 10px 0 10px 0;
  margin-left: 20px;
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
  const [coinInfo, setCoinInfo] = useState(null);
  const [priceChangePercent, setPriceChangePercent] = useState(null);
  const [highPrice, setHighPrice] = useState(null);
  const [lowPrice, setLowPrice] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.binance.com/api/v3/ticker/price`, {
        params: {
          symbol: "BTCUSDT",
        },
      })
      .then((res) => {
        const priceNum = Number(res.data.price);
        setCoinInfo(priceNum.toFixed(2));
      });

    axios
      .get("https://api.binance.com/api/v3/ticker/24hr", {
        params: {
          symbol: "BTCUSDT",
        },
      })
      .then((res) => {
        const priceChangePercent = Number(res.data.priceChangePercent);
        setPriceChangePercent(`${priceChangePercent.toFixed(2)}`);

        const highPrice = Number(res.data.highPrice);
        setHighPrice(`${highPrice.toFixed(2)}`);
        const lowPrice = Number(res.data.lowPrice);
        setLowPrice(`${lowPrice.toFixed(2)}`);
      });
  }, []);

  return (
    <InfoMain>
      <LeftRight>
        <TopChartInfo>
          {coinInfo ? <TitleInner>BTC/USDT</TitleInner> : <TitleInner>Loading...</TitleInner>}

          <InnerTopChartInfo>
            <DataTitle>Price</DataTitle>
            {coinInfo ? <div>$ {coinInfo}</div> : <div> wait...</div>}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <DataTitle>24h Change</DataTitle>
            {priceChangePercent ? (
              <div style={{ color: priceChangePercent > 0 ? "#0ecb82" : "#f7465d" }}>{priceChangePercent}%</div>
            ) : (
              <div> wait...</div>
            )}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <DataTitle>24h High</DataTitle>
            {highPrice ? <div>{highPrice}</div> : <div> wait...</div>}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <DataTitle>24h High</DataTitle>
            {lowPrice ? <div>{lowPrice}</div> : <div> wait...</div>}
          </InnerTopChartInfo>
        </TopChartInfo>
        <CandlestickChart />
        <Position />
      </LeftRight>
      <LongShort />
    </InfoMain>
  );
}
export default InfoChart;
