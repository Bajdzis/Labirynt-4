import { mobileGamepad } from "../Devices/MobileGamepad";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class MobileGamepadPressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;

  constructor() {
    super(mobileGamepad);
  }

  update(): void {
    const keyState = mobileGamepad.isDown();
    const isStateChanged = keyState !== this.lastKeyState;
    if (isStateChanged && keyState) {
      this.state = true;
    } else {
      this.state = null;
    }

    this.lastKeyState = keyState;
  }
}
