import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { ImageLoader } from "./ImageLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";
import { ThreeJsMaterialLoader } from "./ThreeJsMaterialLoader";
import { Level, LevelLoader } from "./LevelLoader";
import { AudioLoader, GameAudio } from "./AudioLoader";
import { Material } from "three";
import { XMLLoader } from "./XMLLoader";

export class Resources {
  private threeJsTextureLoader = new ThreeJsTextureLoader();
  private imageLoader = new ImageLoader();
  private playerImageLoader = new PlayerImageLoader(this.imageLoader);
  private threeJsMaterialLoader = new ThreeJsMaterialLoader({
    textureLoader: this.threeJsTextureLoader,
    playerImageLoader: this.playerImageLoader,
  });
  private xmlLoader = new XMLLoader();
  private levelLoader = new LevelLoader({
    imageLoader: this.imageLoader,
    xmlLoader: this.xmlLoader,
  });
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
    const torch = counter(this.threeJsMaterialLoader.load("torch"));
    const floor = counter(this.threeJsMaterialLoader.load("floor"));
    const door = counter(this.threeJsMaterialLoader.load("door"));
    const key = counter(this.threeJsMaterialLoader.load("key"));
    const cauldron = counter(this.threeJsMaterialLoader.load("cauldron"));
    const floorShadow = counter(this.threeJsMaterialLoader.load("floorShadow"));
    const playerl = counter(this.threeJsMaterialLoader.load("player1"));
    const player2 = counter(this.threeJsMaterialLoader.load("player2"));
    const playerDead = counter(this.threeJsMaterialLoader.load("playerDead"));
    const ghost = counter(this.threeJsMaterialLoader.load("ghost"));
    const mummy = counter(this.threeJsMaterialLoader.load("mummy"));
    const wallOutline = counter(this.threeJsMaterialLoader.load("wallOutline"));

    return {
      wall: await wall,
      torch: await torch,
      floor: await floor,
      door: await door,
      key: await key,
      cauldron: await cauldron,
      floorShadow: await floorShadow,
      player1: await playerl,
      player2: await player2,
      playerDead: await playerDead,
      ghost: await ghost,
      mummy: await mummy,
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
    const doorWithoutConnectedKey = Promise.all([
      counter(
        this.audioLoader.load(
          "resources/sounds/interactions/doorMessages/doorWithoutConnectedKey_1.mp3",
          "0.8",
        ),
      ),
      counter(
        this.audioLoader.load(
          "resources/sounds/interactions/doorMessages/doorWithoutConnectedKey_2.mp3",
          "0.8",
        ),
      ),
    ]);
    const youDoNotHaveACorrectKey = Promise.all([
      counter(
        this.audioLoader.load(
          "resources/sounds/interactions/doorMessages/youDontHaveACorrectKey_1.mp3",
          "0.8",
        ),
      ),
      counter(
        this.audioLoader.load(
          "resources/sounds/interactions/doorMessages/youDontHaveACorrectKey_2.mp3",
          "0.8",
        ),
      ),
    ]);
    const switchAudio = counter(
      this.audioLoader.load("resources/sounds/interactions/switch.mp3", "1"),
    );
    const teleport = counter(
      this.audioLoader.load("resources/sounds/interactions/teleport.mp3", "1"),
    );
    const torch = counter(
      this.audioLoader.load("resources/sounds/interactions/torch.mp3", "1"),
    );
    const key = counter(
      this.audioLoader.load("resources/sounds/interactions/key.mp3", "1"),
    );

    return {
      theme: await theme,
      door: await door,
      doorWithoutConnectedKey: await doorWithoutConnectedKey,
      youDoNotHaveACorrectKey: await youDoNotHaveACorrectKey,
      switch: await switchAudio,
      teleport: await teleport,
      torch: await torch,
      key: await key,
    };
  }

  private async createLevelResources(
    counter: (promise: Promise<Level>) => Promise<Level>,
  ) {
    return Promise.all([
      // counter(this.levelLoader.load("resources/level0.xml")),
      counter(this.levelLoader.load("resources/onboarding1.xml")),
      counter(this.levelLoader.load("resources/onboarding2.xml")),
      counter(this.levelLoader.load("resources/level1.xml")),
      counter(this.levelLoader.load("resources/level8.xml")),
      counter(this.levelLoader.load("resources/level5.xml")),
      counter(this.levelLoader.load("resources/level6.xml")),
      counter(this.levelLoader.load("resources/level7.xml")),
      counter(this.levelLoader.load("resources/level4.xml")),
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
