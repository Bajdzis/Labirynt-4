import * as THREE from "three";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Light } from "./Light";
import { Tooltip } from "./Tooltip";
import { boxParticles } from "../Particles/instances";

export class Torch implements ThreeJsBoardObject {
  private group: THREE.Group;
  private light: Light;
  private tip: Tooltip;
  private destroyParticles: (() => void)[];
  height: number;
  width: number;
  x: number;
  y: number;
  setBoard(): void {}

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 0.24;
    this.height = 0.24;
    this.group = new THREE.Group();

    this.tip = new Tooltip("Pochodnia", 0, -0.16);
    this.group.add(this.tip.getObject());

    this.group.add(this.createTorchMesh());
    this.light = new Light(3);
    this.group.add(this.light.getObject());

    this.destroyParticles = [
      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("orange"),
        colorStop: new THREE.Color("red"),
        maxLife: 500,
        numberOfParticles: 10,
        state: "active",
        type: {
          type: "circle-center",
          radius: 0.02,
          x: x - 0.08,
          y: y + 0.08,
        },
      }),
      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("orange"),
        colorStop: new THREE.Color("red"),
        maxLife: 500,
        numberOfParticles: 10,
        state: "active",
        type: {
          type: "circle-center",
          radius: 0.02,
          x: x - 0.06,
          y: y + 0.06,
        },
      }),

      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("orange"),
        colorStop: new THREE.Color("yellow"),
        maxLife: 500,
        numberOfParticles: 10,
        state: "active",
        type: {
          type: "circle-center",
          radius: 0.02,
          x: x - 0.08,
          y: y + 0.08,
        },
      }),

      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("orange"),
        colorStop: new THREE.Color("yellow"),
        maxLife: 500,
        numberOfParticles: 10,
        state: "active",
        type: {
          type: "circle-center",
          radius: 0.02,
          x: x - 0.06,
          y: y + 0.06,
        },
      }),
    ];
  }

  getObject() {
    return this.group;
  }

  update(delta: number) {
    this.light.update(delta);
    this.group.position.x = this.x;
    this.group.position.y = this.y;
  }

  createTorchMesh() {
    const playerGeometry = new THREE.BoxGeometry(0.02, 0.24, 0.02);
    playerGeometry.rotateY(Math.PI / 4);
    playerGeometry.rotateZ(Math.PI / 4);

    const body = new THREE.Mesh(
      playerGeometry,
      new THREE.MeshStandardMaterial({ color: "brown" }),
    );
    body.receiveShadow = true;
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
    this.light.remove();
    this.destroyParticles.forEach((destroy) => destroy());
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }
}
