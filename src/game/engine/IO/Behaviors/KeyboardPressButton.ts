import { KeyboardCode, keyboard } from "../Devices/Keyboard";
import { InputsNames } from "../Templates/InputTemplate";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class KeyboardPressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;
  constructor(private keyCode: KeyboardCode) {
    super(keyboard);
  }

  update(): void {
    const keyState = keyboard.isDown(this.keyCode);
    const isStateChanged = keyState !== this.lastKeyState;
    if (isStateChanged && keyState) {
      this.state = true;
    } else {
      this.state = null;
    }

    this.lastKeyState = keyState;
  }

  getIconsIds(): InputsNames[] {
    return [keyboard.getInputName(this.keyCode)];
  }
}
