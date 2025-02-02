import { AsyncStorage } from "./AsyncStorage";

class ElectronIntegration {
  private storage: AsyncStorage | null;
  constructor() {
    this.storage = null;
    if (window.electronBridge) {
      this.storage = new ElectronStorage(window.electronBridge);
    }
  }
  isAvailable() {
    return window.electronBridge !== undefined;
  }
  exit() {
    window.electronBridge?.sendEvent("exit");
  }
  openFullscreen() {
    window.electronBridge?.sendEvent("openFullscreen");
  }
  showWindow() {
    window.electronBridge?.sendEvent("showWindow");
  }
  getStorage() {
    return this.storage;
  }
}

class ElectronStorage implements AsyncStorage {
  constructor(private electronBridge: NonNullable<Window["electronBridge"]>) {}
  setItem(key: string, value: string) {
    this.electronBridge.setItem(key, value);
  }
  getItem(key: string) {
    return this.electronBridge.getItem(key) ?? null;
  }
  removeItem(key: string) {
    this.electronBridge.removeItem(key);
  }
  clear(): void {
    throw new Error("Method not implemented yet.");
  }
  key(index: number): string | null {
    throw new Error("Method not implemented yet.");
  }
  get length() {
    return 0;
  }
}

export const electronIntegration = new ElectronIntegration();
