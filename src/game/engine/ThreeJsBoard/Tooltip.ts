import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Timer } from "../Board/Timer";

export class Tooltip {
  private isShow: boolean = false;
  private lastState: boolean = false;
  private tip: CSS2DObject;
  private element: HTMLDivElement;
  private timer: Timer;

  constructor(text: string, x = 0, y = 0) {
    this.element = document.createElement("div");
    this.element.className = "label";
    this.element.innerHTML = text;
    this.tip = new CSS2DObject(this.element);
    this.tip.position.y = y;
    this.tip.position.x = x;
    this.tip.element.style.opacity = "0";
    this.tip.visible = this.isShow;
    this.timer = new Timer(
      500,
      () => {
        this.tip.visible = this.isShow;
        this.timer.stop();
      },
      false,
    );
  }

  getObject() {
    return this.tip;
  }

  showTip() {
    this.isShow = true;
  }

  hideTip() {
    this.isShow = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number) {
    this.timer.update(delta);
    if (this.lastState !== this.isShow) {
      this.lastState = this.isShow;
      if (this.isShow) {
        this.tip.visible = this.isShow;
      } else {
        this.timer.start();
      }
      this.tip.element.style.opacity = this.isShow ? "1" : "0";
    }
  }

  remove() {
    this.tip.parent?.remove(this.tip);
    this.element.style.display = "none";
    this.element.remove();
  }
}
