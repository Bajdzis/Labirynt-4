import * as THREE from "three";
import { Tooltip } from "./Tooltip";
import { boxParticles } from "../Particles/instances";
import { resources } from "../Resources/Resources";
import { BoardObject, Rectangle } from "../Board/BoardObject";

export class Key extends BoardObject implements Rectangle {
  private group: THREE.Group;
  private tip: Tooltip;
  private destroyParticles: (() => void)[];
  height: number;
  width: number;
  x: number;
  y: number;
  name: string;
  setBoard(): void {}

  constructor(x: number, y: number, name: string) {
    super();
    this.x = x;
    this.y = y;
    this.name = name;
    this.width = 0.16;
    this.height = 0.16;
    this.group = new THREE.Group();

    this.group.position.x = this.x;
    this.group.position.y = this.y;
    this.tip = new Tooltip("Klucz", 0, -0.16);
    this.group.add(this.tip.getObject());

    this.group.add(this.createMesh());

    this.destroyParticles = [
      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("yellow"),
        colorStop: new THREE.Color("white"),
        maxLife: 5000,
        numberOfParticles: 12,
        state: "active",
        type: {
          type: "rectangle",
          height: 0.1,
          width: 0.1,
          x: x,
          y: y,
        },
      }),
    ];
  }

  getObject() {
    return this.group;
  }

  createMesh() {
    const keyGeometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);

    const body = new THREE.Mesh(keyGeometry, resources.data.materials.key);
    body.receiveShadow = false;
    body.position.z = 0.01;
    return body;
  }

  showTip() {
    this.tip.showTip();
  }

  hideTip() {
    this.tip.hideTip();
  }

  update(delta: number): void {
    this.tip.update(delta);
  }

  remove() {
    this.destroyParticles.forEach((destroy) => destroy());
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }
}
