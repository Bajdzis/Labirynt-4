import { ResourcesLoader } from "./ResourcesLoader";

export class ImageLoader extends ResourcesLoader<HTMLImageElement> {
  constructor() {
    const loader = (url: string) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (err) => {
          console.warn(err);
          setTimeout(() => {
            loader(url).then(resolve);
          }, 2000);
        };
      });
    };
    super(loader);
  }
}
