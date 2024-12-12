import { KeyboardCode, keyboard } from "../Devices/Keyboard";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export interface KeyboardMovementKeys {
  top: KeyboardCode;
  left: KeyboardCode;
  bottom: KeyboardCode;
  right: KeyboardCode;
}

export class KeyboardMovement extends SourceOfControlBehavior<{
  x: number;
  y: number;
}> {
  constructor(private keyCodes: KeyboardMovementKeys) {
    super(keyboard);
  }

  update(): void {
    const keyTopIsDown = keyboard.isDown(this.keyCodes.top);
    const keyLeftIsDown = keyboard.isDown(this.keyCodes.left);
    const keyBottomIsDown = keyboard.isDown(this.keyCodes.bottom);
    const keyRightIsDown = keyboard.isDown(this.keyCodes.right);

    if (keyTopIsDown || keyLeftIsDown || keyBottomIsDown || keyRightIsDown) {
      const x = keyRightIsDown ? 1 : keyLeftIsDown ? -1 : 0;
      const y = keyTopIsDown ? 1 : keyBottomIsDown ? -1 : 0;
      this.state = { x, y };
    } else {
      this.state = null;
    }
  }
}
