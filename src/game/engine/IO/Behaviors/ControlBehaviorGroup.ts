import { InputsNames } from "../Templates/InputTemplate";
import { ControlBehavior } from "./ControlBehavior";

export class ControlBehaviorGroup<
  T extends {
    [key: string]: ControlBehavior<unknown>;
  },
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private behaviors: T) {}

  getLastUsedSource() {
    const [lastUsedSource] = Object.values(this.behaviors)
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

  getInputsNames(behaviorKey: keyof T): InputsNames[] {
    const device = this.getLastUsedDevice();
    if (device === null) {
      return [];
    }

    const controlBehavior = this.behaviors[behaviorKey];

    const source = controlBehavior.getSourceByDevice(device);

    if (source === null) {
      return [];
    }

    return source.getIconsIds();
  }
}
