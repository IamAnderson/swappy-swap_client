import { useEffect, useState } from "react";
import config from "./config.json";
import { useTokenHook } from "./hooks/use-token-contract-hook";
import { useWeb3ConnectionHook } from "./hooks/use-web3Connection-hook";
import "./App.css";
import { useExchangeHook } from "./hooks/use-exchange-hook";

function App() {
  const { chainId, isWeb3Initialized, balance } = useWeb3ConnectionHook();
  const { exchange, initialize: initializeExchange } = useExchangeHook();
  const { initialize: initializeTokens, tokens } = useTokenHook();

  useEffect(() => {
    //@ts-ignore
    if (isWeb3Initialized && chainId && config[chainId]) {
      //@ts-ignore
      initializeExchange(config[chainId]?.exchange?.address);

      const addresses = [
        //@ts-ignore
        config[chainId]?.wEAE?.address,
        //@ts-ignore
        config[chainId]?.mETH?.address,
      ];

      initializeTokens(addresses);
    }
  }, [isWeb3Initialized, chainId, initializeTokens, initializeExchange]);

  console.log(balance)

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
