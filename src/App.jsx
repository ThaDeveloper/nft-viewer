import { Provider, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Home from "./pages/Home";

const App = () => {
  // wagmi connectors initialization for metamask and walletconnect
  const connectors = () => {
    return [new InjectedConnector({ defaultChains })];
  };
  return (
    <Provider autoConnect connectors={connectors}>
      <Home></Home>
    </Provider>
  );
};

export default App;
