export abstract class IODevice {
  abstract getNameOfDevice():
    | "keyboard"
    | "ps-gamepad"
    | "xbox-gamepad"
    | "touchscreen"
    | "mouse";
}
