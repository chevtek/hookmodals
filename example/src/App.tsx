import { useModalProvider } from "@chevtek/hookmodals";
import React from "react";
import "./App.css";

import Home from "./Home";

const modals = {
  message: () => <h1>HELLO, WORLD!</h1>
};

const App: React.FC = () => {
  const ModalContainer = useModalProvider(modals);

  return (
    <>
      <h1>My App</h1>
      <Home />
      <ModalContainer />
    </>
  );
};

export default App;
