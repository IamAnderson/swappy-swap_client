import { create } from "zustand";
import { ethers } from "ethers";
import { Contract } from "ethers";
import TOKEN_ABI from "../abis/token.json";

interface TokenData {
  contract: Contract;
  symbol: string;
}

interface BlockchainDataInterface {
  tokens: TokenData[];
  initialize: (addresses: string[]) => Promise<void>;
}

const loadTokenData = async (address: string) => {
  try {
    //@ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address, TOKEN_ABI, provider);
    const symbol = await contract.symbol();
    return { contract, symbol };
  } catch (error) {
    console.error(`An error occurred while fetching token data for ${address}:`, error);
    return null;
  }
};

export const useTokenHook = create<BlockchainDataInterface>((set) => ({
  tokens: [],

  initialize: async (addresses: string[]) => {
    const tokenDataPromises = addresses.map(loadTokenData);
    const tokenDataResults = await Promise.all(tokenDataPromises);

    const tokens: TokenData[] = tokenDataResults.filter((data): data is TokenData => data !== null);

    set({ tokens });
  },
}));