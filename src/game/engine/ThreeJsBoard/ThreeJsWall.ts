import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Wall } from "../Board/Wall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";

export class ThreeJsWall extends Wall implements ThreeJsBoardObject {
  private mesh: THREE.Mesh;
  private static wallGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);

  constructor(resources: Resources, x: number, y: number) {
    super(x, y);

    this.mesh = new THREE.Mesh(
      ThreeJsWall.wallGeometry,
      resources.material.wall,
    );

    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = 0.16;
    this.mesh.castShadow = true;
  }

  getObject() {
    return this.mesh;
  }

  update(): void {
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
  }
}
