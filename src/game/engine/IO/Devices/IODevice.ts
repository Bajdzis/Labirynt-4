export abstract class IODevice {
  abstract getNameOfDevice():
    | "keyboard"
    | "ps-gamepad"
    | "vr-gamepad"
    | "xbox-gamepad"
    | "touchscreen"
    | "mouse"
    | "screen";
}
