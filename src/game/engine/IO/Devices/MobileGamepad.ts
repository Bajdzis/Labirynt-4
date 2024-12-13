import { IODevice } from "./IODevice";
import { TouchPoint, touchScreen } from "./TouchScreen";

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

    const showControls = () => {
      touchScreen.removeUpdateListener(showControls);
      this.isActiveValue = true;
      this.createRightSide().forEach((element) =>
        document.body.appendChild(element),
      );
      this.createLeftSide().forEach((element) =>
        document.body.appendChild(element),
      );
    };

    touchScreen.addUpdateListener(showControls);
  }

  getNameOfDevice(): "touchscreen" {
    return "touchscreen";
  }

  createLeftSide() {
    const joystickBackground = document.createElement("div");
    joystickBackground.style.position = "absolute";
    joystickBackground.style.left = "0";
    joystickBackground.style.top = "0";
    joystickBackground.style.transform =
      "translate(100px, calc(100vh - 200px))";
    joystickBackground.style.width = "100px";
    joystickBackground.style.height = "100px";
    joystickBackground.style.borderRadius = "50%";
    joystickBackground.style.backgroundColor = "rgba(255,255,255,0.5)";

    const joystickElement = document.createElement("div");
    joystickElement.style.position = "absolute";
    joystickElement.style.left = "10px";
    joystickElement.style.top = "10px";
    joystickElement.style.width = "80px";
    joystickElement.style.height = "80px";
    joystickElement.style.transform = "translate(0px, 0px)";
    joystickElement.style.borderRadius = "50%";
    joystickElement.style.backgroundColor = "rgba(255,255,255,0.5)";
    joystickBackground.style.pointerEvents = "none";
    joystickBackground.appendChild(joystickElement);
    let startPoint: TouchPoint | null = null;

    touchScreen.addUpdateListener(() => {
      const status = touchScreen.leftAreaTouchPoint;

      // start
      if (status !== null && startPoint === null) {
        startPoint = status;

        startPoint.x = status.x;
        startPoint.y = status.y;
        joystickBackground.style.transform = `translate(${status.x - 50}px, ${status.y - 50}px)`;
        // end
      } else if (status === null && startPoint !== null) {
        joystickElement.style.transform = "translate(0px, 0px)";
        this.axisX = 0;
        this.axisY = 0;
        startPoint = null;
        // move
      } else if (status !== null && startPoint !== null) {
        const currentPoint = status;
        const deltaX = currentPoint.x - startPoint.x;
        const deltaY = currentPoint.y - startPoint.y;
        const distance = Math.sqrt(
          Math.abs(deltaX) ** 2 + Math.abs(deltaY) ** 2,
        );
        this.axisX = Math.min(1, Math.max(-1, deltaX / 30));
        this.axisY = Math.min(1, Math.max(-1, deltaY / 30)) * -1;

        if (distance > 30) {
          const angle = Math.atan2(deltaY, deltaX);
          joystickElement.style.transform = `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`;
        } else {
          joystickElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      }
    });

    return [joystickBackground];
  }
  createRightSide() {
    const button = document.createElement("div");
    button.style.position = "absolute";
    button.style.left = "0";
    button.style.top = "0";
    button.style.transform =
      "translate(calc(100vw - 150px), calc(100vh - 175px))";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "rgba(255,255,255,0.5)";
    button.style.pointerEvents = "none";

    touchScreen.addUpdateListener(() => {
      const status = touchScreen.rightAreaTouchPoint;
      this.actionButtonState = status !== null;

      if (status === null) {
        button.style.backgroundColor = "rgba(255,255,255,0.5)";
      } else {
        const { x, y } = status;

        button.style.transform = `translate(${x - 25}px, ${y - 25}px)`;
        button.style.backgroundColor = "rgba(255,255,255,0.75)";
      }
    });

    return [button];
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

  runVibration(durationInMilliseconds: number, intensity: number): void {
    if (intensity < 0) {
      return;
    }
    const intensityInMilliseconds = (intensity / 2) * durationInMilliseconds;
    const numberOfVibrations = Math.floor(
      durationInMilliseconds / intensityInMilliseconds,
    );

    try {
      navigator.vibrate(
        new Array(numberOfVibrations).fill(intensityInMilliseconds),
      );
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
