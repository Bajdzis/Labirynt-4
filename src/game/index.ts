import { MyGame } from "./engine/MyGame";
import { Resources } from "./engine/Resources/Resources";

// @ts-ignore
window.setProgressBar("Przetwarzanie zasobów...", 2);

const resources = new Resources();

resources
  .prepareAllResources((progress) => {
    // @ts-ignore
    window.setProgressBar("Przetwarzanie zasobów...", progress * 100);
  })
  .then(() => {
    const game = new MyGame(resources);

    game.run();
    // @ts-ignore
    window.disposeProgressBar();
  });
