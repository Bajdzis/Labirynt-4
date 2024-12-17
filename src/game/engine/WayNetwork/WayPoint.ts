import { Rectangle } from "../Board/BoardObject";

export class WayPoint {
  private rect: Rectangle;

  private connectWaypointsAndDistance = new Map<WayPoint, number>();

  constructor(
    public x: number,
    public y: number,
  ) {
    this.rect = { x: x * 0.32, y: y * 0.32, width: 0.32, height: 0.32 };
  }

  isActive() {
    return true;
  }

  isPointAt(x: number, y: number) {
    return this.x === x && this.y === y;
  }

  static connectTo(w1: WayPoint, w2: WayPoint) {
    const distance = WayPoint.distance(w1, w2);
    w1.connectWaypointsAndDistance.set(w2, distance);
    w2.connectWaypointsAndDistance.set(w1, distance);
  }

  static distance(w1: WayPoint, w2: WayPoint) {
    return Math.sqrt(Math.pow(w1.x - w2.x, 2) + Math.pow(w1.y - w2.y, 2));
  }

  getConnectionsWithDistance() {
    return this.connectWaypointsAndDistance;
  }
}

function distance(w1: WayPoint, w2: WayPoint): number {
  return WayPoint.distance(w1, w2);
}

// Implementacja algorytmu A*
export function aStar(start: WayPoint, goal: WayPoint): WayPoint[] | null {
  // Kolejka priorytetowa dla otwartych węzłów
  const openSet: Set<WayPoint> = new Set([start]);

  // Mapy przechowujące informacje o kosztach
  const cameFrom = new Map<WayPoint, WayPoint | null>(); // Śledzenie ścieżki
  const gScore = new Map<WayPoint, number>(); // Koszt od startu do węzła
  const fScore = new Map<WayPoint, number>(); // G + H (heurystyka + koszt dotychczasowy)

  gScore.set(start, 0);
  fScore.set(start, distance(start, goal));

  while (openSet.size > 0) {
    // Znalezienie węzła z najniższym fScore
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

    // Jeśli osiągnęliśmy cel, odtwórz ścieżkę
    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    // Przetwarzanie aktualnego węzła
    openSet.delete(current);
    for (const [
      neighbor,
      calculatedDistance,
    ] of current.getConnectionsWithDistance()) {
      // Pomijamy węzły niedostępne
      if (!neighbor.isActive()) {
        continue;
      }

      const tentativeGScore =
        (gScore.get(current) ?? Infinity) + calculatedDistance;

      if (tentativeGScore < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + distance(neighbor, goal));

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    }
  }

  console.log("No path found");
  // Jeśli openSet jest pusty, nie znaleziono ścieżki
  return null;
}

// Funkcja do odtwarzania ścieżki z mapy cameFrom
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
