import { BoardObject, InteractiveObject } from "../../Board/BoardObject";

export class InvertTransmitTrigger
  extends BoardObject
  implements InteractiveObject
{
  private isActivated: boolean;

  constructor(
    initialStatus: boolean,
    private target: InteractiveObject,
    private action: "activated" | "deactivated" | "both",
  ) {
    super();

    this.isActivated = initialStatus;
  }

  activate() {
    if (this.isActivated === false) {
      return;
    }
    this.isActivated = false;
    if (this.action === "both" || this.action === "deactivated") {
      this.target.deactivate();
    }
  }

  deactivate() {
    if (this.isActivated) {
      return;
    }
    this.isActivated = true;
    if (this.action === "both" || this.action === "activated") {
      this.target.activate();
    }
  }

  update(): void {}

  isActive() {
    return !!this.isActivated;
  }
}
