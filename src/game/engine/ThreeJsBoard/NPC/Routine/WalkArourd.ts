import { NPC } from "../NPC";
import { Routine } from "./domain";

export class WalkAround implements Routine {
  constructor(private onSeePlayerRoutine?: Routine) {}
  start(npc: NPC) {
    npc.clearAll();
    this.gotoRandomWaypoint(npc);

    npc.onTaskListIsEmpty(() => {
      this.gotoRandomWaypoint(npc);
    });

    const onSeePlayerRoutine = this.onSeePlayerRoutine;

    if (onSeePlayerRoutine) {
      npc.onSeePlayer(() => {
        npc.clearTasks();
        npc.startRoutine(onSeePlayerRoutine);
      });
    }
  }

  update() {}

  end() {}

  private gotoRandomWaypoint(npc: NPC) {
    const wp = npc.getCurrentWayPoint();

    const possibleDestinations = wp
      .getConnectedWaypoints()
      .filter((wp) => wp.isActive() && wp !== npc.beforeWaypoint);

    const nextDestination =
      possibleDestinations[
        Math.floor(Math.random() * possibleDestinations.length)
      ] || npc.beforeWaypoint;

    if (nextDestination !== wp) {
      const currentAngle = npc.getCurrentAngle();
      const targetAngle = npc
        .getCurrentWayPoint()
        .countAngleTo(nextDestination);
      if (Math.abs(currentAngle - targetAngle) < 0.01) {
        npc.gotoAndLookAt(nextDestination, 1);
      } else {
        npc.lookAt(nextDestination);
        npc.goTo(nextDestination, 1);
      }
    }
  }
}
