import * as THREE from "three";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { resources } from "../Resources/Resources";
import { Light } from "./Light";
import { boxParticles } from "../Particles/instances";

export class Cauldron implements ThreeJsBoardObject {
  private group: THREE.Group;
  private isActive: boolean = false;
  height: number;
  width: number;
  x: number;
  y: number;
  setBoard(): void {}

  private destroyParticles: (() => void)[];

  private light: Light | null;
  constructor(x: number, y: number) {
    this.light = null;

    this.x = x;
    this.y = y;
    this.width = 0.32;
    this.height = 0.32;
    this.group = new THREE.Group();
    this.destroyParticles = [];

    this.group.add(this.createMesh());
  }

  activate() {
    this.isActive = true;
    if (this.light === null) {
      this.light = new Light(6, false);
      this.light.changeLightColor("lightblue", 0.75);
      this.group.add(this.light.getObject());
      this.destroyParticles = [
        boxParticles.addGroupOfParticles({
          colorStart: new THREE.Color("lightblue"),
          colorStop: new THREE.Color("blue"),
          maxLife: 2000,
          numberOfParticles: 100,
          state: "active",
          type: {
            type: "circle",
            radius: 0.08,
            x: this.x,
            y: this.y,
          },
        }),
      ];
    }
  }

  deactivate() {
    this.isActive = false;
    this.destroyParticles.forEach((destroy) => destroy());
    if (this.light) {
      this.light.remove();
      this.light = null;
    }
  }

  toggle() {
    if (this.isActive) {
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
  }

  createMesh() {
    const keyGeometry = new THREE.PlaneGeometry(0.3, 0.3);

    const body = new THREE.Mesh(keyGeometry, resources.data.materials.cauldron);
    body.position.z = 0.01;
    return body;
  }

  remove() {
    this.group.parent?.remove(this.group);

    this.destroyParticles.forEach((destroy) => destroy());
    if (this.light) {
      this.light.remove();
    }
  }
}
