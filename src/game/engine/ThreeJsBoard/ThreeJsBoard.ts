import * as THREE from "three";
import { Resources } from "../Resources/Resources";
import { Floor } from "./Floor";
import { ThreeJsPlayer } from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Player } from "../Board/Player";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import { Torch } from "./Torch";
import { boxParticles } from "../Particles/instances";
import { GameCamera } from "../GameCamera";
import { ThreeJsWalls } from "./ThreeJsWalls";

type GameEvent =
  | {
      name: "changePlayerPosition";
      player: Player;
      x: number;
      y: number;
    }
  | {
      name: "doAction";
      player: Player;
    }
  | {
      name: "throwTorch";
      player: Player;
    }
  | {
      name: "grabTorch";
      torch: Torch;
      player: Player;
    };

boxParticles.addGroupOfParticles({
  colorStart: new THREE.Color("red"),
  colorStop: new THREE.Color("white"),
  maxLife: 5000,
  numberOfParticles: 200,
  state: "active",
  type: {
    type: "rectangle",
    width: 0.2,
    height: 0.2,
    x: 0,
    y: -1,
  },
});

boxParticles.addGroupOfParticles({
  colorStart: new THREE.Color("blue"),
  colorStop: new THREE.Color("white"),
  maxLife: 1000,
  numberOfParticles: 200,
  state: "active",
  type: {
    type: "circle",
    radius: 0.2,
    x: 1,
    y: -1,
  },
});

boxParticles.addGroupOfParticles({
  colorStart: new THREE.Color("white"),
  colorStop: new THREE.Color("green"),
  maxLife: 2000,
  numberOfParticles: 200,
  state: "active",
  type: {
    type: "circle-center",
    radius: 0.2,
    x: -1,
    y: -1,
  },
});

export class ThreeJsBoard {
  private scene: THREE.Scene;
  private objects: ThreeJsBoardObject[] = [];
  private wallsGroup;
  private camera: GameCamera = new GameCamera();

  constructor(private resources: Resources) {
    this.scene = new THREE.Scene();
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    this.scene.add(boxParticles.getObject());
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

    const walls = this.objects.filter(
      (object) => object instanceof ThreeJsWall,
    ) as ThreeJsWall[];

    this.wallsGroup = new ThreeJsWalls(resources, walls);

    this.scene.add(this.wallsGroup.getObject());
  }

  update(delta: number) {
    this.wallsGroup.update();
    this.objects.forEach((object) => {
      if (object instanceof Torch) {
        object.hideTip();
      }
    });

    boxParticles.update(delta);
    this.objects.forEach((object) => {
      object.update(delta);

      if (object instanceof ThreeJsPlayer) {
        const action = this.getActionForPlayer(object);
        if (action?.name === "grabTorch") {
          action.torch.showTip();
        }
      }
    });
    this.updateCameraPosition();
  }

  getActionForPlayer(player: Player): GameEvent | null {
    for (const object of this.objects) {
      if (object instanceof Torch) {
        if (
          objectContainsOther(object, player) &&
          player.canPlayerGrabTorch()
        ) {
          object.showTip();
          return {
            name: "grabTorch",
            torch: object,
            player: player,
          };
        } else {
          object.hideTip();
        }
      }
    }

    if (player.canPlayerThrowTorch()) {
      return {
        name: "throwTorch",
        player: player,
      };
    }

    return null;
  }

  sendEvent(event: GameEvent) {
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
    } else if (event.name === "doAction") {
      const newEvent = this.getActionForPlayer(event.player);
      if (newEvent) {
        this.sendEvent(newEvent);
      }
    } else if (event.name === "throwTorch") {
      event.player.throwTorch();
      this.addObject(new Torch(event.player.x, event.player.y));
    } else if (event.name === "grabTorch") {
      event.player.grabTorch();
      this.removeObject(event.torch);
    }
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera.getCamera();
  }

  updateCameraPosition() {
    const playersAreaToShow = this.objects.reduce((acc, object) => {
      if (object instanceof ThreeJsPlayer) {
        acc.push(
          new THREE.Box2(
            new THREE.Vector2(object.x - 0.64, object.y - 0.64),
            new THREE.Vector2(object.x + 0.64, object.y + 0.64),
          ),
        );
      }
      return acc;
    }, [] as THREE.Box2[]);

    this.camera.setAreasToShow(playersAreaToShow);
  }

  private addObject(object: ThreeJsBoardObject) {
    object.update(0);
    this.objects.push(object);
    const object3D = object.getObject();
    object3D && this.scene.add(object3D);
    object.setBoard(this);
  }

  private removeObject(object: ThreeJsBoardObject) {
    this.objects = this.objects.filter((obj) => obj !== object);
    object.remove && object.remove();
    const object3D = object.getObject();
    object3D && this.scene.remove(object3D);
  }

  private addWall(x: number, y: number) {
    this.addObject(new ThreeJsWall(this.resources, x, y));
  }
}
