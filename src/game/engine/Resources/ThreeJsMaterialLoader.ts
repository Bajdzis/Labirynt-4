import * as THREE from "three";
import { ResourcesLoader } from "./ResourcesLoader";
import { ThreeJsTextureLoader } from "./ThreeJsTextureLoader";
import { PlayerImageLoader } from "./PlayerImageLoader";

type MaterialName = "wall" | "floor" | "player1" | "player2";

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
    return textureLoader.load("/resources/walls/1.PNG").then((texture) => {
      return new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 0,
        map: texture,
      });
    });
  }

  floor({ textureLoader }: MaterialLoaderProps): Promise<THREE.Material> {
    return textureLoader.load("/resources/floor.png").then((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3.2 * 10, 3.2 * 10);
      return new THREE.MeshStandardMaterial({
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
}
