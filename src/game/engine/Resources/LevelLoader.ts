import { ResourcesLoader } from "./ResourcesLoader";
import { ImageLoader } from "./ImageLoader";

interface LevelLoaderProps {
  imageLoader: ImageLoader;
}

export interface Level {
  wallsPositions: [number, number][];
  slotsPositions: [number, number][];
  startPosition: [number, number];
  endPosition: [number, number];
}

export class LevelLoader extends ResourcesLoader<Level> {
  constructor(private props: LevelLoaderProps) {
    const loader = async (url: string) => {
      const levelImage = await props.imageLoader.load(url);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = levelImage.width;
      canvas.height = levelImage.height;

      if (!context) {
        throw new Error("Context not found");
      }
      context.drawImage(levelImage, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const wallsPositions: [number, number][] = [];
      const slotsPositions: [number, number][] = [];
      let startPosition: [number, number] = [0, 0];
      let endPosition: [number, number] = [0, 0];

      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const index = (y * canvas.width + x) * 4;
          const red = imageData.data[index];
          const green = imageData.data[index + 1];
          const blue = imageData.data[index + 2];

          // Check the color of the pixel and determine the position
          if (red === 0 && green === 0 && blue === 0) {
            wallsPositions.push([x, -y]);
          } else if (red === 0 && green === 0 && blue === 255) {
            slotsPositions.push([x, -y]);
          } else if (red === 255 && green === 0 && blue === 0) {
            startPosition = [x, -y];
          } else if (red === 0 && green === 255 && blue === 0) {
            endPosition = [x, -y];
          }
        }
      }
      const levelData = {
        wallsPositions,
        slotsPositions,
        startPosition,
        endPosition,
      };

      return levelData;
    };
    super(loader);
  }
}
