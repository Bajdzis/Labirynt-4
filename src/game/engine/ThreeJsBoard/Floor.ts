import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
const WIDTH_FLOOR = 30;
const HEIGHT_FLOOR = 30;

export class Floor implements ThreeJsBoardObject {
  private object: THREE.Mesh;
  public x = 0;
  public y = 0;
  public readonly width = 0.32 * WIDTH_FLOOR;
  public readonly height = 0.32 * HEIGHT_FLOOR;

  constructor(resources: Resources) {
    this.object = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32 * WIDTH_FLOOR, 0.32 * HEIGHT_FLOOR),
      resources.material.floor,
    );
    this.object.receiveShadow = true;
    this.object.position.z = -0.01;
  }

  getObject() {
    return this.object;
  }

  update(): void {}
}
