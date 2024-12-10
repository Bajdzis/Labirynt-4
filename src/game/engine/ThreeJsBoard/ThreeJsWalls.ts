import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { wallGeometry, wallOutlineGeometry } from "../Resources/Geometries";
import { ThreeJsWall } from "./ThreeJsWall";

export class ThreeJsWalls {
  private group: THREE.Group;
  private wall: THREE.InstancedMesh;
  private outline: THREE.InstancedMesh;

  constructor(
    resources: Resources,
    public walls: ThreeJsWall[],
  ) {
    this.group = new THREE.Group();

    this.wall = new THREE.InstancedMesh(
      wallGeometry,
      resources.data.materials.wall,
      walls.length,
    );

    this.wall.castShadow = true;
    this.outline = new THREE.InstancedMesh(
      wallOutlineGeometry,
      resources.data.materials.wallOutline,
      walls.length,
    );
    this.updateMatrix();
    this.group.add(this.wall);
    this.group.add(this.outline);
  }

  getObject() {
    return this.group;
  }
  updateMatrix(): void {
    this.walls.forEach((wall, i) => {
      this.wall.setMatrixAt(i, wall.getMatrix());
      this.outline.setMatrixAt(i, wall.getMatrixOutline());
    });
    this.wall.instanceMatrix.needsUpdate = true;
    this.outline.instanceMatrix.needsUpdate = true;
  }
}
