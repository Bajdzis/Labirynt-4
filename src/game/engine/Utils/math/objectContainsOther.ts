import { Rectangle } from "../../Board/BoardObject";

export const objectContainsOther = (object1: Rectangle, object2: Rectangle) => {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
};

export const rectangleContainsPoint = (
  rect: Rectangle,
  x: number,
  y: number,
) => {
  return (
    rect.x < x &&
    rect.x + rect.width > x &&
    rect.y < y &&
    rect.y + rect.height > y
  );
};
