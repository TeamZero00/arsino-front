import axios from "axios";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import config from "../config";
import { useQuery } from "react-query";

async function fetchScore() {
  const { data } = await axios.get(
    `http://${config.serverEndpoint}/score/archway1ukrazgltrvyg99j0m7arhk4nu4u05sdt0l05t0`
  );

  return data;
}

const Score = () => {
  const [userScore, setUserScore] = useState();
  const [rank, setRank] = useState();

  const { isLoading, isError, error } = useQuery("score", fetchScore, {
    refetchOnWindowFocus: false,
    retry: 1, // 실패시 재호출 몇번 할지
    onSuccess: (data) => {
      const { userPrize, rank } = data;
      setUserScore(userPrize);
      setRank(rank);
    },
  });
  if (isLoading) {
    console.log("Loading....");

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
      <div></div>
    </>
  );
};

export default Score;
