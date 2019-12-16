import React from "react";
import { Renderers, Modals } from "../interfaces";
export declare const useModals: () => Modals;
export declare const useModalProvider: (renderers?: Renderers | undefined) => React.FC<{}>;
