import { IODevice } from "../Devices/IODevice";
import { InputsNames } from "../Templates/InputTemplate";

export class SourceOfControlBehavior<S> {
  state: S | null = null;
  constructor(public readonly device: IODevice) {
    this.state = null;
  }

  getState(): S | null {
    return this.state;
  }

  update(delta: number): void {}

  getIconsIds(): InputsNames[] {
    return [];
  }
}
