import React, { useCallback, useState } from "react";
import { IModalController, IModalControllers, IRenderers } from "../interfaces";
import ModalController from "../models/ModalController";

let modalControllers: IModalControllers | null = null;

export const useModals = (): IModalControllers => modalControllers!;

export const useModalProvider = (renderers: IRenderers): React.FC => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  if (!modalControllers) {
    modalControllers = {};
    Object.keys(renderers).forEach((name) => {
      const modal: IModalController = new ModalController(renderers[name]);
      modal.onUpdate = () => forceUpdate();
      modalControllers![name] = modal;
    });
    forceUpdate();
  }

  const renderModals =
    modalControllers &&
    Object.keys(modalControllers)
      .filter((name) => modalControllers![name].isActive)
      .map((name) => {
        const modal = modalControllers![name];
        const { render, options } = modal;
        return (
          <React.Fragment key={name}>
            {render(options, modal, modalControllers || {})}
          </React.Fragment>
        );
      });

  return () => <React.Fragment>{renderModals}</React.Fragment>;
};
