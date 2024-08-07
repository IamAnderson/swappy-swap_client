import { useEffect, useState } from "react";
import config from "./config.json";
import { useTokenHook } from "./hooks/use-token-contract-hook";
import { useWeb3ConnectionHook } from "./hooks/use-web3Connection-hook";
import "./App.css";

function App() {
  const {
    chainId,
    initialize: initializeWeb3,
  } = useWeb3ConnectionHook();
  const { initialize: initializeToken } = useTokenHook();
  const [isWeb3Initialized, setIsWeb3Initialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeWeb3();
      setIsWeb3Initialized(true);
    };
    init();
  }, [initializeWeb3]);

  useEffect(() => {
    //@ts-ignore
    if (isWeb3Initialized && chainId && config[chainId]?.wEAE) {
      //@ts-ignore
      initializeToken(config[chainId]?.wEAE?.address
      );
    }
  }, [isWeb3Initialized, chainId, initializeToken]);

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
