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
    const step = 0.001875 * delta;
    if (this.keyboard.isDown("KeyD")) {
      this.board.changePlayerPosition(step, 0);
    } else if (this.keyboard.isDown("KeyA")) {
      this.board.changePlayerPosition(-step, 0);
    }

    if (this.keyboard.isDown("KeyW")) {
      this.board.changePlayerPosition(0, step);
    } else if (this.keyboard.isDown("KeyS")) {
      this.board.changePlayerPosition(0, -step);
    }
  }

  protected render() {
    this.renderer.render(this.board.getScene());
  }
}
