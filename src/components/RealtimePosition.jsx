import styled from "styled-components";

const TotalDiv = styled.div`
  padding: 0 10px;
  background-color: #181818;
  border: 1px solid #2e2e2e;
  scrollbar-width: none;
  border-radius: 10px;
`;
const MainDiv = styled.div`
  color: white;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const WrapDiv = styled.div`
  display: flex;
`;
const Titlediv = styled.div`
  display: flex;
  padding: 15px 0;
  color: #ff4d00;
  font-weight: 800;
  font-size: 15px;
`;
const HeaderDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #999999;
  padding-bottom: 5px;
  border-bottom: 1px solid #5c5c5c;
`;
const HeaderDivLeft = styled.div`
  display: flex;
  justify-content: Left;
  align-items: center;
  width: 100%;
`;
const HeaderDivRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
`;

const Bodydiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Bodydiv2 = styled.div`
  display: flex;
  padding: 5px 0;
  justify-content: space-between;
  font-size: 14px;
`;
const BodydivCenter = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
`;
const BodydivLeft = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  font-weight: 600;
  width: 100%;
`;
const BodydivRight = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  width: 100%;
`;

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

function RealtimePosition({ height, initGameData }) {
  return (
    <div>
      <TotalDiv>
        <Titlediv>Realtime Trade</Titlediv>
        <HeaderDiv>
          <HeaderDivLeft>Price(USD)</HeaderDivLeft>
          <HeaderDivRight style={{ textAlign: "right" }}>Amount(CONST)</HeaderDivRight>
          <HeaderDivRight>Position</HeaderDivRight>
        </HeaderDiv>
        <MainDiv style={{ height: height }}>
          <Bodydiv>
            {initGameData ? (
              initGameData.map((item, index) => {
                return (
                  <Bodydiv2 key={index}>
                    <BodydivLeft>${item.basePrice.toFixed(5)}</BodydivLeft>
                    <BodydivCenter>{item.amount / 1000000}</BodydivCenter>
                    <BodydivRight style={{ color: item.position == "Long" ? "#0ecb82" : "#f7465d" }}>
                      {item.position}
                    </BodydivRight>
                  </Bodydiv2>
                );
              })
            ) : (
              <LoadingDiv>wait</LoadingDiv>
            )}
          </Bodydiv>
        </MainDiv>
      </TotalDiv>
    </div>
  );
}

export default RealtimePosition;
