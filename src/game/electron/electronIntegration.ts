class ElectronIntegration {
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
}

export const electronIntegration = new ElectronIntegration();
