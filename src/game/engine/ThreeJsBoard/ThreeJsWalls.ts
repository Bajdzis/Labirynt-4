import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { wallGeometry, wallOutlineGeometry } from "../Resources/Geometries";
import { ThreeJsWall } from "./ThreeJsWall";

export class ThreeJsWalls {
  private group: THREE.Group = new THREE.Group();
  private wall: THREE.InstancedMesh;
  private outline: THREE.InstancedMesh;

  constructor(
    resources: Resources,
    private walls: ThreeJsWall[],
  ) {
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
    this.group.add(this.wall);
    this.group.add(this.outline);
  }

  setWalls(walls: ThreeJsWall[]) {
    this.walls = walls;
    this.wall.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.outline.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.wall.count = walls.length;
    this.outline.count = walls.length;
  }

  getObject() {
    return this.group;
  }
  update(): void {
    this.walls.forEach((wall, i) => {
      this.wall.setMatrixAt(i, wall.getMatrix());
      this.outline.setMatrixAt(i, wall.getMatrixOutline());
    });
    this.wall.instanceMatrix.needsUpdate = true;
    this.outline.instanceMatrix.needsUpdate = true;
  }
  setBoard(): void {
    // do nothing
  }
}
