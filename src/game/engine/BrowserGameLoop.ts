import { updateGamepads } from "./IO/Devices/Gamepad";
import { developerPerformanceMeasure } from "./Utils/performanceMeasure";

export abstract class BrowserGameLoop {
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor() {
    this.gameLoop = this.gameLoop.bind(this);
  }

  private gameLoop(time: DOMHighResTimeStamp) {
    if (!this.isRunning) {
      return;
    }
    const delta = time - this.lastTime;
    this.lastTime = time;
    developerPerformanceMeasure.mark("update-started");
    updateGamepads();
    this.update(delta);
    developerPerformanceMeasure.mark("update-end");
    developerPerformanceMeasure.measure(
      "update-duration",
      "update-started",
      "update-end",
    );
    this.render();
    developerPerformanceMeasure.mark("render-end");
    developerPerformanceMeasure.measure(
      "render-duration",
      "update-end",
      "render-end",
    );
    developerPerformanceMeasure.measure(
      "loop-duration",
      "update-started",
      "render-end",
    );
    window.requestAnimationFrame(this.gameLoop);
  }

  run() {
    this.lastTime = performance.now();
    this.isRunning = true;
    window.requestAnimationFrame(this.gameLoop);
  }

  stop() {
    this.isRunning = false;
  }

  protected abstract update(delta: number): void;

  protected abstract render(): void;
}
