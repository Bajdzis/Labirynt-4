import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { ImageLoader } from "./ImageLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";
import { ThreeJsMaterialLoader } from "./ThreeJsMaterialLoader";
import { LevelLoader } from "./LevelLoader";
import { AudioLoader } from "./AudioLoader";

export class Resources {
  private threeJsTextureLoader = new ThreeJsTextureLoader();
  private imageLoader = new ImageLoader();
  private playerImageLoader = new PlayerImageLoader(this.imageLoader);
  private threeJsMaterialLoader = new ThreeJsMaterialLoader({
    textureLoader: this.threeJsTextureLoader,
    playerImageLoader: this.playerImageLoader,
  });
  private levelLoader = new LevelLoader({ imageLoader: this.imageLoader });
  private audioLoader = new AudioLoader();

  private _data:
    | Awaited<ReturnType<typeof this.createAllResources>>
    | undefined = undefined;

  get data() {
    if (!this._data) {
      throw new Error("Resources are not loaded yet");
    }
    return this._data;
  }

  private async createAllResources(
    progressCallback: (progress: number) => void,
  ) {
    let numberOfLoaded = 0;
    let numberOfResources = 0;

    const counter = <T>(promise: Promise<T>): Promise<T> => {
      numberOfResources++;
      promise.then(() => {
        numberOfLoaded++;
        progressCallback(numberOfLoaded / numberOfResources);
      });
      return promise;
    };

    const wallMaterial = counter(this.threeJsMaterialLoader.load("wall"));
    const floorMaterial = counter(this.threeJsMaterialLoader.load("floor"));

    const floorShadowMaterial = counter(
      this.threeJsMaterialLoader.load("floorShadow"),
    );
    const playerMaterial = counter(this.threeJsMaterialLoader.load("player1"));
    const playerMaterial2 = counter(this.threeJsMaterialLoader.load("player2"));
    const wallOutline = counter(this.threeJsMaterialLoader.load("wallOutline"));

    return {
      materials: {
        wall: await wallMaterial,
        floor: await floorMaterial,
        floorShadow: await floorShadowMaterial,
        player1: await playerMaterial,
        player2: await playerMaterial2,
        wallOutline: await wallOutline,
      },
      levels: await Promise.all([
        counter(this.levelLoader.load("resources/level1.png")),
        counter(this.levelLoader.load("resources/level2.png")),
      ]),
      sounds: {
        theme: await counter(
          this.audioLoader.load("resources/sounds/theme.mp3", "1"),
        ),
        door: await counter(
          this.audioLoader.load("resources/sounds/interactions/door.mp3", "1"),
        ),
        switch: await counter(
          this.audioLoader.load(
            "resources/sounds/interactions/switch.mp3",
            "1",
          ),
        ),
        teleport: await counter(
          this.audioLoader.load(
            "resources/sounds/interactions/teleport.mp3",
            "1",
          ),
        ),
        torch: await counter(
          this.audioLoader.load("resources/sounds/interactions/torch.mp3", "1"),
        ),
      },
    };
  }

  async prepareAllResources(
    progressCallback: (progress: number) => void,
  ): Promise<void> {
    this._data = await this.createAllResources(progressCallback);
  }
}

export const resources = new Resources();
