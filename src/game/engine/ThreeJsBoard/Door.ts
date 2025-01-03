import * as THREE from "three";
import { Tooltip } from "./Tooltip";
import { resources } from "../Resources/Resources";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../Board/BoardObject";
import { lightsHelper } from "./LightsHelper";

export class Door extends BoardObject implements Rectangle, InteractiveObject {
  private group: THREE.Group;
  private left: THREE.Group;
  private right: THREE.Group;
  private tip: Tooltip;
  private isActivated: boolean = false;
  height: number;
  width: number;
  x: number;
  y: number;
  keyName: string | null = null;
  setBoard(): void {}

  constructor(
    x: number,
    y: number,
    keyName: string | null = null,
    private position: "vertical" | "horizontal" = "horizontal",
  ) {
    super();

    this.keyName = keyName;

    this.group = new THREE.Group();
    if (position === "vertical") {
      this.group.rotation.z = Math.PI / 2;
      this.x = x + 0.07;
      this.y = y;
      this.width = 0.18;
      this.height = 0.32;
    } else {
      this.group.rotation.z = 0;
      this.x = x;
      this.y = y + 0.07;
      this.width = 0.32;
      this.height = 0.18;
    }

    this.tip = new Tooltip("Drzwi", 0, -0.48);
    this.group.add(this.tip.getObject());

    this.left = this.createMesh();
    this.right = this.createMesh();
    this.right.position.x = 0.16;
    this.left.position.x = -0.16;
    if (position === "vertical") {
      this.right.position.y = 0.07;
      this.left.position.y = 0.07;
    } else {
      this.right.position.y = -0.07;
      this.left.position.y = -0.07;
    }
    this.group.add(this.left);
    this.group.add(this.right);
  }

  getBlockingRect(): Rectangle | null {
    if (this.isActivated) {
      return null;
    }
    if (this.position === "vertical") {
      return {
        height: this.height,
        width: 0.11,
        x: this.x + (this.width - 0.11) / 2,
        y: this.y,
      };
    } else {
      return {
        height: 0.11,
        width: this.width,
        x: this.x,
        y: this.y + (this.height - 0.11) / 2,
      };
    }
  }

  canMoveThrough(rect: Rectangle): boolean {
    const blockingRect = this.getBlockingRect();
    if (blockingRect && objectContainsOther(blockingRect, rect)) {
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
    this.tip.update(delta);
    this.group.position.x = this.x;
    this.group.position.y = this.y;
    const speed = (0.001875 / 3) * delta;
    if (this.isActivated && this.right.position.x !== 0.28) {
      this.right.position.x = Math.min(0.28, this.right.position.x + speed);
      this.left.position.x = -this.right.position.x;
      lightsHelper.updateShadows();
    } else if (!this.isActivated && this.right.position.x !== 0.16) {
      this.right.position.x = Math.max(0.16, this.right.position.x - speed);
      this.left.position.x = -this.right.position.x;
      lightsHelper.updateShadows();
    }
  }

  createMesh() {
    const keyGeometry = new THREE.BoxGeometry(0.32, 0.11, 0.3);

    const doorPart = new THREE.Mesh(keyGeometry, resources.data.materials.door);
    doorPart.position.z = 0.15;
    doorPart.castShadow = true;

    const doorPartShadow = new THREE.Mesh(
      keyGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
      }),
    );
    doorPartShadow.castShadow = true;
    doorPartShadow.position.z = 0.3;
    const group = new THREE.Group();

    group.add(doorPart);

    group.add(doorPartShadow);

    return group;
  }

  showTip() {
    this.tip.showTip();
  }

  hideTip() {
    this.tip.hideTip();
  }

  remove() {
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }

  getPosition(): "vertical" | "horizontal" {
    return this.position;
  }
}
