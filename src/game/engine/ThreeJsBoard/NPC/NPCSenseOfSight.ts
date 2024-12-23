import { BoardObject, Rectangle } from "../../Board/BoardObject";
import { WayPoint } from "../../WayNetwork/WayPoint";
import { NPC } from "./NPC";
import { NPCSense } from "./NPCSense";

export class NPCSenseOfSight<
  T extends BoardObject & Rectangle,
> extends NPCSense<T> {
  constructor(
    objectToSearch: new (...args: any) => T,
    range: number,
    npc: NPC,
  ) {
    super([objectToSearch], range, npc, 250);
  }

  protected isValidObservationWaypoint(waypoint: WayPoint, distance: number) {
    if (!waypoint.isActive()) {
      return false;
    }
    if (!super.isValidObservationWaypoint(waypoint, distance)) {
      return false;
    }
    const npcAngle = this.npc.getCurrentAngle();
    const waypointAngle = this.npc.getCurrentWayPoint().countAngleTo(waypoint);
    const diffAngle = Math.abs(npcAngle - waypointAngle);
    return diffAngle < Math.PI / 3;
  }
}
