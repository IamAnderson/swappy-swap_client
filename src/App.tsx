import { useEffect, useState } from "react";
import config from "./config.json";
import { useTokenHook } from "./hooks/use-token-contract-hook";
import { useWeb3ConnectionHook } from "./hooks/use-web3Connection-hook";
import "./App.css";
import { useExchangeHook } from "./hooks/use-exchange-hook";
import Navbar from "./component/navbar";

function App() {
  const { chainId, isWeb3Initialized, balance, account, accounts, loadBlockChainData, initialize } =
    useWeb3ConnectionHook();
    
  const accountToString = account?.toString();
  const balanceToNum = balance ? Number(balance) : undefined;

  const { exchange, initialize: initializeExchange } = useExchangeHook();
  const { initialize: initializeTokens, tokens } = useTokenHook();

  //@ts-ignore
  window?.ethereum?.on("accountsChanged", () => {
    initialize();
  })

  //@ts-ignore
  window?.ethereum?.on("chainChanged", () => {
    window.location.reload;
  })


  useEffect(() => {
    //@ts-ignore
    if (isWeb3Initialized && chainId && config[chainId as keyof typeof config]) {
      //@ts-ignore
      initializeExchange(config[chainId as keyof typeof config]?.exchange?.address);

      const addresses = [
        //@ts-ignore
        config[chainId as keyof typeof config]?.wEAE?.address,
        //@ts-ignore
        config[chainId as keyof typeof config]?.mETH?.address,
      ];

      initializeTokens(addresses);
    }
  }, [isWeb3Initialized, chainId, initializeTokens, initializeExchange]);
  
  return (
    <div>
      <Navbar
        accounts={accounts}
        account={accountToString!}
        chainId={chainId!}
        balance={balanceToNum!}
        exchange={exchange}
        initialize={initialize}
      />

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
