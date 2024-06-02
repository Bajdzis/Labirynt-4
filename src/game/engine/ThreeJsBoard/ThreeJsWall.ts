import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Wall } from "../Board/Wall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";

export class ThreeJsWall extends Wall implements ThreeJsBoardObject {
  private mesh: THREE.Group;
  private static wallGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  private static outlineGeometry = new THREE.PlaneGeometry(0.34, 0.34);

  constructor(resources: Resources, x: number, y: number) {
    super(x, y);

    this.mesh = new THREE.Group();
    const mesh = new THREE.Mesh(
      ThreeJsWall.wallGeometry,
      resources.material.wall,
    );
    this.mesh.add(mesh);
    const outlineMesh = new THREE.Mesh(
      ThreeJsWall.outlineGeometry,
      new THREE.MeshStandardMaterial({
        color: "#505050",
        roughness: 1,
        metalness: 0,
      }),
    );
    outlineMesh.position.z = 0.15;
    this.mesh.add(outlineMesh);

    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = 0.16;
    mesh.castShadow = true;
  }

  getObject() {
    return this.mesh;
  }
  update(): void {
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
  }
  setBoard(): void {
    // do nothing
  }
}
