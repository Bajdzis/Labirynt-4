import { KeyboardCode, keyboard } from "../Keyboard";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class KeyboardPressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;
  constructor(private keyCode: KeyboardCode) {
    super();
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
}
