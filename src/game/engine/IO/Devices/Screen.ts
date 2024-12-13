import { IODevice } from "./IODevice";

class Screen extends IODevice {
  private sizeX: number = window.innerWidth;
  private sizeY: number = window.innerHeight;

  constructor() {
    super();
    window.addEventListener(
      "resize",
      () => {
        this.sizeX = window.innerWidth;
        this.sizeY = window.innerHeight;
      },
      false,
    );
  }

  getSize(): { x: number; y: number } {
    return { x: this.sizeX, y: this.sizeY };
  }

  getNameOfDevice(): "screen" {
    return "screen";
  }
}

export const screen = new Screen();
