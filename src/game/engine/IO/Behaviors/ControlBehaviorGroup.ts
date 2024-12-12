import { ControlBehavior } from "./ControlBehavior";

export class ControlBehaviorGroup {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private behaviors: ControlBehavior<any>[]) {}

  getLastUsedSource() {
    const [lastUsedSource] = this.behaviors
      .map((behavior) => {
        return behavior.getLastUsedSource();
      })
      .sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
    return lastUsedSource;
  }

  getLastUsedDevice() {
    return this.getLastUsedSource().source?.device ?? null;
  }
}
