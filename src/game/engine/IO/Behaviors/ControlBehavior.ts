import { SourceOfControlBehavior } from "./SourceOfControlBehavior";

export class ControlBehavior<S> {
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
      if (state) {
        return state;
      }
    }
    return null;
  }
}
