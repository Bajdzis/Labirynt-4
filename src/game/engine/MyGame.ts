import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGame } from "./BrowserGame";
import { ThreeJsRenderer } from "./ThreeJsRenderer";

export class MyGame extends BrowserGame {
  private board: ThreeJsBoard;

  constructor(private renderer: ThreeJsRenderer) {
    super();
    this.board = new ThreeJsBoard(renderer.getGameCamera());
  }

  protected update(delta: number) {
    this.renderer.update(delta);
    this.board.update(delta);
  }

  protected render() {
    this.renderer.render(this.board.getScene());
  }

  getScene() {
    const board = new ThreeJsBoard(this.renderer.getGameCamera());
    board.loadLevel(2);
    board.update(0);
    return board.getScene();
  }
}
