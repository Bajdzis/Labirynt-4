import * as THREE from "three";
import { resources } from "../Resources/Resources";
import { Floor } from "./Floor";
import {
  FirstPlayerPrototype,
  SecondPlayerPrototype,
  ThreeJsPlayer,
} from "./ThreeJsPlayer";
import { ThreeJsWall } from "./ThreeJsWall";
import { Player } from "../Board/Player";
import { objectContainsOther } from "../Utils/math/objectContainsOther";
import { Torch } from "./Torch";
import { boxParticles } from "../Particles/instances";
import { GameCamera } from "../GameCamera";
import { ThreeJsWalls } from "./ThreeJsWalls";
import { ControlBehavior } from "../IO/Behaviors/ControlBehavior";
import { KeyboardTouchButton } from "../IO/Behaviors/KeyboardTouchButton";
import { Destination } from "./Destination";
import { Key } from "./Key";
import { Door } from "./Door";
import { Cauldron } from "./Cauldron";
import { BoardObject } from "../Board/BoardObject";
import { gamepad1 } from "../IO/Devices/Gamepad";
import { GamepadPressButton } from "../IO/Behaviors/GamepadPressButton";
import { PushActivatedSwitch } from "./PushActivatedSwitch";
import { getCenterOfRectangle } from "../Utils/math/getCenterOfRectangle";

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
    }
  | {
      name: "pickKey";
      key: Key;
      player: Player;
    }
  | {
      name: "openDoor";
      door: Door;
      player: Player;
    };
let performanceCheckerIsActive = false;

