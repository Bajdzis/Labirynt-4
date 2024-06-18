import * as THREE from "three";
import { resources } from "../Resources/Resources";
import { Floor } from "./Floor";
import {
  FirstPlayerPrototype,
  SecondPlayerPrototype,
  ThreeJsPlayer,
} from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";
import { ThreeJsBoardObject } from "./ThreeJsBoardObject";
import { Player } from "../Board/Player";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import { Torch } from "./Torch";
import { boxParticles } from "../Particles/instances";
import { GameCamera } from "../GameCamera";
import { ThreeJsWalls } from "./ThreeJsWalls";
import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { KeyboardTouchButton } from "../IO/Behaviors/KeyboardTouchButton";
import { Destination } from "./Destination";

type GameEvent =
  | {
      name: "changePlayerPosition";
      player: Player;
      x: number;
      y: number;
    }
  | {
      name: "useDestination";
      player: Player;
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

export class ThreeJsBoard {
  private scene: THREE.Scene;
  private objects: ThreeJsBoardObject[] = [];
  private wallsGroup: ThreeJsWalls;
  private camera: GameCamera = new GameCamera();
  private addSecondPlayerBehavior: ControlBehavior<true> = new ControlBehavior([
    new KeyboardTouchButton("ArrowUp"),
    new KeyboardTouchButton("ArrowLeft"),
    new KeyboardTouchButton("ArrowDown"),
    new KeyboardTouchButton("ArrowRight"),
    new KeyboardTouchButton("Numpad0"),
  ]);
  private secondPlayerAlreadyAdded = false;

  constructor() {
    this.wallsGroup = new ThreeJsWalls(resources, []);
    this.scene = new THREE.Scene();
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    this.scene.add(boxParticles.getObject());
    const player1 = new FirstPlayerPrototype();
    this.addObject(player1);
    this.addObject(new Floor(resources));
    this.loadLevel(0);
  }

  update(delta: number) {
    if (!this.secondPlayerAlreadyAdded) {
      this.addSecondPlayerBehavior.update(delta);
      if (this.addSecondPlayerBehavior.getState()) {
        const player = new SecondPlayerPrototype();
        player.changePosition(
          resources.levels[0].startPosition[0] * 0.32,
          resources.levels[0].startPosition[1] * 0.32,
        );

        this.addObject(player);
        this.secondPlayerAlreadyAdded = true;
      }
    }
    this.wallsGroup.update();
    this.objects.forEach((object) => {
      if (object instanceof Torch || object instanceof Destination) {
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
      if (object instanceof Destination) {
        if (objectContainsOther(object, player)) {
          object.showTip();
          return {
            name: "useDestination",
            player: player,
          };
        }
      }
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
    } else if (event.name === "useDestination") {
      this.loadLevel(1);
    }
  }

  loadLevel(level: number) {
    this.objects.forEach((object) => {
      if (object instanceof ThreeJsPlayer) {
        object.setPosition(
          resources.levels[level].startPosition[0] * 0.32,
          resources.levels[level].startPosition[1] * 0.32,
        );
      } else if (!(object instanceof Floor)) {
        this.removeObject(object);
      }
    });

    resources.levels[level].wallsPositions.forEach(([x, y]) => {
      this.addWall(x, y);
    });
    resources.levels[level].slotsPositions.forEach(([x, y]) => {
      this.addObject(new Torch(x * 0.32, y * 0.32));
    });

    this.addObject(
      new Destination(
        resources.levels[level].endPosition[0] * 0.32,
        resources.levels[level].endPosition[1] * 0.32,
      ),
    );

    const walls = this.objects.filter(
      (object) => object instanceof ThreeJsWall,
    ) as ThreeJsWall[];
    this.scene.remove(this.wallsGroup.getObject());
    this.wallsGroup = new ThreeJsWalls(resources, walls);

    this.scene.add(this.wallsGroup.getObject());
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
    this.addObject(new ThreeJsWall(x, y));
  }
}
