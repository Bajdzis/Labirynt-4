import { BoardObject, InteractiveObject } from "../../Board/BoardObject";

export class MergeControlTrigger
  extends BoardObject
  implements InteractiveObject
{
  private isActivated: boolean;

  constructor(
    private sources: InteractiveObject[],
    private target: InteractiveObject,
    private action: "activated" | "deactivated" | "both",
    private ordered: boolean = true,
  ) {
    super();

    this.isActivated = this.sources.every((source) => source.isActive());
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
    if (this.ordered) {
      let lastStatus = true;
      let numberOfChanges = 0;
      for (let i = 0; i < this.sources.length; i++) {
        if (this.sources[i].isActive() !== lastStatus) {
          lastStatus = !lastStatus;
          numberOfChanges++;
        }
      }

      if (numberOfChanges > 1) {
        this.sources.forEach((source) => source.deactivate());
      }
    }
    if (this.sources.every((source) => source.isActive())) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  isActive() {
    return this.isActivated;
  }
}
