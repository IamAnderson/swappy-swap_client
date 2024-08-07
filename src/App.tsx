import { useEffect } from "react";
import { ethers } from "ethers";
import config from "./config.json";
import TOKEN_ABI from "./abis/token.json";
import "./App.css";

function App() {
  useEffect(() => {
    const loadBlockChainData = async () => {
      //@ts-ignore
      if (typeof window.ethereum === "undefined") {
        console.log(
          "Ethereum object not found, do you have MetaMask installed?"
        );
        return;
      }

      const connectWallet = async (retries = 3) => {
        try {
          //@ts-ignore
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          if (accounts && accounts.length > 0) {
            console.log("Connected account:", accounts[0]);
            //@ts-ignore
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const { chainId } = await provider.getNetwork();
            // console.log(chainId);

            const token = new ethers.Contract(
              //@ts-ignore
              config[chainId].wEAE,
              TOKEN_ABI,
              provider
            );
            // console.log(token.address);

            const symbol = await token.symbol();
            // console.log("Symbol:", symbol);
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
    };

    loadBlockChainData();
  }, []);

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}
          {/* Balance */}
          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}
          {/* Transactions */}
          {/* Trades */}
          {/* OrderBook */}
        </section>
      </main>

      {/* Alert */}
    </div>
  );
}

export default App;
