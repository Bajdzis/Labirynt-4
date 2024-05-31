import { MyGame } from "./engine/MyGame";
import { Resources } from "./engine/Resources/Resources";

const resources = new Resources();

resources
  .prepareAllResources((progress) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.setProgressBar("Przetwarzanie zasobów...", progress * 100);
    console.log(`Resources loaded: ${progress * 100}%`);
  })
  .then(() => {
    const game = new MyGame(resources);

    game.run();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.disposeProgressBar();
  });
