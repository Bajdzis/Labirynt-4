// https://immersive-web.github.io/webxr-gamepads-module/#example-mappings
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

export type GamepadButtonCode = keyof typeof buttonNameToIndex;

class Gamepad {
  constructor(private index: number) {}

  getLayout(): "xbox" | "ps" {
    const gamepadId = this.getGamepad()?.id?.toLocaleLowerCase() || "";
    if (gamepadId.includes("xbox") || gamepadId.includes("xinput")) {
      return "xbox";
    }
    return "ps";
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
    return this.getAxis(3, false);
  }

  private getGamepad(): globalThis.Gamepad | null {
    return navigator.getGamepads()[this.index];
  }
}

export const gamepad0 = new Gamepad(0);
export const gamepad1 = new Gamepad(1);
// export const gamepad2 = new Gamepad(2);
// export const gamepad3 = new Gamepad(3);

export type GamepadInterface = typeof gamepad0;
