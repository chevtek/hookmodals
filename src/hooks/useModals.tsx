import React, { useState } from "react";
import { Renderers, Modals, Visible } from "../interfaces";

let modalStore: Modals | null = null;

export const useModals = (): Modals => modalStore || {};

export const useModalProvider = (renderers?: Renderers): React.FC => {
  const [visible, setVisible] = useState<Visible>({});

  if (!modalStore && renderers) {
    const modals: Modals = {};
    for (const name in renderers) {
      visible[name] = false;
      modals[name] = {
        isVisible: false,
        open: function(options) {
          this.options = options;
          this.isVisible = visible[name] = true;
          setVisible({ ...visible });
          return new Promise<void>((resolve, reject) => {
            this._promise = { resolve, reject };
          });
        },
        close: function(err) {
          this.isVisible = visible[name] = false;
          setVisible({ ...visible });
          if (!this._promise) return;
          if (err) return this._promise.reject(err);
          this._promise.resolve();
        },
        render: renderers[name]
      };
    }
    setVisible(visible);
    modalStore = modals;
  }

  const renderModals = () =>
    modalStore && Object.keys(modalStore)
      .filter((name) => visible[name])
      .map((name) => {
        const { render, options, close } = modalStore![name];
        return (
          <React.Fragment key={name}>{render(options, close, modalStore)}</React.Fragment>
        );
      });

  return () => <div>{renderModals()}</div>;
};
