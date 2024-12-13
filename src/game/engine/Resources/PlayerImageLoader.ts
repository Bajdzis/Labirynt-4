import * as THREE from "three";
import { ResourcesLoader } from "./ResourcesLoader";
import { renderImageWithColor } from "../Utils/render/renderImageWithColor";
import { ImageLoader } from "./ImageLoader";

export class PlayerImageLoader extends ResourcesLoader<THREE.Texture> {
  constructor(private imageLoader: ImageLoader) {
    const loader = (body: string, eyeballs: string, pupils: string) => {
      return this.preparePlayerTexture(body, eyeballs, pupils);
    };
    super(loader);
  }

  private preparePlayerTexture(
    body = "#fff",
    eyeballs = "#fff",
    pupils = "#000",
  ): Promise<THREE.Texture> {
    return Promise.all([
      this.imageLoader.load("resources/player/body.png"),
      this.imageLoader.load("resources/player/eyeballs.png"),
      this.imageLoader.load("resources/player/pupils.png"),
    ]).then(([bodyImg, eyeballsImg, pupilsImg]) => {
      let canvas: HTMLCanvasElement | null = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      let ctx = canvas.getContext("2d");

      if (!ctx) {
        return Promise.reject("Could not get 2d context");
      }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        renderImageWithColor(bodyImg, new THREE.Color(body)),
        0,
        0,
        canvas.width,
        canvas.height,
      );

      ctx.drawImage(
        renderImageWithColor(eyeballsImg, new THREE.Color(eyeballs)),
        0,
        0,
        canvas.width,
        canvas.height,
      );

      ctx.drawImage(
        renderImageWithColor(pupilsImg, new THREE.Color(pupils)),
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const texture = new THREE.Texture(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      );
      texture.needsUpdate = true;
      ctx = null;
      canvas = null;
      return texture;
    });
  }
}
