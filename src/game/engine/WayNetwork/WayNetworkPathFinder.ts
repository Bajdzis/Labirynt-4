import { aStar } from "./aStar";
import { WayPoint } from "./WayPoint";

const USE_CACHE = true;

export class WayNetworkPathFinder {
  private cache: WayPoint[][] = [];

  private addPath(path: WayPoint[]): void {
    if (path.length < 6) {
      return;
    }

    this.cache = this.cache.filter((cachedPath) => {
      const isSubPath = cachedPath.every((waypoint) => path.includes(waypoint));
      return !isSubPath;
    });

    this.cache.push(path);
    this.cache.push([...path].reverse());
  }

  private getPathFromCache(start: WayPoint, end: WayPoint): WayPoint[] | null {
    for (let i = 0; i < this.cache.length; i++) {
      const cachedPath = this.cache[i];
      const startIdx = cachedPath.indexOf(start);

      if (startIdx === -1) {
        continue;
      }

      const endIdx = cachedPath.indexOf(end);
      if (endIdx === -1) {
        continue;
      }

      if (startIdx === 0 && endIdx === cachedPath.length - 1) {
        return cachedPath;
      }

      if (startIdx > endIdx) {
        continue;
      }
      return cachedPath.slice(startIdx, endIdx);
    }

    return null;
  }

  private pathIsStillAvailable(path: WayPoint[]): boolean {
    return path.every((waypoint) => waypoint.isActive());
  }

  findPath(start: WayPoint, end: WayPoint): WayPoint[] | null {
    if (start.isActive() === false || end.isActive() === false) {
      return null;
    }
    if (USE_CACHE) {
      const pathFromCache = this.getPathFromCache(start, end);

      if (pathFromCache && this.pathIsStillAvailable(pathFromCache)) {
        return pathFromCache;
      }
    }
    const newPath = aStar(start, end);

    if (USE_CACHE && newPath !== null) {
      this.addPath(newPath);
    }
    return newPath;
  }
}
