import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { ImageLoader } from "./ImageLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";
import { ThreeJsMaterialLoader } from "./ThreeJsMaterialLoader";
import { Level, LevelLoader } from "./LevelLoader";
import { AudioLoader, GameAudio } from "./AudioLoader";
import { Material } from "three";

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

  private async createMaterialsResources(
    counter: (promise: Promise<Material>) => Promise<Material>,
  ) {
    const wall = counter(this.threeJsMaterialLoader.load("wall"));
    const floor = counter(this.threeJsMaterialLoader.load("floor"));
    const floorShadow = counter(this.threeJsMaterialLoader.load("floorShadow"));
    const playerl = counter(this.threeJsMaterialLoader.load("player1"));
    const player2 = counter(this.threeJsMaterialLoader.load("player2"));
    const wallOutline = counter(this.threeJsMaterialLoader.load("wallOutline"));

    return {
      wall: await wall,
      floor: await floor,
      floorShadow: await floorShadow,
      player1: await playerl,
      player2: await player2,
      wallOutline: await wallOutline,
    };
  }

  private async createSoundsResources(
    counter: (promise: Promise<GameAudio>) => Promise<GameAudio>,
  ) {
    const theme = counter(
      this.audioLoader.load("resources/sounds/theme.mp3", "1"),
    );
    const door = counter(
      this.audioLoader.load("resources/sounds/interactions/door.mp3", "1"),
    );
    const switchAudio = counter(
      this.audioLoader.load("resources/sounds/interactions/switch.mp3", "1"),
    );
    const teleport = counter(
      this.audioLoader.load("resources/sounds/interactions/teleport.mp3", "1"),
    );
    const torch = counter(
      this.audioLoader.load("resources/sounds/interactions/torch.mp3", "1"),
    );

    return {
      theme: await theme,
      door: await door,
      switch: await switchAudio,
      teleport: await teleport,
      torch: await torch,
    };
  }

  private async createLevelResources(
    counter: (promise: Promise<Level>) => Promise<Level>,
  ) {
    return Promise.all([
      counter(this.levelLoader.load("resources/level1.png")),
      counter(this.levelLoader.load("resources/level2.png")),
    ]);
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

    const sounds = this.createSoundsResources(counter);
    const materials = this.createMaterialsResources(counter);
    const levels = this.createLevelResources(counter);

    return {
      materials: await materials,
      levels: await levels,
      sounds: await sounds,
    };
  }

  async prepareAllResources(
    progressCallback: (progress: number) => void,
  ): Promise<void> {
    this._data = await this.createAllResources(progressCallback);
  }
}

export const resources = new Resources();
