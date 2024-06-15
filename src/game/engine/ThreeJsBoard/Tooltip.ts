import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

export class Tooltip {
  private tip: CSS2DObject;
  public element: HTMLDivElement;

  constructor(text: string, x = 0, y = 0) {
    this.element = document.createElement("div");
    this.element.className = "label";
    this.element.innerHTML = text;
    this.tip = new CSS2DObject(this.element);
    this.tip.position.y = y;
    this.tip.position.x = x;
  }

  getObject() {
    return this.tip;
  }

  remove() {
    this.tip.parent?.remove(this.tip);
    this.element.style.display = "none";
    this.element.remove();
  }
}
