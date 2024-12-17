import { BoardObject } from "../Board/BoardObject";
import { WayNetworkPathFinder } from "./WayNetworkPathFinder";
import { WayPoint } from "./WayPoint";

export class WayNetwork extends BoardObject {
  private waypoints: WayPoint[] = [];
  private wayNetworkPathFinder = new WayNetworkPathFinder();
  constructor(
    somePositionInside: [number, number],
    wallsPositions: [number, number][],
  ) {
    super();
    const walls: boolean[][] = WayNetwork.createWallMatrix(wallsPositions);
    this.createNode(walls, somePositionInside[0], somePositionInside[1]);
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
    if (rightIsAvailable && topIsAvailable) {
      createAndAssign(x + 1, y + 1);
    }
    if (topIsAvailable) {
      createAndAssign(x, y + 1);
    }
    if (topIsAvailable && leftIsAvailable) {
      createAndAssign(x - 1, y + 1);
    }
    if (leftIsAvailable) {
      createAndAssign(x - 1, y);
    }
    if (leftIsAvailable && bottomIsAvailable) {
      createAndAssign(x - 1, y - 1);
    }
    if (bottomIsAvailable) {
      createAndAssign(x, y - 1);
    }
    if (bottomIsAvailable && rightIsAvailable) {
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
}
