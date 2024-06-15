import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGame } from "./BrowserGame";
import { ThreeJsRenderer } from "./ThreeJsRenderer";
import { Resources } from "./Resources/Resources";

export class MyGame extends BrowserGame {
  private board: ThreeJsBoard;

  constructor(
    private resources: Resources,
    private renderer: ThreeJsRenderer,
  ) {
    super();
    this.board = new ThreeJsBoard(this.resources);
  }

  protected update(delta: number) {
    this.renderer.update(delta);
    this.board.update(delta);
  }

  protected render() {
    this.renderer.render(this.board.getScene());
  }
}
