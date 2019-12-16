import React, { useContext } from "react";
import { Modals } from "../interfaces";

const ModalContext = React.createContext<Modals | null>(null);

export const ModalProvider = ModalContext.Provider;

export const useModalContext = () => useContext(ModalContext);
