export interface Renderers {
    [key: string]: Renderer;
}
export interface Renderer {
    (...args: any[]): any;
}
