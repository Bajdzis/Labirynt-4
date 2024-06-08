import { keyboard, KeyboardCode } from "../Keyboard";
import { ThreeJsBoard } from "../ThreeJsBoard/ThreeJsBoard";
import { BoardObject } from "./BoardObject";

export interface PlayerKeys {
  top: KeyboardCode;
  left: KeyboardCode;
  bottom: KeyboardCode;
  right: KeyboardCode;
  action: KeyboardCode;
}

export class Player implements BoardObject {
  public x: number;
  public y: number;
  public readonly width = 0.2;
  public readonly height = 0.2;
  public angle = 0.0;
  private keyCodes: PlayerKeys;
  protected board: ThreeJsBoard | null = null;
  protected numberOfTorches: number = 2;

  constructor(keyCodes: PlayerKeys) {
    this.keyCodes = keyCodes;
    this.x = 0.06;
    this.y = 0.06;
  }

  setBoard(board: ThreeJsBoard): void {
    this.board = board;
  }

  changePosition(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  update(delta: number): void {
    const keyActionIsDown =
      keyboard.isChanged(this.keyCodes.action) &&
      keyboard.isDown(this.keyCodes.action);

    if (keyActionIsDown && this.numberOfTorches > 0) {
      this.numberOfTorches -= 1;
      this.board?.sendEvent({
        name: "throwTorch",
        player: this,
      });
    }
    const keyTopIsDown = keyboard.isDown(this.keyCodes.top);
    const keyLeftIsDown = keyboard.isDown(this.keyCodes.left);
    const keyBottomIsDown = keyboard.isDown(this.keyCodes.bottom);
    const keyRightIsDown = keyboard.isDown(this.keyCodes.right);

    if (keyTopIsDown || keyLeftIsDown || keyBottomIsDown || keyRightIsDown) {
      const step = 0.001875 * delta;
      const x = keyRightIsDown ? step : keyLeftIsDown ? -step : 0;
      const y = keyTopIsDown ? step : keyBottomIsDown ? -step : 0;

      this.angle = Math.atan2(y, x);
      if (y !== 0) {
        this.board?.sendEvent({
          name: "changePlayerPosition",
          player: this,
          x: 0,
          y: y,
        });
      }

      if (x !== 0) {
        this.board?.sendEvent({
          name: "changePlayerPosition",
          player: this,
          x: x,
          y: 0,
        });
      }
    }
  }
}
