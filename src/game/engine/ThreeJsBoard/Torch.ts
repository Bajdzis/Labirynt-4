import * as THREE from "three";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Light } from "./Light";

export class Torch implements ThreeJsBoardObject {
  private group: THREE.Group;
  private light: Light;
  height: number;
  width: number;
  x: number;
  y: number;
  setBoard(): void {}

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 0.3;
    this.height = 0.3;
    this.group = new THREE.Group();

    this.group.add(this.createTorchMesh());
    this.light = new Light(3);
    this.group.add(this.light.getObject());
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
    const playerGeometry = new THREE.BoxGeometry(0.03, 0.24, 0.03);
    playerGeometry.rotateY(Math.PI / 4);
    playerGeometry.rotateZ(Math.PI / 4);

    const body = new THREE.Mesh(
      playerGeometry,
      new THREE.MeshStandardMaterial({ color: "brown" }),
    );
    body.receiveShadow = true;
    body.position.z = 0.1;
    return body;
  }
}
