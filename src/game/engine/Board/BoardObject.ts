export interface BoardObject {
  x: number;
  y: number;
  width: number;
  height: number;
  update(delta: number): void;
}
