export class SourceOfControlBehavior<S> {
  state: S | null = null;
  constructor() {
    this.state = null;
  }

  getState(): S | null {
    return this.state;
  }

  update(delta: number): void {}
}
