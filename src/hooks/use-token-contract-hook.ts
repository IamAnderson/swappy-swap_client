import { create } from "zustand";
import { ethers } from "ethers";
import { Contract } from "ethers";
import TOKEN_ABI from "../abis/token.json";

interface BlockchainDataInterface {
  token: Contract;
  symbol: string;
  initialize: (address: string) => Promise<void>;
}

const loadTokenData = async (address: string) => {
  try {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token = new ethers.Contract(address, TOKEN_ABI, provider);
    const symbol = await token.symbol();
    return { token, symbol };
  } catch (error) {
    console.error("An error occurred while fetching token data:", error);
    return { token: null!, symbol: "" };
  }
};

export const useTokenHook = create<BlockchainDataInterface>((set) => ({
  token: null!,
  symbol: "",

  initialize: async (address: string) => {
    const tokenData = await loadTokenData(address);
    set({ token: tokenData?.token, symbol: tokenData?.symbol });
  },
}));
