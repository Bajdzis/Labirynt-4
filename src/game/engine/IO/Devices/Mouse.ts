import { IODevice } from "./IODevice";

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
  private htmlElementsState: WeakMap<HTMLElement | ParentNode, boolean> =
    new WeakMap();

  constructor() {
    super();
    window.addEventListener(
      "mousedown",
      (e) => {
        e.preventDefault();
        this.setElementState(e.target, true);
        this.buttonsState = e.buttons;
      },
      false,
    );

    window.addEventListener(
      "mouseup",
      (e) => {
        e.preventDefault();
        this.htmlElementsState = new WeakMap();
        this.buttonsState = e.buttons;
      },
      false,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private setElementState(element: any, isDown: boolean) {
    if (element instanceof HTMLElement) {
      let target: HTMLElement | ParentNode = element;
      this.htmlElementsState.set(target, isDown);
      while (target.parentNode) {
        target = target.parentNode;
        this.htmlElementsState.set(target, isDown);
      }
    }
  }

  getNameOfDevice(): "mouse" {
    return "mouse";
  }

  isDownElement(buttonCode: HTMLElement): boolean {
    return this.htmlElementsState.get(buttonCode) || false;
  }

  isDown(buttonCode: MouseButtonCode): boolean {
    return (mouseButtonCodeToNumber[buttonCode] & this.buttonsState) !== 0;
  }
}

export const mouse = new Mouse();
