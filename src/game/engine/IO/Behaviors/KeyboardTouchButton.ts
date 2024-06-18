import { KeyboardCode, keyboard } from "../Keyboard";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class KeyboardTouchButton extends SourceOfControlBehavior<true> {
  constructor(private keyCode: KeyboardCode) {
    super();
  }

  update(): void {
    this.state = keyboard.isDown(this.keyCode) ? true : null;
  }
}
