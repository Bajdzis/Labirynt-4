import { mouse } from "../Devices/Mouse";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class MouseAxisFromCenterScreenBehavior extends SourceOfControlBehavior<{
  x: number;
  y: number;
}> {
  constructor() {
    super(mouse);
  }

  update(): void {
    const leftButton = mouse.isDown("leftButton");
    if (!leftButton) {
      this.state = null;
      return;
    }
    const x = mouse.getAxisX();
    const y = mouse.getAxisY();
    if (x !== 0 || y !== 0) {
      this.state = { x, y };
    } else {
      this.state = null;
    }
  }
}
