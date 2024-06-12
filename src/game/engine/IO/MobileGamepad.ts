class MobileGamepad {
  private isActiveValue: boolean = false;
  private actionButtonState: boolean = false;
  private lastActionButtonState: boolean = false;
  private axisX: number = 0;
  private axisY: number = 0;
  constructor() {
    const container = document.createElement("div");
    container.style.opacity = "0";

    this.createRightSide().forEach((element) => container.appendChild(element));
    this.createLeftSide().forEach((element) => container.appendChild(element));
    document.body.appendChild(container);

    const showControls = () => {
      container.style.opacity = "1";
      window.removeEventListener("touchstart", showControls);
      this.isActiveValue = true;
    };
    window.addEventListener("touchstart", showControls, false);
  }
  createLeftSide() {
    const leftArea = document.createElement("div");
    leftArea.style.position = "absolute";
    leftArea.style.left = "0";
    leftArea.style.top = "0";
    leftArea.style.bottom = "0";
    leftArea.style.width = "45%";
    leftArea.style.overflow = "hidden";

    const joystickBackground = document.createElement("div");
    joystickBackground.style.position = "absolute";
    joystickBackground.style.left = "100px";
    joystickBackground.style.top = "calc(100% - 200px)";
    joystickBackground.style.width = "100px";
    joystickBackground.style.height = "100px";
    joystickBackground.style.borderRadius = "50%";
    joystickBackground.style.backgroundColor = "rgba(255,255,255,0.5)";

    const joystickElement = document.createElement("div");
    joystickElement.style.position = "absolute";
    joystickElement.style.left = "0px";
    joystickElement.style.top = "0px";
    joystickElement.style.width = "80px";
    joystickElement.style.height = "80px";
    joystickElement.style.transform = "translate(10px, 10px)";
    joystickElement.style.borderRadius = "50%";
    joystickElement.style.backgroundColor = "rgba(255,255,255,0.5)";
    joystickBackground.style.pointerEvents = "none";
    joystickBackground.appendChild(joystickElement);
    const startPoint = { x: 0, y: 0 };
    leftArea.addEventListener("touchstart", (e) => {
      const [touch] = e.touches;
      startPoint.x = touch.clientX;
      startPoint.y = touch.clientY;
      joystickBackground.style.left = `${touch.clientX - 50}px`;
      joystickBackground.style.top = `${touch.clientY - 50}px`;
    });
    leftArea.addEventListener("touchmove", (e) => {
      const [touch] = e.touches;
      const currentPoint = { x: touch.clientX, y: touch.clientY };
      const deltaX = currentPoint.x - startPoint.x;
      const deltaY = currentPoint.y - startPoint.y;
      const distance = Math.sqrt(Math.abs(deltaX) ** 2 + Math.abs(deltaY) ** 2);
      this.axisX = Math.min(1, Math.max(-1, deltaX / 30));
      this.axisY = Math.min(1, Math.max(-1, deltaY / 30)) * -1;

      if (distance > 30) {
        const angle = Math.atan2(deltaY, deltaX);
        joystickElement.style.left = `${Math.cos(angle) * 40}px`;
        joystickElement.style.top = `${Math.sin(angle) * 40}px`;
      } else {
        joystickElement.style.left = `${deltaX}px`;
        joystickElement.style.top = `${deltaY}px`;
      }
    });
    leftArea.addEventListener("touchend", () => {
      joystickElement.style.left = "0px";
      joystickElement.style.top = "0px";
      this.axisX = 0;
      this.axisY = 0;
    });

    return [leftArea, joystickBackground];
  }
  createRightSide() {
    const rightArea = document.createElement("div");
    rightArea.style.position = "absolute";
    rightArea.style.right = "0";
    rightArea.style.top = "0";
    rightArea.style.bottom = "0";
    rightArea.style.width = "45%";
    rightArea.style.overflow = "hidden";

    const button = document.createElement("div");
    button.style.position = "absolute";
    button.style.left = "calc(100% - 100px)";
    button.style.top = "calc(100% - 175px)";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "rgba(255,255,255,0.5)";
    button.style.pointerEvents = "none";

    rightArea.addEventListener("touchstart", (e) => {
      const [touch] = e.touches;
      button.style.left = `${touch.clientX - 25}px`;
      button.style.top = `${touch.clientY - 25}px`;
      this.actionButtonState = true;
      button.style.backgroundColor = "rgba(255,255,255,0.75)";
    });
    rightArea.addEventListener("touchend", () => {
      this.actionButtonState = false;
      button.style.backgroundColor = "rgba(255,255,255,0.5)";
    });

    return [rightArea, button];
  }

  isActive(): boolean {
    return this.isActiveValue;
  }

  isDown(): boolean {
    return this.actionButtonState;
  }

  isChanged(): boolean {
    const change = this.actionButtonState !== this.lastActionButtonState;
    this.lastActionButtonState = this.actionButtonState;
    return change;
  }

  getAxisX(): number {
    return this.axisX;
  }

  getAxisY(): number {
    return this.axisY;
  }
}

export const mobileGamepad = new MobileGamepad();
