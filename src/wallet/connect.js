/* eslint-disable react-hooks/rules-of-hooks */
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const connectWallet = async (evnet, chainInfo, { getInfo, setBalance }) => {
  // 사용자의 브라우저에 Keplr extension이 설치되었는지 확인
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install Keplr Extension");
  }
  // Keplr wallet에 네트워크 추가

  if (window.keplr.experimentalSuggestChain) {
    try {
      await window.keplr.experimentalSuggestChain(chainInfo);
    } catch {
      alert("Failed to suggest the chain");
    }
  } else {
    alert("Please use the recent version of keplr extension");
  }
  // Keplr에 chainId로의 접근 요청
  await window.keplr.enable(chainInfo.chainId);
  // 체인 ID를 이용해서 OfflineSigner 가져오기
  const offlineSigner = window.getOfflineSigner(chainInfo.chainId);
  // address & public key 페어 배열 리턴
  const accounts = await offlineSigner.getAccounts();
  // SigningCosmWasmClient 생성
  const signer = await SigningCosmWasmClient.connectWithSigner(
    chainInfo.rpc,
    offlineSigner
  );
  // 해당 주소의 balance 가져오기
  const balance = await signer.getBalance(
    accounts[0].address,
    chainInfo.stakeCurrency.coinMinimalDenom
  );

  const name = await window.keplr.getKey(chainInfo.chainId);
  // 부모 컴포넌트로 값을 넘겨주기 위한 함수

  getInfo(signer, accounts[0].address, balance, chainInfo.chainId, name);

  return {
    name,
    balance,
    signer,
  };
};

export default connectWallet;
