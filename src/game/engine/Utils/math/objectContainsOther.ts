import { BoardObject } from "../../Board/BoardObject";

export const objectContainsOther = (
  object1: Omit<BoardObject, "update">,
  object2: Omit<BoardObject, "update">,
) => {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
};
