import { aStar, WayPoint } from "./WayPoint";

export class WayNetworkPathFinder {
  private cache: WayPoint[][] = [];

  private addPath(path: WayPoint[]): void {
    if (path.length < 6) {
      return;
    }
    const start = path[0];
    const end = path[path.length - 1];

    this.cache = this.cache.filter((cachedPath) => {
      return cachedPath.indexOf(start) === -1 || cachedPath.indexOf(end) === -1;
    });

    this.cache.push(path);
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
      if (startIdx > endIdx) {
        return cachedPath.reduce<WayPoint[]>((acc, point) => {
          acc.unshift(point);
          return acc;
        }, []);
      }

      return cachedPath.slice(startIdx, endIdx);
    }

    return null;
  }

  private pathIsStillAvailable(path: WayPoint[]): boolean {
    return path.every((waypoint) => waypoint.isActive());
  }

  findPath(start: WayPoint, end: WayPoint): WayPoint[] | null {
    const pathFromCache = this.getPathFromCache(start, end);

    if (pathFromCache && this.pathIsStillAvailable(pathFromCache)) {
      return pathFromCache;
    }
    const newPath = aStar(start, end);

    if (newPath !== null) {
      this.addPath(newPath);

      console.log("cache update", { newPath }, this.cache);
    }
    return newPath;
  }
}
