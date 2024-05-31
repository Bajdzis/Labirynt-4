import * as THREE from "three";
import { Resources } from "../Resources/Resources";
const WIDTH_FLOOR = 30;
const HEIGHT_FLOOR = 30;

export class Floor {
  private group: THREE.Group;

  constructor(resources: Resources) {
    this.group = new THREE.Group();

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32 * WIDTH_FLOOR, 0.32 * HEIGHT_FLOOR),
      resources.material.floor,
    );
    floor.position.z = -0.01;
    this.group.add(floor);

    const floorShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32 * WIDTH_FLOOR, 0.32 * HEIGHT_FLOOR),
      resources.material.floorShadow,
    );

    floorShadow.receiveShadow = true;

    floorShadow.position.z = 0;
    this.group.add(floorShadow);
  }

  getFloor() {
    return this.group;
  }
}
