import { GamepadButtonCode, Gamepad } from "../Devices/Gamepad";
import { InputsNames } from "../Templates/InputTemplate";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class GamepadPressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;
  constructor(
    private gamepad: Gamepad,
    private keyCode: GamepadButtonCode,
  ) {
    super(gamepad);
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

  getIconsIds(): InputsNames[] {
    return [this.gamepad.getInputName(this.keyCode)];
  }
}
