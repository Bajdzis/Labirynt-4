import { Material, Mesh, Object3D, PlaneGeometry } from "three";
import { BoardObject } from "../../Board/BoardObject";
import { WayPoint } from "../../WayNetwork/WayPoint";
import { Routine } from "./Routine/domain";
import { NPCSenseOfSight } from "./NPCSenseOfSight";
import { ThreeJsPlayer } from "../ThreeJsPlayer";
import { NPCSense } from "./NPCSense";
import { Torch } from "../Torch";
import { Key } from "../Key";

type Task =
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

export class NPC extends BoardObject {
  private routine: Routine;
  private mesh: Mesh;
  private queue: Task[] = [];
  private currentTask: Task | null = null;

  private senseOfSightPlayer = new NPCSenseOfSight(ThreeJsPlayer, 4, this);
  private senseOfTouchTorch = new NPCSense(Torch, 0);
  private senseOfTouchKey = new NPCSense(Key, 0);
  private senseOfTouchPlayer = new NPCSense(ThreeJsPlayer, 0);

  constructor(
    private currentWayPoint: WayPoint,
    private material: Material,
    private defaultRoutine: Routine,
  ) {
    super();
    this.routine = defaultRoutine;
    this.routine.start(this);
    this.mesh = new Mesh(new PlaneGeometry(0.2, 0.2), this.material);
    this.mesh.position.set(
      currentWayPoint.x * 0.32,
      currentWayPoint.y * 0.32,
      0.1,
    );
  }

  public startRoutine(routine: Routine) {
    this.routine.end(this);
    this.routine = routine;
    this.routine.start(this);
  }

  public startDefaultRoutine() {
    this.startRoutine(this.defaultRoutine);
  }

  public onSeePlayer(callback: (player: ThreeJsPlayer) => void) {
    this.senseOfSightPlayer.addListener(callback);
  }

  public onTouchTorch(callback: (torch: Torch) => void) {
    this.senseOfTouchTorch.addListener(callback);
  }

  public onTouchKey(callback: (key: Key) => void) {
    this.senseOfTouchKey.addListener(callback);
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
  }

  public getCurrentAngle() {
    return this.mesh.rotation.z;
  }

  public getCurrentWayPoint() {
    return this.currentWayPoint;
  }

  private startNextTask() {
    const newTask = this.queue.shift() || null;
    if (newTask === null && this.currentTask !== null) {
      this.emptyTaskListListeners.forEach((listener) => listener());
    }
    return newTask;
  }

  public update(delta: number) {
    if (this.board) {
      this.senseOfSightPlayer.refreshWaypointsToObserve(this.currentWayPoint);
      this.senseOfSightPlayer.searchObjectInSenseRange(this.board.getObjects());
    }
    this.routine.update(this, delta);
    if (this.currentTask === null) {
      this.currentTask = this.startNextTask();
    }
    if (this.currentTask !== null) {
      if (
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
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.001) {
          this.currentWayPoint = target;
          this.currentTask = this.startNextTask();
        } else {
          const speed = 0.0005 * delta;
          const nx = (dx * 0.32) / distance;
          const ny = (dy * 0.32) / distance;
          this.mesh.position.x += nx * speed;
          this.mesh.position.y += ny * speed;
        }
      } else if (this.currentTask.type === "lookAt") {
        const target = this.currentTask.waypoint;
        const current = this.currentWayPoint;
        const targetAngle = Math.atan2(
          target.y - current.y,
          target.x - current.x,
        );
        const currentAngle = this.mesh.rotation.z;
        const rotationSpeed = 0.001 * delta;
        const diff = targetAngle - currentAngle;
        if (diff > Math.PI) {
          this.mesh.rotation.z += rotationSpeed;
        } else if (diff < -Math.PI) {
          this.mesh.rotation.z -= rotationSpeed;
        } else {
          if (diff > 0) {
            this.mesh.rotation.z += rotationSpeed;
          } else {
            this.mesh.rotation.z -= rotationSpeed;
          }
        }
        if (Math.abs(diff) < 0.01) {
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
