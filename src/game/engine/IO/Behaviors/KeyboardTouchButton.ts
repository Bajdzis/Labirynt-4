import { KeyboardCode, keyboard } from "../Devices/Keyboard";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class KeyboardTouchButton extends SourceOfControlBehavior<true> {
  constructor(private keyCode: KeyboardCode) {
    super(keyboard);
  }

  update(): void {
    this.state = keyboard.isDown(this.keyCode) ? true : null;
  }
}
