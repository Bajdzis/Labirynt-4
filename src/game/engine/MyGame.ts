import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGame } from "./BrowserGame";
import { ThreeJsRenderer } from "./ThreeJsRenderer";

export class MyGame extends BrowserGame {
  private board: ThreeJsBoard;

  constructor(private renderer: ThreeJsRenderer) {
    super();
    this.board = new ThreeJsBoard();
  }

  protected update(delta: number) {
    this.renderer.update(delta);
    this.board.update(delta);
  }

  protected render() {
    this.renderer.render(this.board.getScene(), this.board.getCamera());
  }
}
