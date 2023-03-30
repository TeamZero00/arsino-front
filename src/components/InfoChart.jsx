import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Chart from "chart.js/auto";
import ChartExample from "./ChartExample";
import CandlestickChart from "./CandlestickChart";
import LongShort from "./LongShort";
import Position from "./Position";

const InfoMain = styled.div`
  border: solid 3px green;
  padding: 50px 50px;
  display: flex;
`;
const LeftRight = styled.div`
  flex: 4 1;
`;

const ChartDiv = styled.div`
  border: solid 3px orange;
`;
const TopChartInfo = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  background-color: #16182e;
  margin: 10px 0;
`;
const InnerTopChartInfo = styled.div`
  color: white;
  margin-left: 20px;
  background-color: #16182e;
`;
const TitleInner = styled.div`
  padding: 10px 30px;
  font-size: 1.5rem;
  color: white;
  font-weight: 600;
  align-items: center;
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
            <div>Price</div>
            {coinInfo ? <div>$ {coinInfo}</div> : <div> wait...</div>}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <div>24h Change</div>
            {priceChangePercent ? <div style={{ color: priceChangePercent > 0 ? "green" : "red" }}>{priceChangePercent}%</div> : <div> wait...</div>}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <div>24h High</div>
            {highPrice ? <div>{highPrice}</div> : <div> wait...</div>}
          </InnerTopChartInfo>
          <InnerTopChartInfo>
            <div>24h High</div>
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
