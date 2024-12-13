import { ResourcesLoader } from "./ResourcesLoader";

export class AudioLoader extends ResourcesLoader<GameAudio> {
  constructor() {
    const loader = (url: string, volume: string) => {
      return new Promise<GameAudio>((resolve) => {
        const audio = new Audio(url);

        const resolveHandler = () => {
          audio.removeEventListener("canplay", resolveHandler);
          audio.removeEventListener("error", errorHandler);
          resolve(new GameAudio(audio, parseFloat(volume)));
        };
        const errorHandler = (err: ErrorEvent) => {
          console.warn(err);
          audio.removeEventListener("canplay", resolveHandler);
          audio.removeEventListener("error", errorHandler);
          setTimeout(() => {
            loader(url, volume).then(resolve);
          }, 2000);
        };
        audio.addEventListener("canplay", resolveHandler);
        audio.addEventListener("error", errorHandler);
      });
    };
    super(loader);
  }
}

export class GameAudio {
  private clone: HTMLAudioElement;

  constructor(
    private base: HTMLAudioElement,
    private volume: number,
  ) {
    this.clone = this.base.cloneNode(true) as HTMLAudioElement;
    this.clone.volume = this.volume;
  }

  play() {
    this.clone.play();
    this.clone = this.base.cloneNode(true) as HTMLAudioElement;
    this.clone.volume = this.volume;
  }
}
