import { ResourcesLoader } from "./ResourcesLoader";

export class AudioLoader extends ResourcesLoader<HTMLAudioElement> {
  constructor() {
    const loader = (url: string) => {
      return new Promise<HTMLAudioElement>((resolve) => {
        const audio = new Audio(url);
        audio.onload = () => {
          // audio.oncanplay = () => {
          resolve(audio);
          // };
        };
        audio.onerror = (err) => {
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
