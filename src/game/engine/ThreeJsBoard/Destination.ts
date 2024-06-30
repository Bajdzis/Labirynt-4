import * as THREE from "three";
import { Tooltip } from "./Tooltip";
import { boxParticles } from "../Particles/instances";
import { BoardObject, Rectangle } from "../Board/BoardObject";

export class Destination extends BoardObject implements Rectangle {
  private group: THREE.Group;
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
    this.width = 0.32;
    this.height = 0.32;
    this.group = new THREE.Group();
    this.group.position.x = this.x;
    this.group.position.y = this.y;
    this.tip = new Tooltip("Teleport", 0, -0.16);
    this.group.add(this.tip.getObject());

    this.destroyParticles = [
      boxParticles.addGroupOfParticles({
        colorStart: new THREE.Color("blue"),
        colorStop: new THREE.Color("white"),
        maxLife: 1000,
        numberOfParticles: 200,
        state: "active",
        type: {
          type: "circle",
          radius: 0.16,
          x: x,
          y: y,
        },
      }),
    ];
  }

  getObject() {
    return this.group;
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
    this.destroyParticles.forEach((destroy) => destroy());
    this.group.parent?.remove(this.group);
    this.tip.remove();
  }
}
