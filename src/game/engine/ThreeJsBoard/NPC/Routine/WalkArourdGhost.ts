import { NPC } from "../NPC";
import { Routine } from "./domain";

export class WalkAroundGhost implements Routine {
  constructor(private onSeePlayerRoutine?: Routine) {}
  start(npc: NPC) {
    npc.clearAll();
    this.gotoRandomWaypoint(npc);

    npc.onTaskListIsEmpty(() => {
      this.gotoRandomWaypoint(npc);
    });
    let walkingThroughWall = false;

    npc.onTouchWall(
      () => {
        walkingThroughWall = true;
        npc.throwAllItemImmediately();
      },
      () => {
        walkingThroughWall = false;
      },
    );

    npc.onTouchKey((key) => {
      if (!walkingThroughWall) {
        npc.clearTasks();
        npc.pickItem(key);
      }
    });
    npc.onTouchTorch((torch) => {
      if (!walkingThroughWall) {
        npc.clearTasks();
        npc.pickItem(torch);
      }
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
      .filter((wp) => wp !== npc.beforeWaypoint);

    const nextDestination =
      possibleDestinations[
        Math.floor(Math.random() * possibleDestinations.length)
      ] || npc.beforeWaypoint;

    if (nextDestination !== wp) {
      const currentAngle = npc.getCurrentAngle();
      const targetAngle = npc
        .getCurrentWayPoint()
        .countAngleTo(nextDestination);
      if (Math.abs(currentAngle - targetAngle) < 0.1) {
        npc.gotoAndLookAt(nextDestination, 1);
      } else {
        npc.lookAt(nextDestination);
        npc.goTo(nextDestination, 1);
      }
    }
  }
}
