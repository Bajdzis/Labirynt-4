import * as THREE from "three";
import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { ImageLoader } from "./ImageLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";
import { ThreeJsMaterialLoader } from "./ThreeJsMaterialLoader";

export class Resources {
  private threeJsTextureLoader = new ThreeJsTextureLoader();
  private imageLoader = new ImageLoader();
  private playerImageLoader = new PlayerImageLoader(this.imageLoader);
  private threeJsMaterialLoader = new ThreeJsMaterialLoader({
    textureLoader: this.threeJsTextureLoader,
    playerImageLoader: this.playerImageLoader,
  });

  private _material:
    | {
        wall: THREE.Material;
        floor: THREE.Material;
        floorShadow: THREE.Material;
        player1: THREE.Material;
        player2: THREE.Material;
      }
    | undefined = undefined;

  get material() {
    if (!this._material) {
      throw new Error("Resources are not loaded yet");
    }
    return this._material;
  }

  async prepareAllResources(
    progressCallback: (progress: number) => void,
  ): Promise<void> {
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

    this._material = {
      wall: await wallMaterial,
      floor: await floorMaterial,
      floorShadow: await floorShadowMaterial,
      player1: await playerMaterial,
      player2: await playerMaterial2,
    };

    console.log(this._material);
  }
}
