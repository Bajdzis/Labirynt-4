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

    const refreshState = () => {
      if (!trackingPlayer) {
        return;
      }
      const playerWp = this.wayNet.findWaypointOnRect(trackingPlayer);
      if (!playerWp) {
        return;
      }
      const npcWp = npc.getCurrentWayPoint();

      const pathToPlayer = WayPoint.distance(npcWp, playerWp);

      // TODO use path distance instead of point distance
      if (pathToPlayer > 5) {
        npc.startDefaultRoutine();
        return;
      }

      const points = this.findEscapePathForGhost(npcWp, playerWp, 50) || [];

      points.forEach((wp) => {
        console.log(wp.x, wp.y);
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
      const distancePlayerPathToWaypoints = this.getAllWpByDistance(
        playerPosition,
        10,
        (wp) => wp.isActive(),
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
    // const allWp = this.getAllWpByDistance(
    //   ghostPosition,
    //   minDistance,
    //   () => true,
    // );
    const distancePlayerPathToWaypoints = this.getAllWpByDistance(
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

  getAllWpByDistance(
    wp: WayPoint,
    maxDistance: number,
    checkAvailable: (wp: WayPoint) => boolean,
  ) {
    const points = this.getAllWpByDistanceRevers(
      wp,
      maxDistance,
      checkAvailable,
    )
      .map(({ wp, distanceLeft }) => ({
        wp,
        distance: Math.abs(distanceLeft - maxDistance) + 1,
      }))
      .sort((a, b) => b.distance - a.distance);

    points.push({ wp, distance: 0 });
    return points;
  }

  private getAllWpByDistanceRevers(
    wp: WayPoint,
    distanceLeft: number,
    checkAvailable: (wp: WayPoint) => boolean,
    visited: WayPoint[] = [],
  ): { wp: WayPoint; distanceLeft: number }[] {
    const arr = Array.from(wp.getConnectionsWithDistance());

    const newPoints = arr.reduce<{ neighbor: WayPoint; distance: number }[]>(
      (acc, [neighbor, distance]) => {
        if (visited.includes(neighbor)) {
          return acc;
        }
        acc.push({ neighbor, distance });
        visited.push(neighbor);

        return acc;
      },
      [],
    );

    return newPoints.reduce<{ wp: WayPoint; distanceLeft: number }[]>(
      (acc, { neighbor, distance }) => {
        acc.push({ wp: neighbor, distanceLeft });
        if (distanceLeft > 0 && checkAvailable(neighbor)) {
          const data = this.getAllWpByDistanceRevers(
            neighbor,
            distanceLeft - distance,
            checkAvailable,
            visited,
          );
          acc.push(...data);
        }

        return acc;
      },
      [],
    );
  }
}
