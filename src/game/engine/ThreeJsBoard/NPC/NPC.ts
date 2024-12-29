import { Material, Mesh, Object3D, PlaneGeometry } from "three";
import { BoardObject, Rectangle } from "../../Board/BoardObject";
import { WayPoint } from "../../WayNetwork/WayPoint";
import { Routine } from "./Routine/domain";
import { NPCSenseOfSight } from "./NPCSenseOfSight";
import { ThreeJsPlayer } from "../ThreeJsPlayer";
import { NPCSense } from "./NPCSense";
import { Torch } from "../Torch";
import { Key } from "../Key";
import { Door } from "../Door";
import { ThreeJsWall } from "../ThreeJsWall";
import { NPCTouchSense } from "./NPCTouchSense";

type Task =
  | {
      type: "pickItem";
      item: BoardObject & Rectangle;
    }
  | {
      type: "throwItem";
      item: BoardObject & Rectangle;
    }
  | {
      type: "goto";
      waypoint: WayPoint;
      speed: 1 | 2 | 3;
    }
  | {
      type: "gotoAndLookAt";
      waypoint: WayPoint;
      speed: 1 | 2 | 3;
    }
  | {
      type: "lookAt";
      waypoint: WayPoint;
    }
  | {
      type: "wait";
      time: number;
    };

const PI_DOUBLE = Math.PI * 2;

function normalizeAngle(angle: number) {
  return ((angle % PI_DOUBLE) + PI_DOUBLE) % PI_DOUBLE;
}
function calculateAngleDistance(current: number, target: number) {
  const normalizedCurrent = normalizeAngle(current);
  const normalizedTarget = normalizeAngle(target);

  let difference = normalizedTarget - normalizedCurrent;

  // Normalize for range [-π, π]
  if (difference > Math.PI) {
    difference -= PI_DOUBLE;
  } else if (difference < -Math.PI) {
    difference += PI_DOUBLE;
  }

  return difference;
}

export class NPC extends BoardObject implements Rectangle {
  public x: number = 0;
  public y: number = 0;
  public width: number = 0.2;
  public height: number = 0.2;
  private routine: Routine;
  private mesh: Mesh;
  private queue: Task[] = [];
  private inventory: (BoardObject & Rectangle)[] = [];
  private currentTask: Task | null = null;

  private senseOfSightPlayer = new NPCSenseOfSight(ThreeJsPlayer, 4, this);
  private senseOfTouchTorch = new NPCTouchSense([Torch], this);
  private senseOfTouchKey = new NPCTouchSense([Key], this);
  private senseOfTouchWall = new NPCTouchSense<Door | ThreeJsWall>(
    [Door, ThreeJsWall],
    this,
  );
  private senseOfTouchPlayer = new NPCSense([ThreeJsPlayer], 0, this);
  public beforeWaypoint: WayPoint | null = null;

  constructor(
    private currentWayPoint: WayPoint,
    private material: Material,
    private defaultRoutine: Routine,
  ) {
    super();

    this.beforeWaypoint = this.currentWayPoint;
    this.mesh = new Mesh(
      new PlaneGeometry(this.width, this.height),
      this.material,
    );
    this.mesh.position.set(
      currentWayPoint.x * 0.32,
      currentWayPoint.y * 0.32,
      0.1,
    );

    this.routine = defaultRoutine;
    this.routine.start(this);
  }

  public startRoutine(routine: Routine) {
    this.routine.end(this);
    this.routine = routine;
    this.routine.start(this);
  }

  public startDefaultRoutine() {
    this.startRoutine(this.defaultRoutine);
  }

  public onSeePlayer(
    callback: (player: ThreeJsPlayer) => void,
    deactivateCallback?: () => void,
  ) {
    this.senseOfSightPlayer.addListener(callback, deactivateCallback);
  }

  public onTouchTorch(
    callback: (torch: Torch) => void,
    deactivateCallback?: () => void,
  ) {
    this.senseOfTouchTorch.addListener((object) => {
      if (
        !(
          this.inventory.includes(object) ||
          this.queue.some(
            (task) => task.type === "pickItem" && task.item === object,
          )
        )
      ) {
        callback(object);
      }
    }, deactivateCallback);
  }

  public onTouchKey(
    callback: (key: Key) => void,
    deactivateCallback?: () => void,
  ) {
    this.senseOfTouchKey.addListener((object) => {
      if (
        !(
          this.inventory.includes(object) ||
          this.queue.some(
            (task) => task.type === "pickItem" && task.item === object,
          )
        )
      ) {
        callback(object);
      }
    }, deactivateCallback);
  }

  public onTouchWall(
    callback: (wall: Door | ThreeJsWall) => void,
    deactivateCallback?: () => void,
  ) {
    this.senseOfTouchWall.addListener(callback, deactivateCallback);
  }

  public onTouchPlayer(callback: (player: ThreeJsPlayer) => void) {
    this.senseOfTouchPlayer.addListener(callback);
  }

  private emptyTaskListListeners: (() => void)[] = [];

  public onTaskListIsEmpty(callback: () => void) {
    this.emptyTaskListListeners.push(callback);
  }

  public clearAll() {
    this.clearSense();
    this.clearTasks();
    this.emptyTaskListListeners = [];
  }

  public clearSense() {
    this.senseOfSightPlayer.clear();
    this.senseOfTouchTorch.clear();
    this.senseOfTouchKey.clear();
    this.senseOfTouchPlayer.clear();
  }

