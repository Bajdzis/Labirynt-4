import { GamepadInterface } from "../Gamepad";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export interface GamepadAxisBehaviorSettings {
  gamepad: GamepadInterface;
  axis: "left" | "right";
}

export class GamepadAxisBehavior extends SourceOfControlBehavior<{
  x: number;
  y: number;
}> {
  constructor(
    private gamepad: GamepadInterface,
    private axis: "left" | "right",
  ) {
    super();
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
