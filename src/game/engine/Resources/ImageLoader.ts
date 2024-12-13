import { ResourcesLoader } from "./ResourcesLoader";

export class ImageLoader extends ResourcesLoader<HTMLImageElement> {
  constructor() {
    const loader = (url: string) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = url;

        const resolveHandler = () => {
          img.removeEventListener("load", resolveHandler);
          img.removeEventListener("error", errorHandler);

          resolve(img);
        };
        const errorHandler = (err: ErrorEvent) => {
          img.removeEventListener("load", resolveHandler);
          img.removeEventListener("error", errorHandler);
          console.warn(err);
          setTimeout(() => {
            loader(url).then(resolve);
          }, 2000);
        };

        img.addEventListener("load", resolveHandler);
        img.addEventListener("error", errorHandler);
      });
    };
    super(loader);
  }
}
