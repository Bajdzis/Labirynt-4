import { mouse, MouseButtonCode } from "../Devices/Mouse";
import { InputsNames } from "../Templates/InputTemplate";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class MousePressButton extends SourceOfControlBehavior<true> {
  private lastKeyState: boolean = false;
  constructor(private keyCode: MouseButtonCode) {
    super(mouse);
  }

  update(): void {
    const keyState = mouse.isDown(this.keyCode);
    const isStateChanged = keyState !== this.lastKeyState;
    if (isStateChanged && keyState) {
      this.state = true;
    } else {
      this.state = null;
    }

    this.lastKeyState = keyState;
  }

  getIconsIds(): InputsNames[] {
    return [mouse.getInputName(this.keyCode)];
  }
}
