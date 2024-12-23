import { IODevice } from "./IODevice";

export type KeyboardCode =
  | "Unidentified"
  | "Escape"
  | "Digit1"
  | "Digit2"
  | "Digit3"
  | "Digit4"
  | "Digit5"
  | "Digit6"
  | "Digit7"
  | "Digit8"
  | "Digit9"
  | "Digit0"
  | "Minus"
  | "Equal"
  | "Backspace"
  | "Tab"
  | "KeyQ"
  | "KeyW"
  | "KeyE"
  | "KeyR"
  | "KeyT"
  | "KeyY"
  | "KeyU"
  | "KeyI"
  | "KeyO"
  | "KeyP"
  | "BracketLeft"
  | "BracketRight"
  | "Enter"
  | "ControlLeft"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyF"
  | "KeyG"
  | "KeyH"
  | "KeyJ"
  | "KeyK"
  | "KeyL"
  | "Semicolon"
  | "Quote"
  | "Backquote"
  | "ShiftLeft"
  | "Backslash"
  | "KeyZ"
  | "KeyX"
  | "KeyC"
  | "KeyV"
  | "KeyB"
  | "KeyN"
  | "KeyM"
  | "Comma"
  | "Period"
  | "Slash"
  | "ShiftRight"
  | "NumpadMultiply"
  | "AltLeft"
  | "Space"
  | "CapsLock"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "Pause"
  | "ScrollLock"
  | "Numpad7"
  | "Numpad8"
  | "Numpad9"
  | "NumpadSubtract"
  | "Numpad4"
  | "Numpad5"
  | "Numpad6"
  | "NumpadAdd"
  | "Numpad1"
  | "Numpad2"
  | "Numpad3"
  | "Numpad0"
  | "NumpadDecimal"
  | "PrintScreen"
  | "IntlBackslash"
  | "F11"
  | "F12"
  | "NumpadEqual"
  | "F13"
  | "F14"
  | "F15"
  | "F16"
  | "F17"
  | "F18"
  | "F19"
  | "F20"
  | "F21"
  | "F22"
  | "F23"
  | "F24"
  | "KanaMode"
  | "Lang2"
  | "Lang1"
  | "IntlRo"
  | "Lang4"
  | "Lang3"
  | "Convert"
  | "NonConvert"
  | "IntlYen"
  | "NumpadComma"
  | "Undo"
  | "Paste"
  | "MediaTrackPrevious"
  | "Cut"
  | "Copy"
  | "MediaTrackNext"
  | "NumpadEnter"
  | "ControlRight"
  | "LaunchMail"
  | "AudioVolumeMute"
  | "LaunchApp2"
  | "MediaPlayPause"
  | "MediaStop"
  | "Eject"
  | "VolumeDown"
  | "AudioVolumeDown"
  | "VolumeUp"
  | "AudioVolumeUp"
  | "BrowserHome"
  | "NumpadDivide"
  | "AltRight"
  | "Help"
  | "NumLock"
  | "Home"
  | "ArrowUp"
  | "PageUp"
  | "ArrowLeft"
  | "ArrowRight"
  | "End"
  | "ArrowDown"
  | "PageDown"
  | "Insert"
  | "Delete"
  | "MetaLeft"
  | "OSLeft"
  | "MetaRight"
  | "OSRight"
  | "ContextMenu"
  | "Power"
  | "Sleep"
  | "WakeUp"
  | "BrowserSearch"
  | "BrowserFavorites"
  | "BrowserRefresh"
  | "BrowserStop"
  | "BrowserForward"
  | "BrowserBack"
  | "LaunchApp1"
  | "MediaSelect";

class Keyboard extends IODevice {
  private keyState: {
    [key in string | KeyboardCode]?: boolean;
  } = {};

  constructor() {
    super();
    window.addEventListener(
      "keydown",
      (e) => {
        this.keyState[e.code] = true;
      },
      false,
    );

    window.addEventListener(
      "keyup",
      (e) => {
        this.keyState[e.code] = false;
      },
      false,
    );
  }

  getNameOfDevice(): "keyboard" {
    return "keyboard";
  }

  isDown(keyCode: KeyboardCode): boolean {
    return !!this.keyState[keyCode];
  }
}

export const keyboard = new Keyboard();
