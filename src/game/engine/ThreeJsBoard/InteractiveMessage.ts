import { BoardObject, InteractiveObject } from "../Board/BoardObject";

export class InteractiveMessage
  extends BoardObject
  implements InteractiveObject
{
  private isActivated: boolean;
  private container: HTMLElement;
  private message: HTMLElement;
  setBoard(): void {}

  constructor(
    private html: string,
    private position: "topScreen" | "bottomScreen",
  ) {
    super();
    this.container = document.createElement("div");
    this.container.className = "interactive-message-container";
    this.message = document.createElement("div");
    this.message.className = "interactive-message-text";
    this.message.innerHTML = this.html;
    this.container.appendChild(this.message);
    this.isActivated = false;
  }

  activate() {
    if (!this.isActivated) {
      this.isActivated = true;

      document.body.appendChild(this.container);
    }
  }

  deactivate() {
    if (this.isActivated) {
      this.isActivated = false;
      this.container.remove();
    }
  }

  isActive() {
    return this.isActivated;
  }

  getObject() {
    return null;
  }

  update(delta: number) {}

  remove() {
    this.container.remove();
    this.message.innerHTML = "";
  }
}
