import {
  BoardObject,
  InteractiveObject,
  Rectangle,
} from "../Board/BoardObject";
import { WayNetworkPathFinder } from "./WayNetworkPathFinder";
import { WayPoint } from "./WayPoint";
import { WayNetworkView } from "./WayNetworkView";
import { ThreeJsPlayer } from "../ThreeJsBoard/ThreeJsPlayer";
import { Destination } from "../ThreeJsBoard/Destination";

export class WayNetwork extends BoardObject {
  private waypoints: WayPoint[] = [];
  private wayNetworkPathFinder = new WayNetworkPathFinder();
  private wayNetworkView: WayNetworkView | null = null;
  constructor(
    somePositionInside: [number, number],
    wallsPositions: [number, number][],
  ) {
    super();
    const walls: boolean[][] = WayNetwork.createWallMatrix(wallsPositions);
    this.createNode(walls, somePositionInside[0], somePositionInside[1]);

    if (process.env.NODE_ENV === "development") {
      this.wayNetworkView = new WayNetworkView(this.waypoints);
    }
  }

  assignToObject(object: InteractiveObject & Rectangle): void {
    this.waypoints.forEach((waypoint) => {
      if (waypoint.contains(object)) {
        waypoint.assignToObject(object);
      }
    });
  }

  private createNode(walls: boolean[][], x: number, y: number): WayPoint {
    const currentWayPoint = this.waypoints.find((w) => w.isPointAt(x, y));
    if (currentWayPoint) {
      return currentWayPoint;
    }
    const rootWayPoint = new WayPoint(x, y);

    this.waypoints.push(rootWayPoint);

    const rightIsAvailable = !walls[x + 1][y];
    const leftIsAvailable = !walls[x - 1][y];
    const topIsAvailable = !walls[x][y + 1];
    const bottomIsAvailable = !walls[x][y - 1];

    const createAndAssign = (x: number, y: number) => {
      const w = this.createNode(walls, x, y);
      WayPoint.connectTo(rootWayPoint, w);
    };

    if (rightIsAvailable) {
      createAndAssign(x + 1, y);
    }
    if (rightIsAvailable && topIsAvailable && !walls[x + 1][y + 1]) {
      createAndAssign(x + 1, y + 1);
    }
    if (topIsAvailable) {
      createAndAssign(x, y + 1);
    }
    if (topIsAvailable && leftIsAvailable && !walls[x - 1][y + 1]) {
      createAndAssign(x - 1, y + 1);
    }
    if (leftIsAvailable) {
      createAndAssign(x - 1, y);
    }
    if (leftIsAvailable && bottomIsAvailable && !walls[x - 1][y - 1]) {
      createAndAssign(x - 1, y - 1);
    }
    if (bottomIsAvailable) {
      createAndAssign(x, y - 1);
    }
    if (bottomIsAvailable && rightIsAvailable && !walls[x + 1][y - 1]) {
      createAndAssign(x + 1, y - 1);
    }
    return rootWayPoint;
  }

  findPath(start: [number, number], end: [number, number]): WayPoint[] | null {
    const startWaypoint = this.waypoints.find((w) =>
      w.isPointAt(start[0], start[1]),
    );
    const endWaypoint = this.waypoints.find((w) => w.isPointAt(end[0], end[1]));
    if (!startWaypoint || !endWaypoint) {
      return null;
    }

    return this.wayNetworkPathFinder.findPath(startWaypoint, endWaypoint);
  }

  private static createWallMatrix(
    wallsPositions: [number, number][],
  ): boolean[][] {
    const wallMatrix: boolean[][] = [];
    for (const [x, y] of wallsPositions) {
      wallMatrix[x] = wallMatrix[x] || [];
      wallMatrix[x][y] = true;
    }
    return wallMatrix;
  }

  findWaypointOnRect(rect: Rectangle): WayPoint | null {
    return this.waypoints.find((waypoint) => waypoint.contains(rect)) ?? null;
  }

  update(): void {
    if (this.wayNetworkView !== null) {
      this.wayNetworkView.update();
      let startWaypoint: WayPoint | null = null;
      let endWaypoint: WayPoint | null = null;
      this.board?.eachObject((object) => {
        if (object instanceof ThreeJsPlayer) {
          startWaypoint = this.findWaypointOnRect(object);
        }
        if (object instanceof Destination) {
          endWaypoint = this.findWaypointOnRect(object);
        }
      });

      if (startWaypoint && endWaypoint) {
        const path = this.wayNetworkPathFinder.findPath(
          startWaypoint,
          endWaypoint,
        );
        this.wayNetworkView.showPath(path ?? []);
      }
    }
  }

  getObject() {
    return this.wayNetworkView?.getObject() ?? null;
  }
}
