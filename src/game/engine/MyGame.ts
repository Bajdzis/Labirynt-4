import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGame } from "./BrowserGame";
import { ThreeJsRenderer } from "./ThreeJsRenderer";
import { Resources } from "./Resources/Resources";

export class MyGame extends BrowserGame {
  private renderer: ThreeJsRenderer;
  private board: ThreeJsBoard;

  constructor(private resources: Resources) {
    super();
    this.renderer = new ThreeJsRenderer();
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
