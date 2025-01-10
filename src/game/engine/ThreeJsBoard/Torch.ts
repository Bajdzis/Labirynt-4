import * as THREE from "three";
import { Light } from "./Light";
import { Tooltip } from "./Tooltip";
import { boxParticles } from "../Particles/instances";
import { resources } from "../Resources/Resources";
import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../Board/BoardObject";

export class Torch extends BoardObject implements Rectangle, InteractiveObject {
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
    super();
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
    this.tip.update(delta);
    this.light.update(delta);
    this.group.position.x = this.x;
    this.group.position.y = this.y;
  }

  createTorchMesh() {
    const torchGeometry = new THREE.BoxGeometry(0.02, 0.24, 0.02);
    torchGeometry.rotateY(Math.PI / 4);
    torchGeometry.rotateZ(Math.PI / 4);

    const body = new THREE.Mesh(torchGeometry, resources.data.materials.torch);
    body.receiveShadow = true;
    body.position.z = 0.01;
    return body;
  }

  showTip() {
    this.tip.showTip();
  }

  hideTip() {
    this.tip.hideTip();
  }

  remove() {
    this.light.remove();
    this.destroyParticles.forEach((destroy) => destroy());
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }

  isActive() {
    // for WayNet to disable path for mummy
    return false;
  }
  activate() {}
  deactivate() {}
}
