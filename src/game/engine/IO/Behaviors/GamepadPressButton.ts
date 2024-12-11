import { GamepadButtonCode, GamepadInterface } from "../Gamepad";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class GamepadPressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;
  constructor(
    private gamepad: GamepadInterface,
    private keyCode: GamepadButtonCode,
  ) {
    super();
  }

  update(): void {
    const keyState = this.gamepad.isDown(this.keyCode);
    const isStateChanged = keyState !== this.lastKeyState;
    if (isStateChanged && keyState) {
      this.state = true;
    } else {
      this.state = null;
    }

    this.lastKeyState = keyState;
  }
}