  public pickItem(item: Rectangle & BoardObject) {
    const waypoint = this.currentWayPoint.wayNet.findClosestWaypointToPoint(
      item.x + item.width / 2,
      item.y + item.height / 2,
    );
    if (waypoint) {
      this.queue.push({ type: "goto", waypoint, speed: 3 });
    }
    this.queue.push({ type: "pickItem", item });
  }

  public throwItem(item: Rectangle & BoardObject) {
    this.queue.push({ type: "throwItem", item });
  }

  public throwAllItemImmediately() {
    this.inventory = [];
  }

  public goTo(wayPoint: WayPoint, speed: 1 | 2 | 3 = 2) {
    this.queue.push({ type: "goto", waypoint: wayPoint, speed });
  }

  public gotoAndLookAt(wayPoint: WayPoint, speed: 1 | 2 | 3 = 2) {
    this.queue.push({ type: "gotoAndLookAt", waypoint: wayPoint, speed });
  }

  public lookAt(wayPoint: WayPoint) {
    this.queue.push({ type: "lookAt", waypoint: wayPoint });
  }

  public wait(time: number) {
    this.queue.push({ type: "wait", time });
  }

  public clearTasks() {
    this.queue = [];
    this.currentTask = null;

    this.beforeWaypoint = this.currentWayPoint;
    this.currentWayPoint =
      this.currentWayPoint.wayNet.findClosestWaypointToPoint(
        this.mesh.position.x,
        this.mesh.position.y,
      ) || this.currentWayPoint;
  }

  public getCurrentAngle() {
    return this.mesh.rotation.z;
  }

  public getCurrentWayPoint() {
    return this.currentWayPoint;
  }

  private startNextTask() {
    const newTask = this.queue.shift() || null;
    if (newTask === null) {
      this.emptyTaskListListeners.forEach((listener) => listener());
      return this.queue.shift() || null;
    }
    return newTask;
  }

  public update(delta: number) {
    if (this.board) {
      const object = this.board.getObjects();

      this.senseOfSightPlayer.update(delta, object);
      this.senseOfTouchTorch.update(delta, object);
      this.senseOfTouchKey.update(delta, object);
      this.senseOfTouchPlayer.update(delta, object);
      this.senseOfTouchWall.update(delta, object);
    }
    this.x = this.mesh.position.x;
    this.y = this.mesh.position.y;
    this.inventory.forEach((item) => {
      item.x = this.mesh.position.x;
      item.y = this.mesh.position.y;
    });
    this.routine.update(this, delta);
    if (this.currentTask === null) {
      this.currentTask = this.startNextTask();
    }
    if (this.currentTask !== null) {
      if (this.currentTask.type === "pickItem") {
        this.inventory.push(this.currentTask.item);
        this.currentTask = this.startNextTask();
      } else if (this.currentTask.type === "throwItem") {
        const item = this.currentTask.item;
        const index = this.inventory.indexOf(item);
        if (index !== -1) {
          this.inventory.splice(index, 1);
        }
        this.currentTask = this.startNextTask();
      } else if (
        this.currentTask.type === "goto" ||
        this.currentTask.type === "gotoAndLookAt"
      ) {
        const target = this.currentTask.waypoint;
        if (this.currentTask.type === "gotoAndLookAt") {
          const current = this.currentWayPoint;
          const targetAngle = Math.atan2(
            target.y - current.y,
            target.x - current.x,
          );
          this.mesh.rotation.z = targetAngle;
        }
        const targetRect = target.getCenter();

        const dx = targetRect.x - this.mesh.position.x;
        const dy = targetRect.y - this.mesh.position.y;

        const speed = 0.001875 * (this.currentTask.speed / 3) * delta;
        let XisDone = dx === 0;
        let YisDone = dy === 0;
        if (!XisDone) {
          if (dx < 0) {
            this.mesh.position.x -= speed;
            if (this.mesh.position.x < targetRect.x) {
              XisDone = true;
            }
          } else {
            this.mesh.position.x += speed;
            if (this.mesh.position.x > targetRect.x) {
              XisDone = true;
            }
          }
        }
        if (!YisDone) {
          if (dy < 0) {
            this.mesh.position.y -= speed;
            if (this.mesh.position.y < targetRect.y) {
              YisDone = true;
            }
          } else {
            this.mesh.position.y += speed;
            if (this.mesh.position.y > targetRect.y) {
              YisDone = true;
            }
          }
        }

        if (XisDone && YisDone) {
          this.beforeWaypoint = this.currentWayPoint;
          this.currentWayPoint = target;

          this.currentTask = this.startNextTask();
        } else if (XisDone) {
          this.mesh.position.x = targetRect.x;
        } else if (YisDone) {
          this.mesh.position.y = targetRect.y;
        }
      } else if (this.currentTask.type === "lookAt") {
        const target = this.currentTask.waypoint;
        const current = this.currentWayPoint;
        const targetAngle = Math.atan2(
          target.y - current.y,
          target.x - current.x,
        );

        const rotationSpeed = 0.001 * delta;

        const distance = calculateAngleDistance(
          targetAngle,
          this.mesh.rotation.z,
        );

        if (distance < 0) {
          this.mesh.rotation.z += rotationSpeed;
        } else {
          this.mesh.rotation.z -= rotationSpeed;
        }
        if (Math.abs(distance) < 0.01) {
          this.mesh.rotation.z = targetAngle;
          this.currentTask = this.startNextTask();
        }
      } else if (this.currentTask.type === "wait") {
        this.currentTask.time -= delta;
        if (this.currentTask.time <= 0) {
          this.currentTask = this.startNextTask();
        }
      }
    }
  }

  getObject(): Object3D | null {
    return this.mesh;
  }
}
