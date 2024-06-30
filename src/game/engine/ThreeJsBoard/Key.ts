import * as THREE from "three";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Tooltip } from "./Tooltip";
import { boxParticles } from "../Particles/instances";
import { resources } from "../Resources/Resources";

export class Key implements ThreeJsBoardObject {
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
    this.x = x;
    this.y = y;
    this.name = name;
    this.width = 0.16;
    this.height = 0.16;
    this.group = new THREE.Group();

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

  update(delta: number) {
    this.group.position.x = this.x;
    this.group.position.y = this.y;
  }

  createMesh() {
    const keyGeometry = new THREE.BoxGeometry(0.16, 0.16, 0.16);

    const body = new THREE.Mesh(keyGeometry, resources.data.materials.key);
    body.receiveShadow = false;
    body.position.z = 0.01;
    return body;
  }

  showTip() {
    this.tip.element.style.opacity = "1";
  }

  hideTip() {
    this.tip.element.style.opacity = "0";
  }

  remove() {
    this.destroyParticles.forEach((destroy) => destroy());
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }
}
