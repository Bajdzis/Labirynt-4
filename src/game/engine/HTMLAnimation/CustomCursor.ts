import { fadeAnimation } from "./Fade";

export class CustomCursor {
  container = document.createElement("div");
  cursors: {
    arrow: HTMLImageElement;
    arrowAlt: HTMLImageElement;
    pointer: HTMLImageElement;
    waiting: HTMLImageElement;
  } | null = null;

  currentCursor = "";

  constructor(onReady: (instance: CustomCursor) => void) {
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.pointerEvents = "none";

    Promise.all([
      this.addCursorType("arrow", -4, -4),
      this.addCursorType("arrow-alt", 16, 16),
      this.addCursorType("pointer", -4, -10),
      this.addCursorType("waiting", -16, -16),
    ]).then(([arrow, arrowAlt, pointer, waiting]) => {
      this.cursors = {
        arrow,
        arrowAlt,
        pointer,
        waiting,
      };

      const startup = (e: MouseEvent) => {
        document.body.classList.add("cursor-none");
        style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        window.removeEventListener("mousemove", startup);
        this.showCursor("arrow");
        onReady(this);
      };
      window.addEventListener("mousemove", startup);

      const style = this.container.style;
      window.addEventListener(
        "mousemove",
        (e: MouseEvent) => {
          style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        },
        {
          passive: true,
        },
      );
      //   document.addEventListener("mouseout", () => {
      //     this.hideCursor();
      //   });
      document.body.appendChild(this.container);
    });
  }

  showCursor(type: "arrow" | "arrowAlt" | "pointer" | "waiting") {
    if (!this.cursors) {
      return;
    }

    if (this.currentCursor === type) {
      return;
    }
    Object.values(this.cursors).forEach((cursor) => {
      cursor.style.opacity = "0";
    });
    this.cursors[type].style.opacity = "1";
    this.currentCursor = type;
  }

  hideCursor() {
    const id = `cursor-${this.currentCursor}`;
    fadeAnimation.fadeOut(id);
    const handler = () => {
      fadeAnimation.fadeIn(id);
      window.removeEventListener("mousemove", handler);
    };
    window.addEventListener("mousemove", handler);
  }

  private clickableElementDestroy: WeakMap<HTMLElement, () => void> =
    new WeakMap();

  addClickableElement(element: HTMLElement) {
    const handlerEnter = () => {
      element.focus();
      this.showCursor("pointer");
    };
    const handlerLeave = () => {
      this.showCursor("arrow");
    };
    element.addEventListener("mouseenter", handlerEnter);
    element.addEventListener("mouseleave", handlerLeave);

    this.clickableElementDestroy.set(element, () => {
      element.removeEventListener("mouseenter", handlerEnter);
      element.removeEventListener("mouseleave", handlerLeave);
      this.showCursor("arrow");
    });
  }

  removeClickableElement(element: HTMLElement) {
    const destroy = this.clickableElementDestroy.get(element);
    if (destroy) {
      destroy();
    }
  }

  private addCursorType(
    type: "arrow" | "arrow-alt" | "pointer" | "waiting",
    top: number = 0,
    left: number = 0,
  ): Promise<HTMLImageElement> {
    return new Promise((resolve) => {
      const cursorImg = document.createElement("img");
      cursorImg.id = `cursor-${type}`;
      cursorImg.style.position = "absolute";
      cursorImg.style.top = `${top}px`;
      cursorImg.style.left = `${left}px`;
      cursorImg.style.opacity = "0";
      cursorImg.style.width = "32px";
      cursorImg.style.height = "32px";
      cursorImg.src = `/resources/ui/cursor/${type}.png`;
      cursorImg.onload = () => {
        resolve(cursorImg);
      };
      this.container.appendChild(cursorImg);
    });
  }
}

export const customCursor = new Promise<CustomCursor>((resolve) => {
  new CustomCursor(resolve);
});
