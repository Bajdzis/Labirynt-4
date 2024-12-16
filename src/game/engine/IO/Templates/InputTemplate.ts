import { Gamepad, GamepadInputsNames } from "../Devices/Gamepad";
import { KeyboardInputsNames } from "../Devices/Keyboard";
import { MobileGamepadInputsNames } from "../Devices/MobileGamepad";
import { MouseInputsNames } from "../Devices/Mouse";

export type InputsNames =
  | GamepadInputsNames
  | KeyboardInputsNames
  | MouseInputsNames
  | MobileGamepadInputsNames;

type InputTemplateMap = Partial<{
  [key in InputsNames]: string;
}>;

export const outlineTemplate: InputTemplateMap = {
  [Gamepad.getInputName("ps-gamepad", "PsCrossButton")]: "Action X",
  [Gamepad.getInputName("xbox-gamepad", "PsCrossButton")]: "Action A",
};
