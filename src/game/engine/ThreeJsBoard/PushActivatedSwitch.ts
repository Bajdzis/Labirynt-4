import * as THREE from "three";
import { resources } from "../Resources/Resources";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../Board/BoardObject";

export class PushActivatedSwitch
  extends BoardObject
  implements Rectangle, InteractiveObject
{
  private group: THREE.Group;
  private switch: THREE.Mesh;
  height: number;
  width: number;
  x: number;
  y: number;
  speed: number;
  private switchPosition: number;
  private isActivated: boolean;
  setBoard(): void {}

  constructor(
    x: number,
    y: number,
    activeTimeMs = 10000,
    private directionToPush:
      | "toTop"
      | "toBottom"
      | "toRight"
      | "toLeft" = "toLeft",
  ) {
    super();
    this.x = x;
    this.y = y;
    this.width = 0.32;
    this.height = 0.32;
    this.group = new THREE.Group();
    if (directionToPush === "toTop") {
      this.group.rotation.z = Math.PI / 2;
    }
    if (directionToPush === "toBottom") {
      this.group.rotation.z = -Math.PI / 2;
    }
    if (directionToPush === "toRight") {
      this.group.rotation.z = Math.PI;
    }

    this.isActivated = false;
    this.speed = 0.16 / activeTimeMs;

    this.switchPosition = -0.16;
    this.switch = this.createMesh();
    this.switch.position.x = this.switchPosition;
    this.group.add(this.switch);
  }

  getSwitchRect() {
    if (this.directionToPush === "toRight") {
      return {
        height: 0.11,
        width: 0.32,
        x: this.x - this.switchPosition,
        y: this.y + 0.05,
      };
    } else if (this.directionToPush === "toLeft") {
      return {
        height: 0.11,
        width: 0.32,
        x: this.x + this.switchPosition,
        y: this.y + 0.05,
      };
    } else if (this.directionToPush === "toTop") {
      return {
        height: 0.32,
        width: 0.11,
        x: this.x + 0.05,
        y: this.y + this.switchPosition,
      };
    }
    return {
      height: 0.32,
      width: 0.11,
      x: this.x + 0.05,
      y: this.y - this.switchPosition,
    };
  }

  private objectToCheckInteracts: Rectangle[] = [];

  interact(rect: Rectangle): boolean {
    this.objectToCheckInteracts.push(rect);

    return true;
  }

  activate() {
    if (!this.isActivated) {
      this.isActivated = true;
    }
  }

  deactivate() {
    if (this.isActivated) {
      this.isActivated = false;
    }
  }

  isActive() {
    return this.isActivated;
  }

  toggle() {
    if (this.isActivated) {
      this.deactivate();
    } else {
      this.activate();
    }
  }

  getObject() {
    return this.group;
  }

  update(delta: number) {
    this.group.position.x = this.x;
    this.group.position.y = this.y;
    const speed = this.speed * delta;

    let switchRect = this.getSwitchRect();
    if (
      this.objectToCheckInteracts.some((rect) =>
        objectContainsOther(switchRect, rect),
      )
    ) {
      this.activate();
      do {
        this.switchPosition = Math.max(-0.32, this.switchPosition - 0.01);
        switchRect = this.getSwitchRect();
      } while (
        this.switchPosition >= -0.31 &&
        this.objectToCheckInteracts.some((rect) =>
          objectContainsOther(switchRect, rect),
        )
      );
    } else {
      this.switchPosition = Math.min(-0.16, this.switchPosition + speed);
      const switchRect = this.getSwitchRect();
      if (
        this.objectToCheckInteracts.some((rect) =>
          objectContainsOther(switchRect, rect),
        )
      ) {
        this.switchPosition = Math.max(-0.32, this.switchPosition - speed);
      } else if (this.switchPosition === -0.16) {
        this.deactivate();
      }
    }
    this.switch.position.x = this.switchPosition;
  }

  createMesh() {
    const keyGeometry = new THREE.BoxGeometry(0.32, 0.11, 0.3);

    const body = new THREE.Mesh(keyGeometry, resources.data.materials.door);
    body.castShadow = true;
    body.position.z = 0.15;
    return body;
  }

  remove() {
    this.group.parent?.remove(this.group);
  }
}
