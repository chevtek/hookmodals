import { Renderer } from "../interfaces";

export interface Modals {
  [key: string]: Modal
}

export interface Modal {
  open: (...args: any[]) => Promise<void>
  close: (err?: Error) => void
  isVisible: boolean,
  render: Renderer,
  options?: {
    [key: string]: any
  },
  _promise?: {
    resolve: () => void
    reject: (err?: Error) => void
  }
}

export interface Visible {
  [key: string]: boolean
}
