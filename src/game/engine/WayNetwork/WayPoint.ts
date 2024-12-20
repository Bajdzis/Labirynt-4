import { InteractiveObject, Rectangle } from "../Board/BoardObject";
import { objectContainsOther } from "../Utils/math/objectContainsOther";

export class WayPoint {
  private rect: Rectangle;
  private interactiveObjects: InteractiveObject[] = [];
  private connectWaypointsAndDistance = new Map<WayPoint, number>();

  constructor(
    public x: number,
    public y: number,
  ) {
    this.rect = { x: x * 0.32, y: y * 0.32, width: 0.32, height: 0.32 };
  }

  getCenter() {
    return { x: this.rect.x, y: this.rect.y };
  }

  countAngleTo(wayPoint: WayPoint) {
    return Math.atan2(wayPoint.y - this.y, wayPoint.x - this.x);
  }

  isActive() {
    return this.interactiveObjects.every((interactiveObject) =>
      interactiveObject.isActive(),
    );
  }

  assignToObject(interactiveObject: InteractiveObject) {
    this.interactiveObjects.push(interactiveObject);
  }

  unassignFromObject(interactiveObject: InteractiveObject) {
    this.interactiveObjects = this.interactiveObjects.filter(
      (object) => object !== interactiveObject,
    );
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

  contains(rect: Rectangle) {
    return objectContainsOther(this.rect, rect);
  }

  getConnectionsWithDistance() {
    return this.connectWaypointsAndDistance;
  }

  getConnectedWaypoints() {
    return Array.from(this.connectWaypointsAndDistance.keys());
  }
}
