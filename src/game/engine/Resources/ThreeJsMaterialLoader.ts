import * as THREE from "three";
import { ResourcesLoader } from "./ResourcesLoader";
import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";

type MaterialName =
  | "wall"
  | "torch"
  | "door"
  | "key"
  | "cauldron"
  | "wallOutline"
  | "floor"
  | "floorShadow"
  | "player1"
  | "player2"
  | "playerDead"
  | "ghost"
  | "mummy";

interface MaterialLoaderProps {
  textureLoader: ThreeJsTextureLoader;
  playerImageLoader: PlayerImageLoader;
}

export class ThreeJsMaterialLoader extends ResourcesLoader<
  THREE.Material,
  MaterialName
> {
  constructor(props: MaterialLoaderProps) {
    const loader = (name: MaterialName) => {
      return this[name](props);
    };
    super(loader);
  }

  wall({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader
      .load("resources/elements/walls.png")
      .then((texture) => {
        return new THREE.MeshStandardMaterial({
          roughness: 1,
          metalness: 0,
          map: texture,
          bumpMap: texture,
          bumpScale: 0.75,
        });
      });
  }

  door({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("resources/elements/door.png").then((texture) => {
      return new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
        map: texture,
        bumpMap: texture,
        bumpScale: 0.75,
      });
    });
  }

  key({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("resources/elements/key.png").then((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });
    });
  }

  cauldron({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader
      .load("resources/elements/cauldron.png")
      .then((texture) => {
        return new THREE.MeshStandardMaterial({
          map: texture,
          bumpMap: texture,
          transparent: true,
          opacity: 1,
        });
      });
  }

  ghost({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("resources/npc/ghost.png").then((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });
    });
  }

  mummy({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("resources/npc/mummy.png").then((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });
    });
  }

  playerDead({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("resources/player/dead.png").then((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });
    });
  }

  async torch(): Promise<THREE.Material> {
    return new THREE.MeshStandardMaterial({ color: "brown" });
  }

  private getFloorTexture({
    textureLoader,
  }: MaterialLoaderProps): Promise<THREE.Texture> {
    return textureLoader.load("resources/floor.png").then((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3.2 * 100, 3.2 * 100);

      return texture;
    });
  }

  floor(props: MaterialLoaderProps): Promise<THREE.Material> {
    return this.getFloorTexture(props).then((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
      });
    });
  }

  floorShadow(props: MaterialLoaderProps): Promise<THREE.Material> {
    return this.getFloorTexture(props).then((texture) => {
      return new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.25,
        map: texture,
      });
    });
  }

  player(
    { playerImageLoader }: MaterialLoaderProps,
    color: string,
  ): Promise<THREE.Material> {
    return playerImageLoader.load(color).then((texture) => {
      return new THREE.MeshBasicMaterial({
        color: "white",
        map: texture,
        transparent: true,
      });
    });
  }

  player1(props: MaterialLoaderProps): Promise<THREE.Material> {
    return this.player(props, "yellow");
  }

  player2(props: MaterialLoaderProps): Promise<THREE.Material> {
    return this.player(props, "red");
  }

  wallOutline(): Promise<THREE.Material> {
    return new Promise((resolve) => {
      resolve(
        new THREE.MeshStandardMaterial({
          color: "#505050",
          roughness: 1,
          metalness: 0,
        }),
      );
    });
  }
}
