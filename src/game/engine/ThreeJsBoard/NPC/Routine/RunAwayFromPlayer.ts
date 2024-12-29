import { WayNetwork } from "../../../WayNetwork/WayNetwork";
import { WayPoint } from "../../../WayNetwork/WayPoint";
import { ThreeJsPlayer } from "../../ThreeJsPlayer";
import { NPC } from "../NPC";
import { Routine } from "./domain";

export class RunAwayFromPlayer implements Routine {
  constructor(private wayNet: WayNetwork) {}
  start(npc: NPC) {
    npc.clearAll();

    let trackingPlayer: ThreeJsPlayer | null = null;
    let freezeTime: DOMHighResTimeStamp | null = null;
    const refreshState = () => {
      if (!trackingPlayer) {
        if (freezeTime === null) {
          freezeTime = performance.now();
        }

        if (performance.now() - freezeTime > 500) {
          npc.startDefaultRoutine();
        }
        return;
      }
      const playerWp = this.wayNet.findWaypointOnRect(trackingPlayer);
      if (!playerWp) {
        return;
      }
      freezeTime = null;
      const npcWp = npc.getCurrentWayPoint();

      const pathToPlayer =
        this.wayNet.findPathByWayPoint(npcWp, playerWp)?.length ?? Infinity;
      if (pathToPlayer > 5) {
        npc.startDefaultRoutine();
        return;
      }

      const points = this.findEscapePathForGhost(npcWp, playerWp, 25) || [];

      points.forEach((wp) => {
        npc.gotoAndLookAt(wp, 3);
      });
    };

    npc.onSeePlayer((player) => {
      if (!trackingPlayer) {
        trackingPlayer = player;
        npc.clearTasks();
        refreshState();
      }
    });

    npc.onTouchPlayer((trackingPlayer) => {
      const playerPosition = this.wayNet.findWaypointOnRect(trackingPlayer);
      if (!playerPosition) {
        return;
      }
      const distancePlayerPathToWaypoints =
        RunAwayFromPlayer.getAllWpByDistance(playerPosition, 10, (wp) =>
          wp.isActive(),
        );
      const ghostPosition = npc.getCurrentWayPoint();
      const bestChoose = this.getBestWaypointThroughWall(
        ghostPosition,
        distancePlayerPathToWaypoints,
      );

      if (bestChoose) {
        npc.clearTasks();
        npc.gotoAndLookAt(bestChoose.wp, 3);
      }
    });

    npc.onTaskListIsEmpty(() => {
      refreshState();
    });
  }

  update() {}

  end() {}

  findEscapePathForGhost(
    ghostPosition: WayPoint,
    playerPosition: WayPoint,
    minDistance: number,
  ): WayPoint[] | null {
    const distancePlayerPathToWaypoints = RunAwayFromPlayer.getAllWpByDistance(
      playerPosition,
      minDistance,
      (wp) => wp.isActive(),
    );

    const currentDistance =
      distancePlayerPathToWaypoints.find((wp) => wp.wp === ghostPosition)
        ?.distance ?? Infinity;

    const path = this.getBestWaypointToEscape(
      [ghostPosition],
      currentDistance,
      distancePlayerPathToWaypoints,
    );

    if (path.length < 2) {
      const bestChoose = this.getBestWaypointThroughWall(
        ghostPosition,
        distancePlayerPathToWaypoints,
      );
      return bestChoose ? [bestChoose.wp] : [];
    }
    return path;
  }

  getBestWaypointThroughWall(
    ghostPosition: WayPoint,
    distancePlayerPathToWaypoints: {
      wp: WayPoint;
      distance: number;
    }[],
  ) {
    const [bestChoose] = ghostPosition
      .findClosestNotConnectedWaypoints(2.9)
      .map((obj) => {
        // @ts-ignore
        obj.distanceToPlayer =
          distancePlayerPathToWaypoints.find((d) => d.wp === obj.wp)
            ?.distance ?? Infinity;
        return obj;
      })
      .sort((wp1, wp2) => {
        // @ts-ignore
        return wp2.distanceToPlayer - wp1.distanceToPlayer;
      });

    return bestChoose;
  }

  getBestWaypointToEscape(
    path: WayPoint[],
    currentDistance: number,
    distancePlayerPathToWaypoints: { wp: WayPoint; distance: number }[],
    iteration = 11,
  ): WayPoint[] {
    if (iteration <= 0) {
      return path;
    }
    const lastWp = path[path.length - 1];
    const [bestConnectedWaypoint] = lastWp
      .getConnectedWaypoints()
      .filter((wp) => !path.includes(wp))
      .map((wp) => {
        return {
          wp,
          distance:
            distancePlayerPathToWaypoints.find((d) => d.wp === wp)?.distance ??
            Infinity,
        };
      })
      .sort((a, b) => b.distance - a.distance);
    if (
      bestConnectedWaypoint === undefined ||
      currentDistance >= bestConnectedWaypoint.distance
    ) {
      return path;
    }
    return this.getBestWaypointToEscape(
      [...path, bestConnectedWaypoint.wp],
      currentDistance,
      distancePlayerPathToWaypoints,
      iteration - 1,
    );
  }

  static getAllWpByDistance(
    wp: WayPoint,
    maxDistance: number,
    checkAvailable: (wp: WayPoint) => boolean,
  ) {
    const distanceFromStart = new Map<WayPoint, number>();

    distanceFromStart.set(wp, 0.1);

    RunAwayFromPlayer.getAllWpByDistanceRevers(
      wp,
      maxDistance,
      checkAvailable,
      distanceFromStart,
    );

    return Array.from(distanceFromStart.keys())
      .map((wp) => ({
        wp,
        distance: distanceFromStart.get(wp) ?? 0,
      }))
      .sort((a, b) => b.distance - a.distance);
  }

  private static getAllWpByDistanceRevers(
    currentWaypoint: WayPoint,
    maxDistance: number,
    checkAvailable: (wp: WayPoint) => boolean,
    distanceFromStart: Map<WayPoint, number>,
  ): void {
    const currentDistance = distanceFromStart.get(currentWaypoint) ?? 0;
    if (currentDistance > maxDistance) {
      return;
    }

    const arr = Array.from(currentWaypoint.getConnectionsWithDistance());

    arr.forEach(([neighbor, distance]) => {
      if (!checkAvailable(neighbor)) {
        return;
      }
      const arr = Array.from(neighbor.getConnectionsWithDistance())
        .filter(([wp]) => distanceFromStart.has(wp))
        .sort(
          ([w1], [w2]) =>
            (distanceFromStart.get(w1) ?? 0) - (distanceFromStart.get(w2) ?? 0),
        );

      const wp = arr[0]?.[0] ?? null;
      const theSmallDistance = distanceFromStart.get(wp) ?? currentDistance;
      const finalValue = (wp ? theSmallDistance : currentDistance) + distance;
      if (
        distanceFromStart.has(neighbor) &&
        distanceFromStart.get(neighbor)! <= finalValue
      ) {
        return;
      }

      distanceFromStart.set(neighbor, finalValue);
      RunAwayFromPlayer.getAllWpByDistanceRevers(
        neighbor,
        maxDistance,
        checkAvailable,
        distanceFromStart,
      );
    });
  }
}
