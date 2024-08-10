import React from "react";
import Blockies from "react-blockies";

import logo from "../assets/logo.png";
import eth from "../assets/eth.svg";
import { Contract, Signer } from "ethers";
import config from "../config.json";


const Navbar = ({
  account,
  balance,
  chainId,
  initialize,
}: {
  accounts: Signer[];
  account: string | undefined;
  chainId: number | undefined;
  balance: number | undefined;
  initialize: () => Promise<void>;

  exchange: Contract | undefined;
}) => {
  const connectHandler = async () => {
    try {
      await initialize();
    } catch (error) {
      console.error("Failed to initialize", error);
    }
  };

  const networkHandler = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChainId = e.target.value;

    //@ts-ignore
    if (typeof window?.ethereum !== "undefined") {
      try {
        //@ts-ignore
        await window?.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: selectedChainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            //@ts-ignore
            await window?.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: selectedChainId,
                  chainName:
                    selectedChainId === "0x7A69" ? "Localhost" : "Kovan",
                  rpcUrls: [
                    selectedChainId === "0x7A69"
                      ? "http://localhost:8545"
                      : "https://kovan.infura.io/v3/YOUR-PROJECT-ID",
                  ],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add the network:", addError);
          }
        } else {
          console.error("Failed to switch network:", switchError);
        }
      }
    } else {
      console.log("MetaMask is not installed");
    }
  };

  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <img src={logo} className="logo" alt="DApp Logo"></img>
        <h1>Token Exchange</h1>
      </div>

      <div className="exchange__header--networks flex">
        <img src={eth} alt="ETH Logo" className="Eth Logo" />

        {chainId && (
          <select
            name="networks"
            id="networks"
            onChange={networkHandler}
            value={chainId.toString(16)}
          >
            <option value="0" disabled>
              Select Network
            </option>
            <option value="0x7A69">Localhost</option>
            <option value="0x2a">Kovan</option>
          </select>
        )}
      </div>

      <div className="exchange__header--account flex">
        {balance !== undefined ? (
          <p>My Balance: {balance.toFixed(4)} ETH</p>
        ) : (
          <p>0 ETH</p>
        )}
        {account ? (
          <a
            //@ts-ignore
            href={`${config[chainId]?.explorerUrl}/address/${account}`}
            target="_blank"
            rel="norefferer"
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon"
            />
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
