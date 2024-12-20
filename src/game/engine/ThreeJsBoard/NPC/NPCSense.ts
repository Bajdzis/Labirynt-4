import { BoardObject, Rectangle } from "../../Board/BoardObject";
import { WayPoint } from "../../WayNetwork/WayPoint";

export class NPCSense<T extends BoardObject & Rectangle> {
  public readonly waypointsToObserve: Set<WayPoint> = new Set();
  protected rootWayPoint: WayPoint | null = null;
  private listeners: ((object: T) => void)[] = [];

  constructor(
    private objectToSearch: new (...args: any) => T,
    private range: number,
  ) {}

  searchObjectInSenseRange(objects: BoardObject[]) {
    if (this.listeners.length === 0) {
      return;
    }
    for (const object of objects) {
      if (object instanceof this.objectToSearch) {
        for (const waypoint of this.waypointsToObserve) {
          if (waypoint.contains(object)) {
            this.listeners.forEach((listener) => listener(object));
          }
        }
      }
    }
  }

  public refreshWaypointsToObserve(rootWayPoint: WayPoint) {
    if (this.listeners.length === 0) {
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

  public addListener(listener: (object: T) => void) {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public clear() {
    this.listeners = [];
  }
}
