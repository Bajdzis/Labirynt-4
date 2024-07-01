import { ResourcesLoader } from "./ResourcesLoader";

export class XMLLoader extends ResourcesLoader<Document> {
  constructor() {
    const loader = async (url: string) => {
      const response = await fetch(url);
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      return doc;
    };
    super(loader);
  }
}
