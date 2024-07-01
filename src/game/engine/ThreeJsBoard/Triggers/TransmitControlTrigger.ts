import { BoardObject, InteractiveObject } from "../../Board/BoardObject";

export class TransmitControlTrigger
  extends BoardObject
  implements InteractiveObject
{
  private isActivated: boolean;

  constructor(
    private source: InteractiveObject,
    private target: InteractiveObject,
    private action: "activated" | "deactivated" | "both",
  ) {
    super();

    this.isActivated = this.source.isActive();
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
    if (this.source.isActive()) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  isActive() {
    return this.isActivated;
  }
}
