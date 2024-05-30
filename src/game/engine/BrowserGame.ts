export abstract class BrowserGame {
  private lastTime: number = 0;

  constructor() {
    this.gameLoop = this.gameLoop.bind(this);
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    const delta = time - this.lastTime;
    this.lastTime = time;
    this.update(delta);
    this.render();
    window.requestAnimationFrame(this.gameLoop);
  }

  run() {
    this.lastTime = performance.now();
    window.requestAnimationFrame(this.gameLoop);
  }

  protected abstract update(delta: number): void;

  protected abstract render(): void;
}
