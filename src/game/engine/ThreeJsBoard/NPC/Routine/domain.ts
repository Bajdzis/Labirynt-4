import { NPC } from "../NPC";

export interface Routine {
  start: (npc: NPC) => void;
  update: (npc: NPC, delta: number) => void;
  end: (npc: NPC) => void;
}
