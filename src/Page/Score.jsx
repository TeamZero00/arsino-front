import axios from "axios";
import { useContext, useEffect, useState } from "react";

import Header from "../components/Header";
import config from "../config";
import { useQuery } from "react-query";
import { WalletContext } from "../App";
import styled from "styled-components";
const Title = styled.h2`
  width: 100px;
  height: 100px;
  color: "white";
`;
const Score = () => {
  const { wallet } = useContext(WalletContext);
  const [userScore, setUserScore] = useState();
  const [rank, setRank] = useState();

  const { isLoading, isError, error } = useQuery(
    "score",
    async () => {
      const { data } = await axios.get(
        `${config.serverEndpoint}/score/${
          wallet ? wallet.name.address : "archway1"
        }`
      );

      return data;
    },

    {
      refetchOnWindowFocus: false,
      retry: 0, // 실패시 재호출 몇번 할지
      onSuccess: (data) => {
        console.log(data);
        const { userPrize, rank } = data;
        setUserScore(userPrize);
        setRank(rank);
      },
    }
  );
  if (isLoading) {
    return (
      <>
        <Header />
        <span style={{ color: "white" }}>Loading...</span>;
      </>
    );
  }

  if (isError) {
    // console.log(error.message);
    return (
      <>
        <Header />
        <span style={{ color: "white" }}>Error: {error.message}</span>;
      </>
    );
  }

  return (
    <>
      <Header />
      <Title>Hello</Title>
    </>
  );
};

export default Score;