let numberOfFrames = 0;
const times: { [key: string]: number } = {};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.runBenchmark = () => {
  performanceCheckerIsActive = true;
  numberOfFrames = 0;
  console.log(times);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.showAverageTime = () => {
  console.table(
    Object.entries(times).reduce<{ [key: string]: number }>(
      (acc, [key, value]) => {
        acc[key] = value / numberOfFrames;
        return acc;
      },
      {},
    ),
  );
};

export class ThreeJsBoard {
  private scene: THREE.Group;
  private objects: BoardObject[] = [];
  private wallsGroup: ThreeJsWalls;
  private addSecondPlayerBehavior: ControlBehavior<true> = new ControlBehavior([
    new KeyboardTouchButton("ArrowUp"),
    new KeyboardTouchButton("ArrowLeft"),
    new KeyboardTouchButton("ArrowDown"),
    new KeyboardTouchButton("ArrowRight"),
    new KeyboardTouchButton("Numpad0"),
    new GamepadPressButton(gamepad1, "PsCrossButton"),
  ]);
  private secondPlayerAlreadyAdded = false;
  private currentLevelId = 0;

  constructor(private camera: GameCamera) {
    this.wallsGroup = new ThreeJsWalls(resources, []);
    this.scene = new THREE.Group();

    this.scene.add(boxParticles.getObject());
    const player1 = new FirstPlayerPrototype();
    this.addObject(player1);
    this.addObject(new Floor(resources));
    this.loadLevel(this.currentLevelId);
  }

  eachObject(callback: (object: BoardObject) => void) {
    this.objects.forEach(callback);
  }

  getObjects() {
    return this.objects;
  }

  findObject(callback: (object: BoardObject) => boolean) {
    return this.objects.find(callback);
  }

  update(delta: number) {
    if (!this.secondPlayerAlreadyAdded) {
      this.addSecondPlayerBehavior.update(delta);
      if (this.addSecondPlayerBehavior.getState()) {
        const player = new SecondPlayerPrototype();
        player.changePosition(
          resources.data.levels[this.currentLevelId].startPosition[0] * 0.32,
          resources.data.levels[this.currentLevelId].startPosition[1] * 0.32,
        );

        this.addObject(player);
        this.secondPlayerAlreadyAdded = true;
      }
    }
    this.objects.forEach((object) => {
      if (
        object instanceof Torch ||
        object instanceof Destination ||
        object instanceof Key ||
        object instanceof Door
      ) {
        object.hideTip();
      }
    });

    boxParticles.update(delta);
    numberOfFrames++;
    const players = this.objects.filter(
      (object) => object instanceof ThreeJsPlayer,
    ) as ThreeJsPlayer[];
    this.objects.forEach((object) => {
      if (performanceCheckerIsActive) {
        const start = performance.now();
        object.update(delta);
        const diff = performance.now() - start;
        times[object.constructor.name] =
          (times[object.constructor.name] || 0) + diff;
      } else {
        object.update(delta);
      }

      if (object instanceof Cauldron) {
        const somePlayerContains = players.some((player) =>
          objectContainsOther(object, player),
        );
        if (somePlayerContains) {
          object.activate();
        }
      }
      if (object instanceof PushActivatedSwitch) {
        players.forEach((player) => {
          object.interact(player);
        });
      }

      if (object instanceof ThreeJsPlayer) {
        const action = this.getActionForPlayer(object);
        if (action?.name === "grabTorch") {
          action.torch.showTip();
        }
      }

      if (object instanceof Door) {
        const step = (0.001875 / 3) * delta;

        players.forEach((player) => {
          const block = object.getBlockingRect();
          if (block && objectContainsOther(block, player)) {
            const c1 = getCenterOfRectangle(player);
            const c2 = getCenterOfRectangle(block);
            if (object.getPosition() === "vertical") {
              const direction = c1.x > c2.x ? 1 : -1;
              player.changePosition(step * direction, 0);
            } else {
              const direction = c1.y > c2.y ? 1 : -1;
              player.changePosition(0, step * direction);
            }
          }
        });
      }
    });
    this.updateCameraPosition();
  }

  getActionForPlayer(player: Player): GameEvent | null {
    let touchedDoor: Door | null = null;
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
      if (object instanceof Key) {
        if (objectContainsOther(object, player)) {
          object.showTip();
          return {
            name: "pickKey",
            key: object,
            player: player,
          };
        }
      }
      if (object instanceof Door) {
        if (objectContainsOther(object, player)) {
          if (!player.haveKey(object.keyName)) {
            touchedDoor = object;
          } else {
            object.showTip();
            return {
              name: "openDoor",
              door: object,
              player: player,
            };
          }
        }
      }
    }

    if (touchedDoor) {
      touchedDoor.showTip();
      return {
        name: "openDoor",
        door: touchedDoor,
        player: player,
      };
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

      for (let i = 0; i < this.wallsGroup.walls.length; i++) {
        const element = this.wallsGroup.walls[i];
        if (objectContainsOther(element, newPlayerPosition)) {
          playerCanMove = false;
          break;
        }
      }
      if (playerCanMove) {
        for (const object of this.objects) {
          if (object instanceof ThreeJsWall) {
            if (objectContainsOther(object, newPlayerPosition)) {
              playerCanMove = false;
              break;
            }
          } else if (object instanceof Door) {
            if (!object.canMoveThrough(newPlayerPosition)) {
              playerCanMove = false;
              break;
            }
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
      resources.data.sounds.torch.play();
      event.player.throwTorch();
      this.addObject(new Torch(event.player.x - 0.04, event.player.y - 0.04));
    } else if (event.name === "grabTorch") {
      resources.data.sounds.torch.play();
      event.player.grabTorch();
      this.removeObject(event.torch);
    } else if (event.name === "pickKey") {
      resources.data.sounds.key.play();
      event.player.pickKey(event.key);
      this.removeObject(event.key);
    } else if (event.name === "openDoor") {
      if (event.player.haveKey(event.door.keyName)) {
        event.door.toggle();
        event.player.runVibration(200, 0.5);
      }
    } else if (event.name === "useDestination") {
      resources.data.sounds.teleport.play();
      this.loadLevel(this.currentLevelId + 1);
    }
  }

  loadLevel(level: number) {
    this.currentLevelId = level;
    this.objects.forEach((object) => {
      if (object instanceof ThreeJsPlayer) {
        object.setPosition(
          resources.data.levels[level].startPosition[0] * 0.32,
          resources.data.levels[level].startPosition[1] * 0.32,
        );
      } else if (!(object instanceof Floor)) {
        this.removeObject(object);
      }
    });

    const elements = resources.data.levels[level].createAdditionalElements();
    elements.forEach((element) => this.addObject(element));

    this.addObject(
      new Destination(
        resources.data.levels[level].endPosition[0] * 0.32,
        resources.data.levels[level].endPosition[1] * 0.32,
      ),
    );

    this.scene.remove(this.wallsGroup.getObject());
    const walls = resources.data.levels[level].wallsPositions.map(
      ([x, y]) => new ThreeJsWall(x, y),
    );
    walls.forEach((element) => this.addObject(element));
    this.wallsGroup = new ThreeJsWalls(resources, walls);

    this.scene.add(this.wallsGroup.getObject());
  }

  getScene() {
    return this.scene;
  }

  updateCameraPosition() {
    const playersAreaToShow = this.objects.reduce((acc, object) => {
      if (object instanceof ThreeJsPlayer) {
        acc.push(
          new THREE.Box2(
            new THREE.Vector2(object.x - 1.28, object.y - 1.28),
            new THREE.Vector2(object.x + 1.28, object.y + 1.28),
          ),
        );
      } else if (object instanceof Destination) {
        acc.push(
          new THREE.Box2(
            new THREE.Vector2(object.x - 0.32, object.y - 0.32),
            new THREE.Vector2(object.x + 0.32, object.y + 0.32),
          ),
        );
      }
      return acc;
    }, [] as THREE.Box2[]);

    this.camera.setAreasToShow(playersAreaToShow);
  }

  private addObject(object: BoardObject) {
    object.update(0);
    this.objects.push(object);
    const object3D = object.getObject();
    object3D && this.scene.add(object3D);
    object.setBoard(this);
  }

  private removeObject(object: BoardObject) {
    this.objects = this.objects.filter((obj) => obj !== object);
    object.remove && object.remove();
    const object3D = object.getObject();
    object3D && this.scene.remove(object3D);
  }
}
