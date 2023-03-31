import styled from "styled-components";

const PositionTotal = styled.div`
  width: 100%;
  height: 200px;
  background-color: #181818;
  overflow: auto;
  border: 0.5px solid gray;
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
  border-bottom: 0.5px solid gray;
  background-color: #181818;
`;

const PositionTopInfoDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  color: #999999;
  display: flex;

  justify-content: center;
  align-items: center;
  width: 100%;
`;

function Position() {
  const dummyData = [
    {
      id: 1,
      Date: "03-29 14:30",
      Position: "Long",
      Amount: 1111,
      Winning: "Lose",
      Total: 0,
    },
    {
      id: 2,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 2222,
      Winning: "Win",
      Total: 12,
    },
    {
      id: 3,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 3333,
      Winning: "Win",
      Total: 24,
    },
    {
      id: 4,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 3333,
      Winning: "Win",
      Total: 24,
    },
    {
      id: 5,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 3333,
      Winning: "Win",
      Total: 24,
    },
    {
      id: 6,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 3333,
      Winning: "Win",
      Total: 24,
    },
    {
      id: 7,
      Date: "03-29 15:30",
      Position: "Short",
      Amount: 3333,
      Winning: "Win",
      Total: 24,
    },
  ];

  return (
    <PositionTotal>
      <PositionTopInfo>
        <PositionTopInfoDiv>Date</PositionTopInfoDiv>
        <PositionTopInfoDiv>Position</PositionTopInfoDiv>
        <PositionTopInfoDiv>Amount</PositionTopInfoDiv>
        <PositionTopInfoDiv>Win / Lose</PositionTopInfoDiv>
        <PositionTopInfoDiv>Total</PositionTopInfoDiv>
      </PositionTopInfo>
      {dummyData.map((data) => (
        <PositionInfo key={data.id}>
          <PositionInfoData>{data.Date}</PositionInfoData>

          <PositionInfoData>{data.Position}</PositionInfoData>
          <PositionInfoData>{data.Amount}</PositionInfoData>
          <PositionInfoData>{data.Winning}</PositionInfoData>
          <PositionInfoData>{data.Total}</PositionInfoData>
        </PositionInfo>
      ))}
    </PositionTotal>
  );
}
export default Position;
