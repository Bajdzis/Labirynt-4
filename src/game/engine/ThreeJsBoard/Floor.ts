import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
const WIDTH_FLOOR = 300;
const HEIGHT_FLOOR = 300;

export class Floor implements ThreeJsBoardObject {
  private object: THREE.Group;
  public x = 0;
  public y = 0;
  public readonly width = 0.32 * WIDTH_FLOOR;
  public readonly height = 0.32 * HEIGHT_FLOOR;

  constructor(resources: Resources) {
    this.object = new THREE.Group();

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32 * WIDTH_FLOOR, 0.32 * HEIGHT_FLOOR),
      resources.data.materials.floor,
    );

    this.object.add(floor);

    const floorShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32 * WIDTH_FLOOR, 0.32 * HEIGHT_FLOOR),
      resources.data.materials.floorShadow,
    );

    floorShadow.receiveShadow = true;

    floorShadow.position.z = 0.01;
    this.object.add(floorShadow);
  }

  getObject() {
    return this.object;
  }

  update(): void {}
  setBoard(): void {}
}
