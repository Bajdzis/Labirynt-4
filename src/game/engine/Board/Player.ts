import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { KeyboardCode } from "../IO/Keyboard";
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
  protected board: ThreeJsBoard | null = null;
  protected numberOfTorches: number = 2;

  constructor(
    private moveBehavior: ControlBehavior<{ x: number; y: number }>,
    private actionBehavior: ControlBehavior<true>,
  ) {
    this.x = 0.06;
    this.y = 0.06;
  }

  setBoard(board: ThreeJsBoard): void {
    this.board = board;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  changePosition(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  update(delta: number): void {
    this.moveBehavior.update(delta);
    const movementState = this.moveBehavior.getState();
    if (movementState) {
      const step = 0.001875 * delta;
      const { x, y } = movementState;
      this.angle = Math.atan2(y, x);
      if (y !== 0) {
        this.board?.sendEvent({
          name: "changePlayerPosition",
          player: this,
          x: 0,
          y: y * step,
        });
      }

      if (x !== 0) {
        this.board?.sendEvent({
          name: "changePlayerPosition",
          player: this,
          x: x * step,
          y: 0,
        });
      }
    }
    this.actionBehavior.update(delta);
    const doAction = this.actionBehavior.getState();

    if (doAction) {
      this.board?.sendEvent({
        name: "doAction",
        player: this,
      });
    }
  }

  canPlayerThrowTorch() {
    return this.numberOfTorches > 0;
  }

  canPlayerGrabTorch() {
    return this.numberOfTorches < 2;
  }

  grabTorch() {
    this.numberOfTorches++;
  }

  throwTorch() {
    this.numberOfTorches--;
  }
}
