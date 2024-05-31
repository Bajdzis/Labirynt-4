import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Wall } from "../Board/Wall";

export class ThreeJsWall extends Wall {
  private group: THREE.Group;
  private static wallGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  private static outlineGeometry = new THREE.PlaneGeometry(0.34, 0.34);

  constructor(resources: Resources, x: number, y: number) {
    super(x, y);

    this.group = new THREE.Group();
    const mesh = new THREE.Mesh(
      ThreeJsWall.wallGeometry,
      resources.material.wall,
    );
    this.group.add(mesh);
    const outlineMesh = new THREE.Mesh(
      ThreeJsWall.outlineGeometry,
      new THREE.MeshStandardMaterial({
        color: "#505050",
        roughness: 1,
        metalness: 0,
      }),
    );
    outlineMesh.position.z = 0.15;
    this.group.add(outlineMesh);

    this.group.position.x = this.x;
    this.group.position.y = this.y;
    this.group.position.z = 0.16;
    mesh.castShadow = true;
  }

  getWall() {
    return this.group;
  }
}
