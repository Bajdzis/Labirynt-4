import { Player } from "./Player";
import { Wall } from "./Wall";

export class Board {
  protected walls: Wall[];
  protected player: Player;

  constructor() {
    this.walls = [];

    this.player = new Player();
  }

  createWalls() {
    this.addWall(3, 2);
    this.addWall(3, 2);
    this.addWall(2, 2);
    this.addWall(1, 2);
    this.addWall(0, 2);
    this.addWall(-1, 2);
    this.addWall(-1, 1);
    this.addWall(-1, 0);
    this.addWall(1, 0);
    this.addWall(2, 0);
    this.addWall(3, 0);
    this.addWall(3, 1);
  }

  changePlayerPosition(x: number, y: number) {
    this.player.changePosition(x, y);
  }

  addWall(x: number, y: number) {
    this.walls.push(new Wall(x, y));
  }
}
