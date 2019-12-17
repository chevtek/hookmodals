import { Renderer } from ".";

export interface IModalControllers {
  [key: string]: IModalController;
}

export interface IModalController {
  options?: any;
  isActive: boolean;
  render: Renderer;
  onUpdate: () => void;
  open<T>(options?: any): Promise<T>;
  close(result?: any): void;
  error(err?: any): void;
}
