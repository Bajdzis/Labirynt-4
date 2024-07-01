import { BoardObject, InteractiveObject } from "../../Board/BoardObject";
import { Timer } from "../../Board/Timer";

// Turn off after time expires
export class TimerControlTrigger
  extends BoardObject
  implements InteractiveObject
{
  private object: InteractiveObject;
  private isActivated: boolean;
  private timer: Timer;

  constructor(object: InteractiveObject, time: number) {
    super();
    this.object = object;
    this.timer = new Timer(time, this.deactivate.bind(this), false);
    this.isActivated = object.isActive();
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
    this.timer.reset();
    this.timer.start();
  }

  deactivate() {
    if (this.isActivated === false) {
      return;
    }
    this.object.deactivate();
    this.isActivated = false;
    this.timer.stop();
  }

  update(delta: number): void {
    this.timer.update(delta);
    if (this.object.isActive()) {
      this.activate();
    }
  }

  isActive() {
    return this.isActivated;
  }
}
