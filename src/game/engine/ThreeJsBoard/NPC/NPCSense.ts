import { BoardObject, Rectangle } from "../../Board/BoardObject";
import { Timer } from "../../Board/Timer";
import { WayPoint } from "../../WayNetwork/WayPoint";
import { NPC } from "./NPC";

export class NPCSense<T extends BoardObject & Rectangle> {
  public readonly waypointsToObserve: Set<WayPoint> = new Set();
  protected rootWayPoint: WayPoint | null = null;
  private listenersOnActive: ((object: T) => void)[] = [];
  private listenersOnDeactivate: (() => void)[] = [];
  private time: Timer;
  private objects: BoardObject[] = [];
  private isActivated = false;
  constructor(
    private objectsToSearch: (new (...args: any) => T)[],
    private range: number,
    protected npc: NPC,
    refreshTime = 100,
  ) {
    this.time = new Timer(
      refreshTime,
      () => {
        this.refreshWaypointsToObserve(npc.getCurrentWayPoint());
        this.searchObjectInSenseRange(this.objects);
      },
      true,
    );
  }

  private filterObject(objects: BoardObject[]): T[] {
    return objects.filter((object) =>
      this.objectsToSearch.some((construct) => object instanceof construct),
    ) as T[];
  }

  searchObjectInSenseRange(objects: BoardObject[]) {
    if (this.listenersOnActive.length === 0) {
      return;
    }
    let activated = false;

    const f = this.filterObject(objects);
    // console.log(f);
    f.forEach((object) => {
      for (const waypoint of this.waypointsToObserve) {
        if (waypoint.contains(object)) {
          activated = true;
          this.listenersOnActive.forEach((listener) => listener(object));
        }
      }
    });
    if (activated === false && this.isActivated === true) {
      if (!activated) {
        this.listenersOnDeactivate.forEach((listener) => listener());
      }
    }
    this.isActivated = activated;
  }

  update(delta: number, objects: BoardObject[]) {
    this.objects = objects;
    this.time.update(delta);
  }

  private refreshWaypointsToObserve(rootWayPoint: WayPoint) {
    if (this.listenersOnActive.length === 0) {
      return;
    }
    this.rootWayPoint = rootWayPoint;
    this.waypointsToObserve.clear();
    if (this.range > 0) {
      this.addWaypointToObserve(rootWayPoint, 0);
    }
    this.waypointsToObserve.add(rootWayPoint);
  }

  private addWaypointToObserve(waypoint: WayPoint, distance = 0) {
    for (const [
      childWaypoint,
      childDistance,
    ] of waypoint.getConnectionsWithDistance()) {
      if (
        this.isValidObservationWaypoint(childWaypoint, childDistance + distance)
      ) {
        this.addWaypointToObserve(childWaypoint, childDistance + distance);
        this.waypointsToObserve.add(childWaypoint);
      }
    }
  }

  protected isValidObservationWaypoint(waypoint: WayPoint, distance: number) {
    return distance <= this.range && !this.waypointsToObserve.has(waypoint);
  }

  public addListener(
    listenerOnActive: (object: T) => void,
    listenerOnDeActive?: () => void,
  ) {
    this.listenersOnActive.push(listenerOnActive);
    if (listenerOnDeActive) {
      this.listenersOnDeactivate.push(listenerOnDeActive);
    }

    return () => {
      this.listenersOnActive = this.listenersOnActive.filter(
        (l) => l !== listenerOnActive,
      );
      if (listenerOnDeActive) {
        this.listenersOnDeactivate = this.listenersOnDeactivate.filter(
          (l) => l !== listenerOnDeActive,
        );
      }
    };
  }

  public clear() {
    this.listenersOnActive = [];
    this.listenersOnDeactivate = [];
  }
}
