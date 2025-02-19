import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { ControlBehaviorGroup } from "../IO/Behaviors/ControlBehaviorGroup";
import { Gamepad } from "../IO/Devices/Gamepad";
import { KeyboardCode } from "../IO/Devices/Keyboard";
import { MobileGamepad } from "../IO/Devices/MobileGamepad";
import { Key } from "../ThreeJsBoard/Key";
import { BoardObject, Rectangle } from "./BoardObject";

export interface PlayerKeys {
  top: KeyboardCode;
  left: KeyboardCode;
  bottom: KeyboardCode;
  right: KeyboardCode;
  action: KeyboardCode;
}

export class Player extends BoardObject implements Rectangle {
  public x: number;
  public y: number;
  protected isDead: boolean = false;
  public readonly width = 0.2;
  public readonly height = 0.2;
  public angle = 0.0;
  protected numberOfTorches: number = 2;
  private doorKeys: string[] = [];
  private allBehavior: ControlBehaviorGroup;

  constructor(
    private moveBehavior: ControlBehavior<{ x: number; y: number }>,
    private actionBehavior: ControlBehavior<true>,
  ) {
    super();
    this.allBehavior = new ControlBehaviorGroup([moveBehavior, actionBehavior]);
    this.x = 0.06;
    this.y = 0.06;
  }

  isAlive() {
    return !this.isDead;
  }

  kill() {
    this.isDead = true;

    for (let i = 0; i < this.numberOfTorches; i++) {
      this.board?.sendEvent({
        name: "throwTorch",
        player: this,
      });
    }
    this.numberOfTorches = 0;
  }

  runVibration(duration: number, intensity: number) {
    const device = this.allBehavior.getLastUsedDevice();
    if (device instanceof MobileGamepad) {
      device.runVibration(duration, intensity);
    } else if (device instanceof Gamepad) {
      device.runVibration(duration, Math.max(0.1, intensity - 0.3), intensity);
    }
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

  pickKey(key: Key) {
    this.doorKeys.push(key.name);
  }

  haveKey(keyName: string | null) {
    if (keyName === null) {
      return false;
    }
    return this.doorKeys.includes(keyName);
  }

  clearKeys() {
    this.doorKeys = [];
  }

  grabTorch() {
    this.numberOfTorches++;
  }

  throwTorch() {
    this.numberOfTorches--;
  }

  getNumberOfTorches() {
    return this.numberOfTorches;
  }

  setNumberOfTorches(numberOfTorches: number) {
    this.numberOfTorches = Math.max(0, Math.min(2, numberOfTorches));
  }
}
