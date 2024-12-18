import { WayPoint } from "./WayPoint";

export function aStar(start: WayPoint, goal: WayPoint): WayPoint[] | null {
  const openSet: Set<WayPoint> = new Set([start]);

  const cameFrom = new Map<WayPoint, WayPoint | null>();
  const gScore = new Map<WayPoint, number>();
  const fScore = new Map<WayPoint, number>();

  gScore.set(start, 0);
  fScore.set(start, WayPoint.distance(start, goal));

  while (openSet.size > 0) {
    let current: WayPoint | null = null;
    let currentMinFScore = Infinity;

    for (const node of openSet) {
      const score = fScore.get(node) || Infinity;
      if (score < currentMinFScore) {
        currentMinFScore = score;
        current = node;
      }
    }

    if (!current) {
      break;
    }

    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(current);
    for (const [
      neighbor,
      calculatedDistance,
    ] of current.getConnectionsWithDistance()) {
      if (!neighbor.isActive()) {
        continue;
      }

      const tentativeGScore =
        (gScore.get(current) ?? Infinity) + calculatedDistance;

      if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(
          neighbor,
          tentativeGScore + WayPoint.distance(neighbor, goal),
        );

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }
  }

  return null;
}

function reconstructPath(
  cameFrom: Map<WayPoint, WayPoint | null>,
  current: WayPoint,
): WayPoint[] {
  const path: WayPoint[] = [current];
  while (cameFrom.has(current) && cameFrom.get(current) !== null) {
    current = cameFrom.get(current)!;
    path.unshift(current);
  }
  return path;
}
