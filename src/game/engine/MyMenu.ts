import { electronIntegration } from "../electron/electronIntegration";
import { BrowserGameLoop } from "./BrowserGameLoop";
import { customCursor } from "./HTMLAnimation/CustomCursor";
import { fadeAnimation } from "./HTMLAnimation/Fade";
import { ControlBehavior } from "./IO/Behaviors/ControlBehavior";
import { GamepadPressButton } from "./IO/Behaviors/GamepadPressButton";
import { KeyboardPressButton } from "./IO/Behaviors/KeyboardPressButton";
import { gamepad0, gamepad1, updateGamepads } from "./IO/Devices/Gamepad";
import { gameSavedStatus, MyGameStatus } from "./SavedStatus/GameSavedStatus";
import { AlertGroupUI } from "./UI/AlertGroupUI";
import { MenuGroupUI } from "./UI/MenuGroupUI";

export class MyMenu extends BrowserGameLoop {
  private cancelBehavior: ControlBehavior<true>;
  private runFocusedBehavior: ControlBehavior<true>;
  private nextElementBehavior: ControlBehavior<true>;
  private prevElementBehavior: ControlBehavior<true>;
  private isTouchDevice = navigator.maxTouchPoints > 0;
  private menuUI = new MenuGroupUI();
  private removeSavedGameAlertUI = new AlertGroupUI(
    "Czy chcesz usunąć zapisaną grę i rozpoczać nową?",
  );
  private closeAlertUI = new AlertGroupUI("Czy napewno chcesz wyjść z gry?");
  private activeGroup: MenuGroupUI | AlertGroupUI = this.menuUI;

  constructor(private runGame: (status: MyGameStatus | null) => void) {
    super();
    this.cancelBehavior = new ControlBehavior([
      new KeyboardPressButton("Escape"),
      new GamepadPressButton(gamepad0, "PsCircleButton"),
      new GamepadPressButton(gamepad1, "PsCircleButton"),
    ]);
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

    this.menuUI.onFocusGroup(() => {
      this.activeGroup = this.menuUI;
    });
    this.closeAlertUI.onFocusGroup(() => {
      this.activeGroup = this.closeAlertUI;
    });
    this.removeSavedGameAlertUI.onFocusGroup(() => {
      this.activeGroup = this.removeSavedGameAlertUI;
    });
  }

  protected update(delta: number) {
    updateGamepads();
    this.cancelBehavior.update(delta);
    this.runFocusedBehavior.update(delta);
    this.nextElementBehavior.update(delta);
    this.prevElementBehavior.update(delta);

    if (
      this.cancelBehavior.getState() &&
      (this.removeSavedGameAlertUI === this.activeGroup ||
        this.closeAlertUI === this.activeGroup)
    ) {
      this.activeGroup.removeCurrent();
    }

    if (this.runFocusedBehavior.getState()) {
      this.activeGroup.runActiveElement();
    }

    if (this.nextElementBehavior.getState()) {
      this.activeGroup.focusNextElement();
    }

    if (this.prevElementBehavior.getState()) {
      this.activeGroup.focusPrevElement();
    }
  }

  protected render() {}

  private runGameWithStatus = async (status: MyGameStatus | null) => {
    customCursor.then((cursor) => {
      cursor.showCursor("arrow");
    });

    fadeAnimation.prepare("main", "unVisible");
    await fadeAnimation.fadeOut("loader");

    this.runGame(status);

    await fadeAnimation.fadeIn("main");
  };

  async run() {
    window.showTextInsteadOfProgressBar(this.menuUI.getContainer());
    const menuButtons = this.menuUI.create();

    if (electronIntegration.isAvailable()) {
      menuButtons.exit.addEventListener("click", () => {
        const { accept, cancel } = this.closeAlertUI.create();
        document.body.appendChild(this.closeAlertUI.getContainer());

        cancel.focus();

        accept.addEventListener("click", () => {
          this.closeAlertUI.removeCurrent();
          electronIntegration.exit();
        });

        cancel.addEventListener("click", () => {
          this.closeAlertUI.removeCurrent();
        });
      });
    } else {
      this.menuUI.deleteButton(menuButtons.exit);
    }

    customCursor.then((cursor) => {
      cursor.showCursor("arrow");
    });

    if (menuButtons.play) {
      menuButtons.play.addEventListener("click", this.runNewGame);
    }
    const state = await gameSavedStatus.get();
    if (menuButtons.playFormSavedState && state) {
      menuButtons.playFormSavedState.focus();
    } else {
      menuButtons.play?.focus();
    }

    menuButtons.playFormSavedState.disabled = state === null;

    menuButtons.playFormSavedState.addEventListener(
      "click",
      this.runGameWithSavedState,
    );

    this.addTouchReactToButton(menuButtons.play);
    this.addTouchReactToButton(menuButtons.playFormSavedState);

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
      const { accept, cancel } = this.removeSavedGameAlertUI.create();
      document.body.appendChild(this.removeSavedGameAlertUI.getContainer());

      cancel.focus();

      accept.addEventListener("click", () => {
        this.removeSavedGameAlertUI.removeCurrent();
        this.runGameWithStatus(null);
      });

      cancel.addEventListener("click", () => {
        this.removeSavedGameAlertUI.removeCurrent();
      });
    } else {
      this.runGameWithStatus(null);
    }
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
