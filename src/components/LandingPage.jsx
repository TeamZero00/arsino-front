import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { FaGithub, FaTelegramPlane, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const LandingWrapperDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  height: 100vh;
`;
const LandingImg = styled.img`
  z-index: -100;
  position: absolute;
  height: 100%;
  width: 100vw;
  object-fit: cover;

  opacity: 0;
  transition: opacity 3s ease-in-out;
  &.bg1 {
    opacity: 1;
  }
`;

const LandingHeaderDiv = styled.div`
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LandingHeaderName = styled.img`
  /* width: 210px; */
  height: 30px;
  margin-bottom: 100px;
`;
const blinkTyping = keyframes`
    50% {
    opacity: 0;
  }
`;

const LandingTextDiv = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #cecece;
  padding-top: 50px;
`;

const LandingHeaderNameInfo = styled.img`
  flex: display;
  height: 200px;
  width: 100%;
`;

const DescMainBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    padding: 20px 0;
    width: 220px;
    font-size: 20px;
    font-weight: 600;
    border: none;
    border-radius: 50px;
    background-color: #2f2f2f;
    color: #e4e4e4;
    opacity: 0s;
    transition: opacity, 0.5s;
    &:hover {
      background-color: #ff4d00;
      transition: opacity, 0.5s;
      cursor: pointer;
    }
  }
`;
const GttBtn = styled.div`
  display: flex;
  padding-top: 70px;
`;
const GttBtnDiv = styled.div`
  font-size: 35px;
  margin: 20px;
  &:hover {
    cursor: pointer;
  }
`;

function LandingPage() {
  const descText = "Experience ZERO Margin Forex Trading for Individual Involvement";
  const [landingText, setLandingText] = useState("");
  const [textCount, setTextCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (textCount >= descText.length) {
        clearInterval(interval);
        return;
      }

      setLandingText((prev) => prev + descText.charAt(textCount));
      setTextCount((prev) => prev + 1);
    }, 50); // 글자 간격을 100ms로 조정하였습니다.

    return () => clearInterval(interval);
  }, [textCount, descText]);

  const [bgIndex, setBgIndex] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(bgIndex === 1 ? 2 : 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [bgIndex]);
  return (
    <LandingWrapperDiv>
      <LandingImg className={bgIndex === 1 ? "" : "bg1"} alt="greeb" src="/src/LandingWrapperGreen.svg" />
      <LandingImg className={bgIndex === 1 ? "bg1" : ""} alt="red" src="/src/LandingWrapper.svg" />
      <LandingHeaderDiv>
        <LandingHeaderNameInfo alt="brandnameinfo" src="/src/LandingMainNameInfo.svg" />
        <LandingTextDiv>{landingText}</LandingTextDiv>
        <GttBtn>
          <GttBtnDiv>
            <FaGithub onClick={() => window.open("https://github.com/TeamZero00", "_blank")} />
          </GttBtnDiv>
          <GttBtnDiv>
            <FaTelegramPlane onClick={() => window.open("https://t.me/zero_node", "_blank")} />
          </GttBtnDiv>
          <GttBtnDiv>
            <FaTwitter onClick={() => window.open("https://twitter.com/zero_N0de", "_blank")} />
          </GttBtnDiv>
        </GttBtn>
        <DescMainBtn>
          <Link to="/trade">
            <button>Launch App</button>
          </Link>
        </DescMainBtn>
      </LandingHeaderDiv>
    </LandingWrapperDiv>
  );
}

export default LandingPage;
