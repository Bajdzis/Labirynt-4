import { IODevice } from "./IODevice";
import { screen } from "./Screen";

interface TouchArea {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

export interface TouchPoint {
  x: number;
  y: number;
}

class TouchScreen extends IODevice {
  leftAreaTouchPoint: TouchPoint | null = null;
  rightAreaTouchPoint: TouchPoint | null = null;
  updateListeners: Set<() => void> = new Set();

  constructor() {
    super();

    const handler = (e: TouchEvent) => {
      this.onChangeTouch(e.touches);
    };
    window.addEventListener("touchstart", handler);
    window.addEventListener("touchmove", handler);
    window.addEventListener("touchend", handler);
    window.addEventListener("touchcancel", handler);
  }

  addUpdateListener(callback: () => void) {
    this.updateListeners.add(callback);
  }
  removeUpdateListener(callback: () => void) {
    this.updateListeners.delete(callback);
  }

  private onChangeTouch(touches: TouchList) {
    const leftArea = this.getLeftArea();
    const rightArea = this.getRightArea();

    this.leftAreaTouchPoint = this.getFirstTouchInsideArea(touches, leftArea);
    this.rightAreaTouchPoint = this.getFirstTouchInsideArea(touches, rightArea);

    this.updateListeners.forEach((listener) => listener());
  }

  private getLeftArea(): TouchArea {
    const { x, y } = screen.getSize();
    return { left: 0, right: x * 0.45, top: 0, bottom: y };
  }

  private getRightArea(): TouchArea {
    const { x, y } = screen.getSize();
    return { left: x * 0.55, right: x, top: 0, bottom: y };
  }

  private getFirstTouchInsideArea(
    touches: TouchList,
    rect: TouchArea,
  ): TouchPoint | null {
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      if (
        touch.clientX > rect.left &&
        touch.clientX < rect.right &&
        touch.clientY > rect.top &&
        touch.clientY < rect.bottom
      ) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }
    return null;
  }

  getNameOfDevice(): "screen" {
    return "screen";
  }
}

export const touchScreen = new TouchScreen();
