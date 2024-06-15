export class Timer {
  private time: number = 0;

  constructor(
    private runAfter: number,
    private callback: () => void,
  ) {}

  update(delta: number) {
    this.time += delta;
    while (this.time > this.runAfter) {
      this.callback();
      this.time -= this.runAfter;
    }
  }
}
