import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Board } from "../Board/Board";
import { Floor } from "./Floor";
import { ThreeJsPlayer } from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";

export class ThreeJsBoard extends Board {
  private scene: THREE.Scene;
  protected player: ThreeJsPlayer;
  protected player2: ThreeJsPlayer;

  constructor(private resources: Resources) {
    super();
    this.createWalls();
    this.player = new ThreeJsPlayer(this.resources.material.player1);
    this.player2 = new ThreeJsPlayer(this.resources.material.player2);
    const floor = new Floor(this.resources);
    this.scene = new THREE.Scene();
    this.scene.add(floor.getFloor());
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    this.scene.add(this.player.getPlayer());
    this.scene.add(this.player2.getPlayer());

    const wallGroup = new THREE.Group();
    console.log(this.walls);
    this.walls.forEach((wall) => {
      if (wall instanceof ThreeJsWall) {
        wallGroup.add(wall.getWall());
      }
    });
    this.scene.add(wallGroup);
  }

  update(delta: number) {
    this.player.update(delta);
    this.player2.update(delta);
  }

  changePlayerPosition(x: number, y: number) {
    this.player.changePosition(x, y);
  }

  getScene() {
    return this.scene;
  }

  addWall(x: number, y: number) {
    this.walls.push(new ThreeJsWall(this.resources, x, y));
  }
}
