import { Gamepad } from "../Devices/Gamepad";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export interface GamepadAxisBehaviorSettings {
  gamepad: Gamepad;
  axis: "left" | "right";
}

export class GamepadAxisBehavior extends SourceOfControlBehavior<{
  x: number;
  y: number;
}> {
  constructor(
    private gamepad: Gamepad,
    private axis: "left" | "right",
  ) {
    super(gamepad);
  }

  update(): void {
    if (this.axis === "left") {
      const x = this.gamepad.getLeftAxisX();
      const y = this.gamepad.getLeftAxisY();
      if (x !== 0 || y !== 0) {
        this.state = { x, y };
      } else {
        this.state = null;
      }
    } else if (this.axis === "right") {
      const x = this.gamepad.getRightAxisX();
      const y = this.gamepad.getRightAxisY();
      if (x !== 0 || y !== 0) {
        this.state = { x, y };
      } else {
        this.state = null;
      }
    }
  }
}
