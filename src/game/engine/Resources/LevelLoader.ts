import { ResourcesLoader } from "./ResourcesLoader";
import { ImageLoader } from "./ImageLoader";
import { AttributesXML, XMLLoader } from "./XMLLoader";
import {
  BoardObject,
  InteractiveObject,
  isInteractiveObject,
} from "../Board/BoardObject";
import { Cauldron } from "../ThreeJsBoard/Cauldron";
import { TimerControlTrigger } from "../ThreeJsBoard/Triggers/TimerControlTrigger";
import { TransmitControlTrigger } from "../ThreeJsBoard/Triggers/TransmitControlTrigger";
import { Key } from "../ThreeJsBoard/Key";
import { Door } from "../ThreeJsBoard/Door";
import { TransmitTouchTrigger } from "../ThreeJsBoard/Triggers/TransmitTouchTrigger";
import { ThreeJsPlayer } from "../ThreeJsBoard/ThreeJsPlayer";
import { Player } from "../Board/Player";
import { Torch } from "../ThreeJsBoard/Torch";
import { MergeControlTrigger } from "../ThreeJsBoard/Triggers/MergeControlTrigger";

interface LevelLoaderProps {
  imageLoader: ImageLoader;
  xmlLoader: XMLLoader;
}

export interface Level {
  wallsPositions: [number, number][];
  slotsPositions: [number, number][];
  startPosition: [number, number];
  endPosition: [number, number];
  createAdditionalElements: () => BoardObject[];
}

export class LevelLoader extends ResourcesLoader<Level> {
  constructor(private props: LevelLoaderProps) {
    const loader = async (url: string) => {
      const boardDocument = await props.xmlLoader.load(url);
      if (boardDocument.getRoot().nodeName !== "board") {
        throw new Error("Invalid level format");
      }
      const levelImage = await props.imageLoader.load(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        boardDocument.getRoot().attributes.src.value,
      );

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = levelImage.width;
      canvas.height = levelImage.height;

      if (!context) {
        throw new Error("Context not found");
      }
      context.drawImage(levelImage, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const wallsPositions: [number, number][] = [];
      const slotsPositions: [number, number][] = [];
      let startPosition: [number, number] = [0, 0];
      let endPosition: [number, number] = [0, 0];

      for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
          const index = (y * canvas.width + x) * 4;
          const red = imageData.data[index];
          const green = imageData.data[index + 1];
          const blue = imageData.data[index + 2];

          // Check the color of the pixel and determine the position
          if (red === 0 && green === 0 && blue === 0) {
            wallsPositions.push([x, -y]);
          } else if (red === 0 && green === 0 && blue === 255) {
            slotsPositions.push([x, -y]);
          } else if (red === 255 && green === 0 && blue === 0) {
            startPosition = [x, -y];
          } else if (red === 0 && green === 255 && blue === 0) {
            endPosition = [x, -y];
          }
        }
      }
      const levelData = {
        wallsPositions,
        slotsPositions,
        startPosition,
        endPosition,
        createAdditionalElements: () => {
          const result: BoardObject[] = [];
          const elementsById: {
            [id: string]: BoardObject;
          } = {};

          const push = (object: BoardObject, attributes: AttributesXML) => {
            result.push(object);
            const id = attributes.get("id");
            if (id) {
              if (elementsById[id]) {
                throw new Error(`Element with id ${id} already exists`);
              }
              elementsById[id] = object;
            }
          };

          boardDocument.traverse((type, attributes) => {
            if (type === "cauldron") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );

              push(new Cauldron(x * 0.32, y * 0.32), attributes);
            } else if (type === "key") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );
              const name = attributes.getString("name");

              push(new Key(x * 0.32, y * 0.32, name), attributes);
            } else if (type === "door") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );
              const keyName = attributes.get("keyName") || "";
              const position = attributes.getEnum("position", [
                "vertical",
                "horizontal",
              ]);

              push(new Door(x * 0.32, y * 0.32, keyName, position), attributes);
            } else if (type === "timerControlTrigger") {
              const time = attributes.getInt("time");
              const object = attributes.pickObjValueByAttr(
                "objectId",
                elementsById,
              );

              if (isInteractiveObject(object)) {
                push(new TimerControlTrigger(object, time), attributes);
              }
            } else if (type === "transmitTouchTrigger") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );
              const source = attributes.getEnum("source", ["player", "torch"]);
              const target = attributes.pickObjValueByAttr(
                "targetId",
                elementsById,
              );
              const action = attributes.getEnum("action", [
                "activated",
                "deactivated",
                "both",
              ]);

              if (isInteractiveObject(target)) {
                push(
                  new TransmitTouchTrigger<Player | Torch>(
                    x * 0.32,
                    y * 0.32,
                    source === "player" ? Player : Torch,
                    target,
                    action,
                  ),
                  attributes,
                );
              }
            } else if (type === "transmitControlTrigger") {
              const source = attributes.pickObjValueByAttr(
                "sourceId",
                elementsById,
              );
              const target = attributes.pickObjValueByAttr(
                "targetId",
                elementsById,
              );
              const action = attributes.getEnum("action", [
                "activated",
                "deactivated",
                "both",
              ]);

              if (isInteractiveObject(source) && isInteractiveObject(target)) {
                push(
                  new TransmitControlTrigger(source, target, action),
                  attributes,
                );
              }
            } else if (type === "mergeControlTrigger") {
              const source = attributes.pickObjValuesByAttr(
                "sourceIds",
                elementsById,
              );
              const target = attributes.pickObjValueByAttr(
                "targetId",
                elementsById,
              );
              const action = attributes.getEnum("action", [
                "activated",
                "deactivated",
                "both",
              ]);

              if (
                source.every((source) => isInteractiveObject(source)) &&
                isInteractiveObject(target)
              ) {
                push(
                  new MergeControlTrigger(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    source as any[] as InteractiveObject[],
                    target,
                    action,
                  ),
                  attributes,
                );
              }
            }
          });
          return result;
        },
      };

      return levelData;
    };
    super(loader);
  }
}
