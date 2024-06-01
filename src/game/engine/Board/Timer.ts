export class Timer {
  private time: number = 0;

  constructor(
    private runAfter: number,
    private callback: () => void,
  ) {}

  update(delta: number) {
    this.time += delta;
    if (this.time > this.runAfter) {
      this.callback();
      this.time -= this.runAfter;
      this.update(0); // run again
    }
  }
}
