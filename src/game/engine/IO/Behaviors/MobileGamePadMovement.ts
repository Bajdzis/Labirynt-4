import { mobileGamepad } from "../MobileGamepad";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class MobileGamePadMovement extends SourceOfControlBehavior<{
  x: number;
  y: number;
}> {
  constructor() {
    super();
  }

  update(): void {
    if (mobileGamepad.isActive()) {
      const x = mobileGamepad.getAxisX();
      const y = mobileGamepad.getAxisY();
      if (x !== 0 || y !== 0) {
        this.state = { x, y };
        return;
      }
    }
    this.state = null;
  }
}
