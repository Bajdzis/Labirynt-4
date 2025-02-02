import { customCursor } from "../HTMLAnimation/CustomCursor";

export abstract class GroupUI<T extends string> {
  private elements: HTMLButtonElement[] = [];
  protected container = document.createElement("div");

  abstract create(): { [key in T]: HTMLButtonElement };

  onFocusGroup = (callback: () => void) => {
    this.elements.forEach((button) => {
      button.addEventListener("focus", callback);
    });
  };

  createButton(text: string, buttonContainer: HTMLElement) {
    const container = document.createElement("div");
    const button = document.createElement("button");
    container.appendChild(button);
    button.classList.add("button");
    this.elements.push(button);
    button.innerText = text;
    buttonContainer.appendChild(container);

    customCursor.then((cursor) => {
      cursor.addClickableElement(button);
    });

    return button;
  }

  deleteButton(button: HTMLButtonElement) {
    const container = button.parentElement;
    container?.remove();
    this.elements = this.elements.filter((el) => el !== button);
    console.log(this);
  }

  getContainer() {
    return this.container;
  }

  runActiveElement() {
    this.elements.forEach((button) => {
      if (document.activeElement === button) {
        button.click();
      }
    });
  }

  focusNextElement() {
    const activeIndex = this.elements.findIndex(
      (button) => document.activeElement === button,
    );
    const nextIndex = activeIndex + 1;
    if (nextIndex < this.elements.length) {
      this.elements[nextIndex].focus();
    } else {
      this.elements[0].focus();
    }
  }

  focusPrevElement() {
    const activeIndex = this.elements.findIndex(
      (button) => document.activeElement === button,
    );
    const prevIndex = activeIndex - 1;
    if (prevIndex >= 0) {
      this.elements[prevIndex].focus();
    } else {
      this.elements[this.elements.length - 1].focus();
    }
  }

  isActiveGroup() {
    return this.elements.some((button) => document.activeElement === button);
  }

  protected cleanup() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const elements = this.elements;
    customCursor.then((cursor) => {
      elements.forEach((element) => {
        cursor.removeClickableElement(element);
      });
    });
    this.elements = [];
  }

  removeCurrent() {
    this.cleanup();
    this.container.remove();
    this.container = document.createElement("div");
  }
}
