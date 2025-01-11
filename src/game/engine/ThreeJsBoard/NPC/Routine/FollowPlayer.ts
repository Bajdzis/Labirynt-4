import { WayNetwork } from "../../../WayNetwork/WayNetwork";
import { ThreeJsPlayer } from "../../ThreeJsPlayer";
import { NPC } from "../NPC";
import { Routine } from "./domain";

export class FollowPlayer implements Routine {
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

      const pathToPlayer = this.wayNet.findPathByWayPoint(npcWp, playerWp);

      if (pathToPlayer === null) {
        npc.startDefaultRoutine();
        return;
      }

      pathToPlayer.forEach((wp, index) => {
        if (index !== 0) {
          npc.gotoAndLookAt(wp, 3);
        }
      });
    };

    npc.onSeePlayer((player) => {
      if (!trackingPlayer) {
        trackingPlayer = player;
        npc.clearTasks();
        refreshState();
      }
    });

    npc.onTouchPlayer((player) => {
      npc.clearTasks();
      npc.clearSense();
      npc.killPlayer(player);
    });

    npc.onTaskListIsEmpty(() => {
      refreshState();
    });
  }

  update() {}

  end() {}
}
