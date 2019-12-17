import { useModals } from "@chevtek/hookmodals";
import React from "react";

const Home: React.FC = () => {
  const { message } = useModals();

  const toggleModal = () => {
    if (message.isActive) {
      message.close();
    } else {
      message.open();
    }
  }

  return (<button onClick={toggleModal}>Show Message</button>);
};

export default Home;
