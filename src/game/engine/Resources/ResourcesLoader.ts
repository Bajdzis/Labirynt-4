export class ResourcesLoader<T, S extends string = string> {
  private cache: { [key: string]: T } = {};

  constructor(private loader: (...args: S[]) => Promise<T>) {}

  public load(...args: S[]): Promise<T> {
    const key = args.join("-");
    if (this.cache[key]) {
      return Promise.resolve(this.cache[key]);
    }

    return this.loader(...args).then((result) => {
      this.cache[key] = result;
      return result;
    });
  }
}
