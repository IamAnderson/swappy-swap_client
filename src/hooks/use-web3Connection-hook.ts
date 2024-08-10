import { create } from "zustand";
import { ethers } from "ethers";
import { Signer } from "ethers";

interface BlockchainDataInterface {
  accounts: Signer[];
  account: Signer | string | undefined;
  chainId: number | undefined;
  balance: string | undefined;
  isWeb3Initialized: boolean;
  initialize: () => Promise<void>;
  loadBlockChainData: () => Promise<{
    accounts: Signer[];
    account: Signer | string | undefined;
    chainId: number | undefined;
    balance: string | undefined;
  }>;
}

export const useWeb3ConnectionHook = create<BlockchainDataInterface>((set) => {
  const loadBlockChainData = async () => {
    let accounts: Signer[] = [];
    let account: Signer | string | undefined;
    let provider: ethers.providers.Web3Provider;
    let chainId: number | undefined;
    let balance: string | undefined;

    //@ts-ignore
    if (typeof window.ethereum === "undefined") {
      console.log("Ethereum object not found, do you have MetaMask installed?");
      return { accounts, account, chainId, balance };
    }

    try {
      //@ts-ignore
      const ethAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (ethAccounts && ethAccounts.length > 0) {
        accounts = ethAccounts as unknown as Signer[];
        account = accounts[0];
        //@ts-ignore
        provider = new ethers.providers.Web3Provider(window.ethereum);
        chainId = (await provider.getNetwork()).chainId;
        //@ts-ignore
        const balanceInWei = await provider.getBalance(account);
        balance = ethers.utils.formatEther(balanceInWei);

        console.log("Connection successful:", { account, chainId, balance });
      } else {
        console.log("No accounts found");
      }
    } catch (error: any) {
      console.error("An error occurred while connecting to the wallet:", error);
    }

    return { accounts, account, chainId, balance };
  };

  return {
    accounts: [],
    account: undefined,
    chainId: undefined,
    balance: undefined,
    isWeb3Initialized: false,
    loadBlockChainData,
    initialize: async () => {
      const { accounts, account, chainId, balance } = await loadBlockChainData();
      set({ accounts, account, chainId, balance, isWeb3Initialized: true });
    },
  };
});