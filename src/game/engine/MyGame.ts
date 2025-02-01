import { ThreeJsBoard } from "./ThreeJsBoard/ThreeJsBoard";
import { BrowserGameLoop } from "./BrowserGameLoop";
import { ThreeJsRenderer } from "./ThreeJsRenderer";
import { MyGameStatus } from "./SavedStatus/GameSavedStatus";

export class MyGame extends BrowserGameLoop {
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

  runMyGame(status: MyGameStatus | null): void {
    this.board.load(status);
    super.run();
  }

  getScene() {
    const board = new ThreeJsBoard(this.renderer.getGameCamera());
    board.loadLevel(2);
    board.update(0);
    return board.getScene();
  }
}
