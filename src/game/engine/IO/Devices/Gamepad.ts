// https://immersive-web.github.io/webxr-gamepads-module/#example-mappings

import { IODevice } from "./IODevice";

// https://w3c.github.io/gamepad/#remapping
const buttonNameToIndex = {
  XboxAButton: 0,
  PsCrossButton: 0,
  XboxBButton: 1,
  PsCircleButton: 1,
  XboxXButton: 2,
  PsSquareButton: 2,
  XboxYButton: 3,
  PsTriangleButton: 3,
  left1: 4,
  leftButton: 4,
  right1: 5,
  rightButton: 5,
  left2: 6,
  leftTrigger: 6,
  right2: 7,
  rightTrigger: 7,
  center1: 8,
  shareButton: 8,
  selectButton: 8,
  center2: 9,
  optionButton: 9,
  startButton: 9,
  left3: 10,
  leftStick: 10,
  right3: 11,
  rightStick: 11,
  DPadTop: 12,
  DPadBottom: 13,
  DPadLeft: 14,
  DPadRight: 15,
  center3: 16,
  center4: 17,
} as const;

export type GamepadInputsNames =
  | `${"xbox-gamepad" | "ps-gamepad"}.${(typeof buttonNameToIndex)[keyof typeof buttonNameToIndex]}`
  | GamepadAxisNames;

export type GamepadAxisNames =
  `${"xbox-gamepad" | "ps-gamepad"}.${"left" | "right"}`;

export type GamepadButtonCode = keyof typeof buttonNameToIndex;

let gamepadsStatus = navigator.getGamepads();

let blockConstructor = false;
export class Gamepad extends IODevice {
  constructor(private index: number) {
    if (blockConstructor) {
      throw new Error("Gamepad constructor is blocked");
    }
    super();
  }

  static getInputName(
    pad: "xbox-gamepad" | "ps-gamepad",
    buttonCode: GamepadButtonCode,
  ): GamepadInputsNames {
    return `${pad}.${buttonNameToIndex[buttonCode]}`;
  }

  static getAxisName(
    pad: "xbox-gamepad" | "ps-gamepad",
    axis: "left" | "right",
  ): GamepadAxisNames {
    return `${pad}.${axis}`;
  }

  getInputName(buttonCode: GamepadButtonCode): GamepadInputsNames {
    return Gamepad.getInputName(this.getNameOfDevice(), buttonCode);
  }

  getAxisName(axis: "left" | "right"): GamepadAxisNames {
    return Gamepad.getAxisName(this.getNameOfDevice(), axis);
  }

  getNameOfDevice(): "xbox-gamepad" | "ps-gamepad" {
    const gamepadId = this.getGamepad()?.id?.toLocaleLowerCase() || "";
    if (gamepadId.includes("xbox") || gamepadId.includes("xinput")) {
      return "xbox-gamepad";
    }
    return "ps-gamepad";
  }

  isDown(buttonCode: GamepadButtonCode): boolean {
    return !!this.getGamepad()?.buttons[buttonNameToIndex[buttonCode]].pressed;
  }

  private getAxis(axisIndex: number, reverse: boolean): number {
    const gamepad = this.getGamepad();
    if (gamepad) {
      const value = gamepad.axes[axisIndex];
      if (Math.abs(value) > 0.15) {
        return value * (reverse ? -1 : 1);
      }
      return 0;
    }

    return 0;
  }

  getLeftAxisY(): number {
    return this.getAxis(1, true);
  }

  getLeftAxisX(): number {
    return this.getAxis(0, false);
  }

  getRightAxisY(): number {
    return this.getAxis(3, true);
  }

  getRightAxisX(): number {
    return this.getAxis(2, false);
  }

  async runVibration(
    durationInMilliseconds: number,
    weak: number = 0.1,
    strong: number = 0.4,
  ): Promise<void> {
    try {
      const gamepad = this.getGamepad();
      if (gamepad?.vibrationActuator) {
        await gamepad.vibrationActuator.playEffect("dual-rumble", {
          duration: durationInMilliseconds,
          weakMagnitude: weak,
          strongMagnitude: strong,
        });
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  cancelVibration(): void {
    try {
      const gamepad = this.getGamepad();
      if (gamepad?.vibrationActuator) {
        gamepad.vibrationActuator.reset();
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  private getGamepad(): globalThis.Gamepad | null {
    const gamepad = gamepadsStatus[this.index];
    if (gamepad?.mapping === "standard") {
      return gamepad;
    }

    return null;
  }
}

export const updateGamepads = () => {
  gamepadsStatus = navigator.getGamepads();
};

export const gamepad0 = new Gamepad(0);
export const gamepad1 = new Gamepad(1);
export const gamepad2 = new Gamepad(2);
export const gamepad3 = new Gamepad(3);
blockConstructor = true;
