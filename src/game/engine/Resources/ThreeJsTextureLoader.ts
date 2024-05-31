import * as THREE from "three";
import { ResourcesLoader } from "./ResourcesLoader";

export class ThreeJsTextureLoader extends ResourcesLoader<THREE.Texture> {
  constructor() {
    const textureLoader = new THREE.TextureLoader();
    const loader = (url: string) => {
      return new Promise<THREE.Texture>((resolve) => {
        textureLoader.load(
          url,
          (texture) => {
            resolve(texture);
          },
          undefined,
          (err) => {
            console.warn(err);
            setTimeout(() => {
              loader(url).then(resolve);
            }, 2000);
          },
        );
      });
    };
    super(loader);
  }
}
