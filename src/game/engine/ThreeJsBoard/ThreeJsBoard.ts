import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Floor } from "./Floor";
import { ThreeJsPlayer } from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";

export class ThreeJsBoard {
  private scene: THREE.Scene;
  protected player: ThreeJsPlayer;
  protected player2: ThreeJsPlayer;
  private objects: ThreeJsBoardObject[] = [];

  constructor(private resources: Resources) {
    this.player = new ThreeJsPlayer(this.resources.material.player1);
    this.player2 = new ThreeJsPlayer(this.resources.material.player2);

    this.objects.push(this.player);
    this.objects.push(this.player2);
    this.objects.push(new Floor(this.resources));

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

    this.scene = new THREE.Scene();
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scene.add(...this.objects.map((object) => object.getObject()));
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

  private addWall(x: number, y: number) {
    this.objects.push(new ThreeJsWall(this.resources, x, y));
  }
}
