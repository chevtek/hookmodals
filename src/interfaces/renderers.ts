import { IModalController, IModalControllers } from ".";

export interface IRenderers {
  [key: string]: Renderer;
}

export type Renderer = (options: any, modal: IModalController, modals: IModalControllers) => any;
