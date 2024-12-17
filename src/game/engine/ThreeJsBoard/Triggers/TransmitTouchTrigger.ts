import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../../Board/BoardObject";
import { objectContainsOther } from "../../Utils/math/objectContainsOther";

export class TransmitTouchTrigger<T extends Rectangle>
  extends BoardObject
  implements InteractiveObject, Rectangle
{
  private isActivated: boolean;
  public width = 0.32;
  public height = 0.32;

  constructor(
    public x: number,
    public y: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private source: new (...args: any) => T,
    private target: InteractiveObject,
    private action: "activated" | "deactivated" | "both",
  ) {
    super();

    this.isActivated = false;
    if (this.isActivated) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    if (this.isActivated) {
      return;
    }
    this.isActivated = true;
    if (this.action === "both" || this.action === "activated") {
      this.target.activate();
    }
  }

  deactivate() {
    if (this.isActivated === false) {
      return;
    }
    this.isActivated = false;
    if (this.action === "both" || this.action === "deactivated") {
      this.target.deactivate();
    }
  }

  update(): void {
    if (
      this.board?.findObject(
        (obj) => obj instanceof this.source && objectContainsOther(this, obj),
      )
    ) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  isActive() {
    return this.isActivated;
  }
}
