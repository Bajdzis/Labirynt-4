import * as THREE from "three";
import { Wall } from "../Board/Wall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { random } from "../Utils/math/random";

export class ThreeJsWall extends Wall implements ThreeJsBoardObject {
  private matrix: THREE.Matrix4;
  private matrixOutline: THREE.Matrix4;

  constructor(x: number, y: number) {
    super(x, y);
    const position = new THREE.Vector3(this.x, this.y, 0.16);

    this.matrix = new THREE.Matrix4();
    const rotation = Math.floor(random(0, 6));
    if (rotation === 0) {
      this.matrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    } else if (rotation === 1) {
      this.matrix.makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    } else if (rotation === 2) {
      this.matrix.makeRotationAxis(new THREE.Vector3(-1, 0, 0), Math.PI / 2);
    } else if (rotation === 3) {
      this.matrix.makeRotationAxis(new THREE.Vector3(0, -1, 0), Math.PI / 2);
    } else if (rotation === 4) {
      this.matrix.makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI);
    }
    // else if(rotation === 5){
    //   // 0,0 0
    // }
    this.matrix.setPosition(position);

    this.matrixOutline = new THREE.Matrix4();
    this.matrixOutline.setPosition(position);
  }

  getMatrix(): THREE.Matrix4 {
    return this.matrix;
  }

  getMatrixOutline(): THREE.Matrix4 {
    return this.matrixOutline;
  }

  getObject() {
    return null;
  }
  update(): void {}
  setBoard(): void {
    // do nothing
  }
}
