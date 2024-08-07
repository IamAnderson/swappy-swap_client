import { create } from "zustand";
import { ethers } from "ethers";
import { Signer } from "ethers";

interface BlockchainDataInterface {
  accounts: Signer[];
  account: Signer;
  provider: ethers.providers.Web3Provider;
  chainId: number;
  balance: string;
  isWeb3Initialized: boolean;
  initialize: () => Promise<void>;
}

const loadBlockChainData = async () => {
  let accounts: Signer[] = [];
  let account: Signer | undefined;
  let provider: ethers.providers.Web3Provider | undefined;
  let chainId: number | undefined;
  let balance: string | undefined;

  //@ts-ignore
  if (typeof window.ethereum === "undefined") {
    console.log("Ethereum object not found, do you have MetaMask installed?");
    return { accounts, account, provider, chainId };
  }

  const connectWallet = async (retries = 3) => {
    try {
      //@ts-ignore
      const ethAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethAccounts && ethAccounts.length > 0) {
        accounts = ethAccounts as Signer[];
        account = accounts[0];

        //@ts-ignore
        provider = new ethers.providers.Web3Provider(window.ethereum);
        chainId = (await provider.getNetwork()).chainId;
        //@ts-ignore
        const balanceInWei =  (await provider.getBalance(account));
        balance = ethers.utils.formatEther(balanceInWei);

      } else {
        console.log("No accounts found");
      }
    } catch (error: any) {
      if (error.code === -32002 && retries > 0) {
        console.log("Request already pending. Retrying in 1 second...");
        setTimeout(() => connectWallet(retries - 1), 1000);
      } else {
        console.error(
          "An error occurred while connecting to the wallet:",
          error
        );
      }
    }
  };

  await connectWallet();

  return {
    accounts,
    account,
    provider,
    chainId,
    balance,
  };
};

export const useWeb3ConnectionHook = create<BlockchainDataInterface>((set) => ({
  accounts: [],
  account: null!,
  provider: null!,
  chainId: null!,
  balance: "",
  isWeb3Initialized: false,
  initialize: async () => {
    const { accounts, account, provider, chainId, balance } = await loadBlockChainData();
    set({ accounts, account, provider, chainId, balance, isWeb3Initialized: true });
  },
}));

useWeb3ConnectionHook.getState().initialize();
