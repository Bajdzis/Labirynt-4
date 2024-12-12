import { IODevice } from "./IODevice";

let blockConstructor = false;

export class MobileGamepad extends IODevice {
  private isActiveValue: boolean = false;
  private actionButtonState: boolean = false;
  private axisX: number = 0;
  private axisY: number = 0;
  constructor() {
    if (blockConstructor) {
      throw new Error("This class can't create more instances");
    }
    super();
    const container = document.createElement("div");
    container.style.opacity = "0";

    document.body.appendChild(container);

    const showControls = (e: TouchEvent) => {
      e.preventDefault();

      if (!this.isActiveValue) {
        container.style.opacity = "1";
        this.isActiveValue = true;
        this.createRightSide().forEach((element) =>
          container.appendChild(element),
        );
        this.createLeftSide().forEach((element) =>
          container.appendChild(element),
        );
      }
    };
    document.body.addEventListener("touchstart", showControls, false);
  }

  getNameOfDevice(): "touchscreen" {
    return "touchscreen";
  }

  createLeftSide() {
    const leftArea = document.createElement("div");
    leftArea.style.position = "absolute";
    leftArea.style.left = "0";
    leftArea.style.top = "0";
    leftArea.style.bottom = "0";
    leftArea.style.width = "45%";

    document.body.appendChild(leftArea);

    let rect = leftArea.getBoundingClientRect();

    window.addEventListener("resize", () => {
      rect = leftArea.getBoundingClientRect();
    });

    const joystickBackground = document.createElement("div");
    joystickBackground.style.position = "absolute";
    joystickBackground.style.left = "100px";
    joystickBackground.style.top = "calc(100% - 200px)";
    joystickBackground.style.width = "100px";
    joystickBackground.style.height = "100px";
    joystickBackground.style.borderRadius = "50%";
    joystickBackground.style.backgroundColor = "rgba(255,255,255,0.5)";

    const joystickElement = document.createElement("div");
    joystickElement.style.position = "absolute";
    joystickElement.style.left = "0px";
    joystickElement.style.top = "0px";
    joystickElement.style.width = "80px";
    joystickElement.style.height = "80px";
    joystickElement.style.transform = "translate(10px, 10px)";
    joystickElement.style.borderRadius = "50%";
    joystickElement.style.backgroundColor = "rgba(255,255,255,0.5)";
    joystickBackground.style.pointerEvents = "none";
    joystickBackground.appendChild(joystickElement);
    const startPoint = { x: 0, y: 0 };
    leftArea.addEventListener(
      "touchstart",
      (e) => {
        const touch = this.getFirstTouchInsideRect(e.touches, rect);
        if (!touch) return;
        startPoint.x = touch.clientX;
        startPoint.y = touch.clientY;
        joystickBackground.style.left = `${touch.clientX - 50}px`;
        joystickBackground.style.top = `${touch.clientY - 50}px`;
      },
      {
        passive: true,
      },
    );
    leftArea.addEventListener(
      "touchmove",
      (e) => {
        const touch = this.getFirstTouchInsideRect(e.touches, rect);
        if (!touch) return;
        const currentPoint = { x: touch.clientX, y: touch.clientY };
        const deltaX = currentPoint.x - startPoint.x;
        const deltaY = currentPoint.y - startPoint.y;
        const distance = Math.sqrt(
          Math.abs(deltaX) ** 2 + Math.abs(deltaY) ** 2,
        );
        this.axisX = Math.min(1, Math.max(-1, deltaX / 30));
        this.axisY = Math.min(1, Math.max(-1, deltaY / 30)) * -1;

        if (distance > 30) {
          const angle = Math.atan2(deltaY, deltaX);
          joystickElement.style.left = `${Math.cos(angle) * 40}px`;
          joystickElement.style.top = `${Math.sin(angle) * 40}px`;
        } else {
          joystickElement.style.left = `${deltaX}px`;
          joystickElement.style.top = `${deltaY}px`;
        }
      },
      {
        passive: true,
      },
    );
    const stop = () => {
      joystickElement.style.left = "0px";
      joystickElement.style.top = "0px";
      this.axisX = 0;
      this.axisY = 0;
    };
    leftArea.addEventListener("touchend", stop);
    leftArea.addEventListener("touchcancel", stop);

    return [joystickBackground];
  }
  createRightSide() {
    const rightArea = document.createElement("div");
    rightArea.style.position = "absolute";
    rightArea.style.right = "0";
    rightArea.style.top = "0";
    rightArea.style.bottom = "0";
    rightArea.style.width = "45%";

    document.body.appendChild(rightArea);

    let rect = rightArea.getBoundingClientRect();
    window.addEventListener("resize", () => {
      rect = rightArea.getBoundingClientRect();
    });

    const button = document.createElement("div");
    button.style.position = "absolute";
    button.style.left = "calc(100% - 100px)";
    button.style.top = "calc(100% - 175px)";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "rgba(255,255,255,0.5)";
    button.style.pointerEvents = "none";

    rightArea.addEventListener(
      "touchstart",
      (e) => {
        const touch = this.getFirstTouchInsideRect(e.touches, rect);
        if (!touch) return;
        button.style.left = `${touch.clientX - 25}px`;
        button.style.top = `${touch.clientY - 25}px`;
        this.actionButtonState = true;

        button.style.backgroundColor = "rgba(255,255,255,0.75)";
      },
      {
        passive: true,
      },
    );

    const stop = () => {
      this.actionButtonState = false;
      button.style.backgroundColor = "rgba(255,255,255,0.5)";
    };
    rightArea.addEventListener("touchend", stop);
    rightArea.addEventListener("touchcancel", stop);

    return [button];
  }

  getFirstTouchInsideRect(touches: TouchList, rect: DOMRect) {
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      if (
        touch.clientX > rect.left &&
        touch.clientX < rect.right &&
        touch.clientY > rect.top &&
        touch.clientY < rect.bottom
      ) {
        return touch;
      }
    }
    return null;
  }

  isActive(): boolean {
    return this.isActiveValue;
  }

  isDown(): boolean {
    return this.actionButtonState;
  }

  getAxisX(): number {
    return this.axisX;
  }

  getAxisY(): number {
    return this.axisY;
  }

  runVibration(durationInMilliseconds: number): void {
    try {
      navigator.vibrate([durationInMilliseconds]);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  cancelVibration(): void {
    try {
      navigator.vibrate(0);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}

export const mobileGamepad = new MobileGamepad();

blockConstructor = true;
