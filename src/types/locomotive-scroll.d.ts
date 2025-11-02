declare module "locomotive-scroll" {
  export default class LocomotiveScroll {
    constructor(options?: any);
    update(): void;
    destroy(): void;
    scrollTo(target: any, options?: any): void;
    start(): void;
    stop(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
  }
}
