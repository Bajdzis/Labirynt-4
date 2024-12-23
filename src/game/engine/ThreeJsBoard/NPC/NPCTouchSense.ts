import { BoardObject, Rectangle } from "../../Board/BoardObject";
import { objectContainsOther } from "../../Utils/math/objectContainsOther";
import { NPC } from "./NPC";

export class NPCTouchSense<T extends BoardObject & Rectangle> {
  private listenersOnActive: ((object: T) => void)[] = [];
  private listenersOnDeactivate: (() => void)[] = [];
  private isActivated = false;
  constructor(
    private objectsToSearch: (new (...args: any) => T)[],
    protected npc: NPC,
  ) {}

  private filterObject(objects: BoardObject[]): T[] {
    return objects.filter((object) =>
      this.objectsToSearch.some((construct) => object instanceof construct),
    ) as T[];
  }

  searchObjectInSenseRange(objects: BoardObject[]) {
    if (this.listenersOnActive.length === 0) {
      return;
    }
    let activated = false;

    this.filterObject(objects).forEach((object) => {
      if (objectContainsOther(object, this.npc)) {
        activated = true;
        this.listenersOnActive.forEach((listener) => listener(object));
      }
    });
    if (activated === false && this.isActivated === true) {
      if (!activated) {
        this.listenersOnDeactivate.forEach((listener) => listener());
      }
    }
    this.isActivated = activated;
  }

  update(delta: number, objects: BoardObject[]) {
    this.searchObjectInSenseRange(objects);
  }

  public addListener(
    listenerOnActive: (object: T) => void,
    listenerOnDeActive?: () => void,
  ) {
    this.listenersOnActive.push(listenerOnActive);
    if (listenerOnDeActive) {
      this.listenersOnDeactivate.push(listenerOnDeActive);
    }

    return () => {
      this.listenersOnActive = this.listenersOnActive.filter(
        (l) => l !== listenerOnActive,
      );
      if (listenerOnDeActive) {
        this.listenersOnDeactivate = this.listenersOnDeactivate.filter(
          (l) => l !== listenerOnDeActive,
        );
      }
    };
  }

  public clear() {
    this.listenersOnActive = [];
    this.listenersOnDeactivate = [];
  }
}
