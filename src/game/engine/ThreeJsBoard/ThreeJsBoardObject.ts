import * as THREE from "three";
import { BoardObject } from "../Board/BoardObject";
import { ThreeJsBoard } from "./ThreeJsBoard";

export interface ThreeJsBoardObject extends BoardObject {
  getObject(): THREE.Object3D;
  setBoard(board: ThreeJsBoard): void;
  remove?: () => void;
}
