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

export interface InteractiveObject {
  isActive(): boolean;
  activate(): void;
  deactivate(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInteractiveObject = (obj: any): obj is InteractiveObject => {
  return (
    typeof obj["isActive"] === "function" &&
    typeof obj["activate"] === "function" &&
    typeof obj["deactivate"] === "function"
  );
};

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}
