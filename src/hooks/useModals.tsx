import React, { useContext, useState } from "react";
import { IModalController, IModalControllers, IRenderers } from "../interfaces";
import ModalController from "../models/ModalController";

const ModalContext = React.createContext<IModalControllers | null>({});

export const useModals = (): IModalControllers => useContext(ModalContext)!;

export const useModalProvider = (renderers: IRenderers): React.FC => {
  const [modalState, setModals] = useState<IModalControllers | null>(null);

  if (!modalState) {
    const modals: IModalControllers = {};
    Object.keys(renderers).forEach((name) => {
      const modal: IModalController = new ModalController(renderers[name]);
      modal.onUpdate = () => setModals({ ...modals });
      modals[name] = modal;
    });
    setModals(modals);
  }

  const renderModals =
    modalState &&
    Object.keys(modalState)
      .filter((name) => modalState[name].isActive)
      .map((name) => {
        const modal = modalState[name];
        const { render, options } = modal;
        return (
          <React.Fragment key={name}>
            {render(options, modal, modalState)}
          </React.Fragment>
        );
      });

  return ({ children }) => (
    <ModalContext.Provider value={modalState}>
      <React.Fragment>{children}</React.Fragment>
      <React.Fragment>{renderModals}</React.Fragment>
    </ModalContext.Provider>
  );
};
