import { OfflineSigner } from "@cosmjs/launchpad";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

const chainInfo = {
  chainId: "constantine-1",
  rpc: "https://rpc.constantine-1.archway.tech:443",
};

const connectWallet = async () => {
  if (!window.getOfflineSigner || !window.keplr) {
    alert("Please install the Keplr extension.");
    return;
  }

  if (window.keplr.experimentalSuggestChain) {
    try {
      await window.keplr.experimentalSuggestChain(chainInfo);
    } catch {
      alert("Failed to suggest chain.");
      return;
    }
  } else {
    alert("Please use the recent version of Keplr extension.");
    return;
  }

  await window.keplr.enable(chainInfo.chainId);
  const offlineSigner = window.getOfflineSigner(chainInfo.chainId);
  const [account] = await offlineSigner.getAccounts();
  console.log("Account:", account);

  const client = await getStargateClient(offlineSigner, chainInfo.chainId);
  console.log("Client:", client);
};

const getStargateClient = async (offlineSigner, chainId) => {
  const wallet = new DirectSecp256k1HdWallet(offlineSigner);
  const [address] = await wallet.getAccounts();
  const client = await DirectSecp256k1HdWallet.connectWithOfflineSigner(chainInfo.rpc, offlineSigner);
  return client;
};

export default connectWallet;
