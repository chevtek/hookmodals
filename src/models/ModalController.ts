import { IModalController, Renderer } from "../interfaces";

export default class ModalController implements IModalController {

  public options?: any;
  public isActive = false;

  private promise?: {
    resolve: (result?: any) => void;
    reject: (err?: any) => void;
  };

  constructor(public render: Renderer) {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.error = this.error.bind(this);
  }

  public onUpdate = () => null;

  public open<T>(options: any): Promise<T> {
    this.options = options;
    this.isActive = true;
    this.onUpdate();
    return new Promise<T>((resolve, reject) => {
      this.promise = { resolve, reject };
    });
  }

  public close(result?: any): void {
    this.isActive = false;
    this.onUpdate();
    if (!this.promise) {
      return;
    }
    this.promise.resolve(result);
    delete this.promise;
  }

  public error(err?: any): void {
    this.isActive = false;
    this.onUpdate();
    if (!this.promise) {
      return;
    }
    this.promise.reject(err);
    delete this.promise;
  }

}
