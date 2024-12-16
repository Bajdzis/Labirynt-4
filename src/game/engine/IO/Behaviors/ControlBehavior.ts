import { IODevice } from "../Devices/IODevice";
import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class ControlBehavior<S> {
  private lastUsedSource: SourceOfControlBehavior<S> | null = null;
  private lastUsedSourceTimestamp: number = 0;
  constructor(private sources: SourceOfControlBehavior<S>[]) {}

  update(delta: number): void {
    this.sources.forEach((source) => {
      source.update(delta);
    });
  }

  add(source: SourceOfControlBehavior<S>) {
    this.sources.push(source);
  }

  getState(): S | null {
    for (const source of this.sources) {
      const state = source.getState();
      if (state !== null) {
        this.lastUsedSource = source;
        this.lastUsedSourceTimestamp = Date.now();
        return state;
      }
    }
    return null;
  }

  getLastUsedSource() {
    return {
      source: this.lastUsedSource,
      timestamp: this.lastUsedSourceTimestamp,
    };
  }

  getSourceByDevice(device: IODevice) {
    return this.sources.find((source) => source.device === device) ?? null;
  }
}
