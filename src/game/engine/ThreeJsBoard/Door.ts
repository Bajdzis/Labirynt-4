import * as THREE from "three";
import { Tooltip } from "./Tooltip";
import { resources } from "../Resources/Resources";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../Board/BoardObject";

export class Door extends BoardObject implements Rectangle, InteractiveObject {
  private group: THREE.Group;
  private left: THREE.Mesh;
  private right: THREE.Mesh;
  private tip: Tooltip;
  private isActivated: boolean = false;
  height: number;
  width: number;
  x: number;
  y: number;
  keyName: string;
  setBoard(): void {}

  constructor(
    x: number,
    y: number,
    keyName: string,
    private position: "vertical" | "horizontal" = "horizontal",
  ) {
    super();
    this.x = x;
    this.y = y;
    this.keyName = keyName;
    this.width = 0.32;
    this.height = 0.32;
    this.group = new THREE.Group();
    if (position === "vertical") {
      this.group.rotation.z = Math.PI / 2;
    }

    this.tip = new Tooltip("Drzwi", 0, -0.48);
    this.group.add(this.tip.getObject());

    this.left = this.createMesh();
    this.right = this.createMesh();
    this.right.position.x = 0.16;
    this.left.position.x = -0.16;
    this.group.add(this.left);
    this.group.add(this.right);
  }

  canMoveThrough(rect: Rectangle): boolean {
    if (this.isActivated) {
      return true;
    }
    if (
      this.position === "horizontal" &&
      objectContainsOther(
        {
          height: 0.11,
          width: this.width,
          x: this.x,
          y: this.y + 0.05,
        },
        rect,
      )
    ) {
      return false;
    } else if (
      this.position === "vertical" &&
      objectContainsOther(
        {
          height: this.height,
          width: 0.11,
          x: this.x + 0.05,
          y: this.y,
        },
        rect,
      )
    ) {
      return false;
    }

    return true;
  }

  activate() {
    if (!this.isActivated) {
      this.isActivated = true;
      resources.data.sounds.door.play();
    }
  }

  deactivate() {
    if (this.isActivated) {
      this.isActivated = false;
      resources.data.sounds.door.play();
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
    const speed = (0.001875 / 3) * delta;
    if (this.isActivated && this.right.position.x !== 0.32) {
      this.right.position.x = Math.min(0.32, this.right.position.x + speed);
      this.left.position.x = -this.right.position.x;
    } else if (!this.isActivated && this.right.position.x !== 0.16) {
      this.right.position.x = Math.max(0.16, this.right.position.x - speed);
      this.left.position.x = -this.right.position.x;
    }
  }

  createMesh() {
    const keyGeometry = new THREE.BoxGeometry(0.32, 0.11, 0.3);

    const body = new THREE.Mesh(keyGeometry, resources.data.materials.door);
    body.castShadow = true;
    body.position.z = 0.15;
    return body;
  }

  showTip() {
    this.tip.element.style.opacity = "1";
  }

  hideTip() {
    this.tip.element.style.opacity = "0";
  }

  remove() {
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }
}
