import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Floor } from "./Floor";
import { ThreeJsPlayer } from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Player } from "../Board/Player";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import { Torch } from "./Torch";
import { lightsHelper } from "./LightsHelper";

export class ThreeJsBoard {
  private scene: THREE.Scene;
  private objects: ThreeJsBoardObject[] = [];

  constructor(private resources: Resources) {
    this.scene = new THREE.Scene();
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    this.scene.add(lightsHelper.getObject());
    this.addObject(
      new ThreeJsPlayer(
        this.resources.material.player1,
        {
          top: "KeyW",
          left: "KeyA",
          bottom: "KeyS",
          right: "KeyD",
          action: "KeyE",
        },
        true,
      ),
    );
    // this.addObject(
    //   new ThreeJsPlayer(this.resources.material.player2, {
    //     top: "ArrowUp",
    //     left: "ArrowLeft",
    //     bottom: "ArrowDown",
    //     right: "ArrowRight",
    //     action: "Numpad0",
    //   }),
    // );
    this.addObject(new Floor(this.resources));

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

  update(delta: number) {
    this.objects.forEach((object) => object.update(delta));
  }

  sendEvent(
    event:
      | {
          name: "changePlayerPosition";
          player: Player;
          x: number;
          y: number;
        }
      | {
          name: "throwTorch";
          player: Player;
        },
  ) {
    if (event.name === "changePlayerPosition") {
      let playerCanMove = true;
      const newPlayerPosition = {
        x: event.player.x + event.x,
        y: event.player.y + event.y,
        height: event.player.height,
        width: event.player.width,
      };
      for (const object of this.objects) {
        if (object instanceof ThreeJsWall) {
          if (objectContainsOther(object, newPlayerPosition)) {
            playerCanMove = false;
            break;
          }
        }
      }
      if (playerCanMove) {
        event.player.changePosition(event.x, event.y);
      }
    } else if (event.name === "throwTorch") {
      this.addObject(new Torch(event.player.x, event.player.y));
    }
  }

  getScene() {
    return this.scene;
  }

  private addObject(object: ThreeJsBoardObject) {
    this.objects.push(object);
    this.scene.add(object.getObject());
    object.setBoard(this);
  }

  private addWall(x: number, y: number) {
    this.addObject(new ThreeJsWall(this.resources, x, y));
  }
}
