import * as THREE from "three";

export const renderImageWithColor = (
  image: HTMLImageElement,
  color: THREE.Color,
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i + 0] *= color.r;
    imageData.data[i + 1] *= color.g;
    imageData.data[i + 2] *= color.b;
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas;
};
