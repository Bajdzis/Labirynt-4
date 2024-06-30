import * as THREE from "three";
import { ThreeJsBoard } from "../ThreeJsBoard/ThreeJsBoard";

export abstract class BoardObject {
  protected board: ThreeJsBoard | null = null;
  getObject(): THREE.Object3D | null {
    return null;
  }
  setBoard(board: ThreeJsBoard) {
    this.board = board;
  }
  remove() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {}
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
