import { electronIntegration } from "../electron/electronIntegration";
import { BrowserGameLoop } from "./BrowserGameLoop";
import { customCursor } from "./HTMLAnimation/CustomCursor";
import { fadeAnimation } from "./HTMLAnimation/Fade";
import { ControlBehavior } from "./IO/Behaviors/ControlBehavior";
import { GamepadPressButton } from "./IO/Behaviors/GamepadPressButton";
import { KeyboardPressButton } from "./IO/Behaviors/KeyboardPressButton";
import { gamepad0, gamepad1, updateGamepads } from "./IO/Devices/Gamepad";
import { gameSavedStatus, MyGameStatus } from "./SavedStatus/GameSavedStatus";

export class MyMenu extends BrowserGameLoop {
  private runFocusedBehavior: ControlBehavior<true>;
  private nextElementBehavior: ControlBehavior<true>;
  private prevElementBehavior: ControlBehavior<true>;
  private isTouchDevice = navigator.maxTouchPoints > 0;
  private playButton: HTMLButtonElement | null = null;
  private playFormSavedStateButton: HTMLButtonElement | null = null;
  private showControlsButton: HTMLButtonElement | null = null;
  private authorsButton: HTMLButtonElement | null = null;
  private exitButton: HTMLButtonElement | null = null;
  private elements: HTMLButtonElement[] = [];

  constructor(private runGame: (status: MyGameStatus | null) => void) {
    super();
    this.runFocusedBehavior = new ControlBehavior([
      new KeyboardPressButton("Enter"),
      new GamepadPressButton(gamepad0, "PsCrossButton"),
      new GamepadPressButton(gamepad1, "PsCrossButton"),
    ]);
    this.nextElementBehavior = new ControlBehavior([
      new KeyboardPressButton("ArrowRight"),
      new KeyboardPressButton("ArrowDown"),
    ]);
    this.prevElementBehavior = new ControlBehavior([
      new KeyboardPressButton("ArrowLeft"),
      new KeyboardPressButton("ArrowUp"),
    ]);
    this.runNewGame = this.runNewGame.bind(this);
    this.runGameWithSavedState = this.runGameWithSavedState.bind(this);
    this.prepareScreenForMobileGame =
      this.prepareScreenForMobileGame.bind(this);
  }

  protected update(delta: number) {
    updateGamepads();
    this.runFocusedBehavior.update(delta);
    this.nextElementBehavior.update(delta);
    this.prevElementBehavior.update(delta);

    if (this.runFocusedBehavior.getState()) {
      this.elements.forEach((button) => {
        if (document.activeElement === button) {
          button.click();
        }
      });
    }

    if (this.nextElementBehavior.getState()) {
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

    if (this.prevElementBehavior.getState()) {
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
  }

  protected render() {}

  private runGameWithStatus = async (status: MyGameStatus | null) => {
    customCursor.then((cursor) => {
      cursor.removeClickableElement(this.playButton);
      cursor.removeClickableElement(this.playFormSavedStateButton);
      cursor.removeClickableElement(this.showControlsButton);
      cursor.removeClickableElement(this.authorsButton);
      cursor.showCursor("arrow");
    });

    fadeAnimation.prepare("main", "unVisible");
    await fadeAnimation.fadeOut("loader");

    this.runGame(status);

    await fadeAnimation.fadeIn("main");
  };

  async run() {
    const buttons = window.showTextInsteadOfProgressBar();
    this.playButton = buttons.playButton ?? null;
    this.playFormSavedStateButton = buttons.playFormSavedStateButton ?? null;
    this.showControlsButton = buttons.showControlsButton ?? null;
    this.authorsButton = buttons.authorsButton ?? null;
    this.exitButton = buttons.exitButton ?? null;

    if (electronIntegration.isAvailable()) {
      this.exitButton?.addEventListener("click", () => {
        electronIntegration.exit();
      });
    } else {
      this.exitButton?.parentElement?.remove();
      this.exitButton = null;
    }

    customCursor.then((cursor) => {
      cursor.showCursor("arrow");
      cursor.addClickableElement(this.playButton);
      cursor.addClickableElement(this.playFormSavedStateButton);
      cursor.addClickableElement(this.showControlsButton);
      cursor.addClickableElement(this.authorsButton);
      cursor.addClickableElement(this.exitButton);
    });

    if (this.playButton) {
      this.elements = [this.playButton];
      this.playButton.addEventListener("click", this.runNewGame);
    }
    const state = await gameSavedStatus.get();
    if (this.playFormSavedStateButton && state) {
      this.elements.push(this.playFormSavedStateButton);
      this.playFormSavedStateButton.focus();
    } else {
      this.playButton?.focus();
    }
    if (this.showControlsButton && this.authorsButton) {
      this.elements.push(this.showControlsButton, this.authorsButton);
    }

    if (this.playFormSavedStateButton) {
      this.playFormSavedStateButton.disabled = state === null;

      this.playFormSavedStateButton.addEventListener(
        "click",
        this.runGameWithSavedState,
      );
    }

    this.addTouchReactToButton(this.playButton);
    this.addTouchReactToButton(this.playFormSavedStateButton);

    super.run();
  }

  private addTouchReactToButton(button: HTMLButtonElement | null) {
    button &&
      button.addEventListener(
        "touchend",
        () => {
          this.isTouchDevice = true;
        },
        {
          passive: true,
        },
      );
  }

  async prepareScreenForMobileGame() {
    try {
      await document.documentElement.requestFullscreen();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (screen.orientation.lock) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        screen.orientation.lock("landscape");
      }
    } catch (error) {
      console.warn(error);
    }
  }

  private runNewGame = async () => {
    if (this.isTouchDevice) {
      await this.prepareScreenForMobileGame();
    }
    const state = await gameSavedStatus.get();
    if (state) {
      const confirmDeleteSave = confirm(
        "Czy chcesz usunąć zapisaną grę i rozpoczać nową?",
      );

      if (confirmDeleteSave) {
        this.runGameWithStatus(null);
      }
      return;
    }
    this.runGameWithStatus(null);
  };

  private runGameWithSavedState = async () => {
    if (this.isTouchDevice) {
      await this.prepareScreenForMobileGame();
    }
    const state = await gameSavedStatus.get();
    if (state) {
      this.runGameWithStatus(state);
    }
  };
}
