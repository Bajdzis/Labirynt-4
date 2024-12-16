export type IODeviceType =
  | "keyboard"
  | "ps-gamepad"
  | "vr-gamepad"
  | "xbox-gamepad"
  | "touchscreen"
  | "mouse"
  | "screen";

export abstract class IODevice {
  abstract getNameOfDevice(): IODeviceType;
}
