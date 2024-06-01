import { MyGame } from "./engine/MyGame";
import { Resources } from "./engine/Resources/Resources";

const resources = new Resources();

resources
  .prepareAllResources((progress) => {
    console.log(`Resources loaded: ${progress * 100}%`);
  })
  .then(() => {
    const game = new MyGame(resources);

    game.run();
  });
