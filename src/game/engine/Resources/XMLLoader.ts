import { ResourcesLoader } from "./ResourcesLoader";

export class XMLLoader extends ResourcesLoader<DocumentXML> {
  constructor() {
    const loader = async (url: string) => {
      const response = await fetch(url);
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/xml");

      return new DocumentXML(doc);
    };
    super(loader);
  }
}

class DocumentXML {
  constructor(private document: Document) {}

  getRoot() {
    return this.document.documentElement;
  }

  getDocument() {
    return this.document;
  }

  traverse(callback: (type: string, attributes: AttributesXML) => void) {
    const root = this.getRoot();

    this.traverseChildren(root, callback);
  }

  private traverseChildren(
    node: Element,
    callback: (type: string, attributes: AttributesXML) => void,
  ) {
    callback(node.nodeName, new AttributesXML(node.attributes));

    node.childNodes.forEach((child) => {
      if (this.isNodeElement(child)) {
        this.traverseChildren(child, callback);
      }
    });
  }

  private isNodeElement(node: Node): node is Element {
    return node.nodeType === Node.ELEMENT_NODE;
  }
}

export class AttributesXML {
  constructor(private attributes: NamedNodeMap) {}

  getString(name: string) {
    const value = this.get(name);
    if (!value) {
      throw new Error(`Attribute ${name} not found`);
    }
    return value || "";
  }

  getArray(name: string) {
    return this.getString(name).split(",");
  }

  getInt(name: string) {
    const value = parseInt(this.getString(name));

    if (isNaN(value)) {
      throw new Error(`Attribute ${name} is not a number`);
    }
    return value;
  }

  getEnum<T extends string>(name: string, values: T[]): T {
    const value = this.getString(name);

    if (!values.includes(value as T)) {
      throw new Error(`Attribute ${name} has invalid value`);
    }

    return value as T;
  }

  pickArrValueByAttr<T>(name: string, values: T[]): T {
    const index = this.getInt(name);
    const value = values[index];

    if (!value) {
      throw new Error(`Attribute ${name} has invalid index`);
    }

    return value;
  }

  pickObjValueByAttr<T>(name: string, values: { [key: string]: T }): T {
    const id = this.getString(name);
    const value = values[id];

    if (!value) {
      throw new Error(`Attribute ${name} has invalid id`);
    }

    return value;
  }

  pickObjValuesByAttr<T>(name: string, values: { [key: string]: T }): T[] {
    const ids = this.getArray(name);

    return ids.map((id) => {
      if (!values[id]) {
        throw new Error(`Attribute ${name} has invalid id`);
      }

      return values[id];
    });
  }

  get(name: string) {
    return this.attributes.getNamedItem(name)?.value;
  }
}
