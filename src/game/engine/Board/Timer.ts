export class Timer {
  private time: number = 0;

  constructor(
    private runAfter: number,
    private callback: () => void,
    private active: boolean = true,
  ) {}

  stop() {
    this.time = 0;
    this.active = false;
  }

  start() {
    this.active = true;
  }

  reset() {
    this.time = 0;
  }

  update(delta: number) {
    if (!this.active) {
      return;
    }
    this.time += delta;
    while (this.time > this.runAfter) {
      this.callback();
      this.time -= this.runAfter;
    }
  }
}
