import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGame } from "./BrowserGame";
import { Keyboard } from "./Keyboard";
import { ThreeJsRenderer } from "./ThreeJsRenderer";
import { Resources } from "./Resources/Resources";

export class MyGame extends BrowserGame {
  private keyboard: Keyboard;
  private renderer: ThreeJsRenderer;
  private board: ThreeJsBoard;

  constructor(private resources: Resources) {
    super();
    this.keyboard = new Keyboard();
    this.renderer = new ThreeJsRenderer();
    this.board = new ThreeJsBoard(this.resources);
  }

  protected update(delta: number) {
    this.renderer.update(delta);
    this.board.update(delta);
    const keyWIsDown = this.keyboard.isDown("KeyW");
    const keyAIsDown = this.keyboard.isDown("KeyA");
    const keySIsDown = this.keyboard.isDown("KeyS");
    const keyDIsDown = this.keyboard.isDown("KeyD");

    if (keyWIsDown || keyAIsDown || keySIsDown || keyDIsDown) {
      const step = 0.001875 * delta;

      this.board.changePlayerPosition(
        keyDIsDown ? step : keyAIsDown ? -step : 0,
        keyWIsDown ? step : keySIsDown ? -step : 0,
      );
    }
  }

  protected render() {
    this.renderer.render(this.board.getScene());
  }
}
