import { IODevice } from "./IODevice";
import { screen } from "./Screen";

export type MouseButtonCode =
  | "leftButton"
  | "centerButton"
  | "rightButton"
  | "forwardButton"
  | "backButton";

const mouseButtonCodeToNumber: Record<MouseButtonCode, number> = {
  leftButton: 1,
  centerButton: 4,
  rightButton: 2,
  forwardButton: 8,
  backButton: 16,
};

class Mouse extends IODevice {
  private buttonsState: number = 0;
  private currentEventTarget: EventTarget | null = null;
  private pointX: number = 0;
  private pointY: number = 0;

  constructor() {
    super();
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    window.addEventListener(
      "mousedown",
      (e) => {
        e.preventDefault();
        this.currentEventTarget = e.target;
        this.buttonsState = e.buttons;
      },
      false,
    );

    window.addEventListener(
      "mouseup",
      (e) => {
        e.preventDefault();
        this.currentEventTarget = null;
        this.buttonsState = e.buttons;
      },
      false,
    );
    window.addEventListener(
      "mousemove",
      (e) => {
        this.pointX = e.clientX;
        this.pointY = e.clientY;
      },
      {
        passive: true,
      },
    );
  }

  getPoint(): { x: number; y: number } {
    return { x: this.pointX, y: this.pointY };
  }

  getPercentagePoint(): { x: number; y: number } {
    const { x, y } = screen.getSize();
    return {
      x: this.pointX / x,
      y: this.pointY / y,
    };
  }

  getAxisX(): number {
    const { x, y } = screen.getSize();
    const maximumArea = Math.min(x, y) / 4;
    const value = this.pointX - x / 2;

    if (value > maximumArea) {
      return 1;
    } else if (value < -maximumArea) {
      return -1;
    }
    const final = value / maximumArea;
    return Math.abs(final) > 0.15 ? final : 0;
  }

  getAxisY(): number {
    const { x, y } = screen.getSize();
    const maximumArea = Math.min(x, y) / 4;
    const value = this.pointY - y / 2;

    if (value > maximumArea) {
      return -1;
    } else if (value < -maximumArea) {
      return 1;
    }
    const final = (value / maximumArea) * -1;
    return Math.abs(final) > 0.15 ? final : 0;
  }

  getNameOfDevice(): "mouse" {
    return "mouse";
  }

  isDownElement(buttonCode: HTMLElement): boolean {
    if (!this.currentEventTarget) {
      return false;
    }
    return (
      buttonCode === this.currentEventTarget ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      buttonCode.contains(this.currentEventTarget as any) ||
      false
    );
  }

  isDown(buttonCode: MouseButtonCode): boolean {
    return (mouseButtonCodeToNumber[buttonCode] & this.buttonsState) !== 0;
  }
}

export const mouse = new Mouse();
