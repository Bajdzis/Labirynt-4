import { WayPoint } from "../../../WayNetwork/WayPoint";
import { NPC } from "../NPC";
import { Routine } from "./domain";

export class WalkAround implements Routine {
  private wayPointBefore: WeakMap<NPC, WayPoint> = new WeakMap();
  constructor() {}
  start(npc: NPC) {
    npc.clearAll();
    this.gotoRandomWaypoint(npc);

    npc.onTaskListIsEmpty(() => {
      this.gotoRandomWaypoint(npc);
    });
  }

  update() {}

  end() {}

  private gotoRandomWaypoint(npc: NPC) {
    const wp = npc.getCurrentWayPoint();

    const possibleDestinations = wp
      .getConnectedWaypoints()
      .filter((wp) => wp.isActive() && wp !== this.wayPointBefore.get(npc));

    const nextDestination =
      possibleDestinations[
        Math.floor(Math.random() * possibleDestinations.length)
      ] || this.wayPointBefore.get(npc);

    this.wayPointBefore.set(npc, wp);
    if (nextDestination) {
      npc.lookAt(nextDestination);
      npc.goTo(nextDestination);
      // npc.gotoAndLookAt(nextDestination);
    }
  }
}
