import * as THREE from "three";
import { BoardObject } from "../Board/BoardObject";

export interface ThreeJsBoardObject extends BoardObject {
  getObject(): THREE.Object3D;
}
