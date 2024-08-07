import { create } from "zustand";
import { ethers } from "ethers";
import { Contract } from "ethers";
import EXCHANGE_ABI from "../abis/exchange.json";

interface BlockchainDataInterface {
  exchange: Contract;
  initialize: (address: string) => Promise<void>;
}

const loadTokenData = async (address: string) => {
  try {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
    return { exchange };
  } catch (error) {
    console.error("An error occurred while fetching exchange data:", error);
    return { exchange: null! };
  }
};

export const useExchangeHook = create<BlockchainDataInterface>((set) => ({
  exchange: null!,
  initialize: async (address: string) => {
    const { exchange } = await loadTokenData(address);
    set({ exchange });
  },
}));

