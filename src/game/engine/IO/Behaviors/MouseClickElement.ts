import { mouse } from "../Devices/Mouse";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class MouseClickElement extends SourceOfControlBehavior<true> {
  private lastState: boolean = false;
  constructor(private element: HTMLElement) {
    super(mouse);
  }

  update(): void {
    const isDown = mouse.isDownElement(this.element);
    const isStateChanged = isDown !== this.lastState;
    if (isStateChanged && isDown === false) {
      this.state = true;
    } else {
      this.state = null;
    }

    this.lastState = isDown;
  }
}
