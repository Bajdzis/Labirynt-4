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
import { Player } from "../Board/Player";
import { Torch } from "../ThreeJsBoard/Torch";
import { MergeControlTrigger } from "../ThreeJsBoard/Triggers/MergeControlTrigger";
import { PushActivatedSwitch } from "../ThreeJsBoard/PushActivatedSwitch";
import { InteractiveMessage } from "../ThreeJsBoard/InteractiveMessage";
import { InvertTransmitTrigger } from "../ThreeJsBoard/Triggers/InvertTransmitTrigger";
import { WayNetwork } from "../WayNetwork/WayNetwork";
import { resources } from "./Resources";
import { NPC } from "../ThreeJsBoard/NPC/NPC";
import { WalkAround } from "../ThreeJsBoard/NPC/Routine/WalkArourd";
import { FollowPlayer } from "../ThreeJsBoard/NPC/Routine/FollowPlayer";
import { WalkAroundGhost } from "../ThreeJsBoard/NPC/Routine/WalkArourdGhost";
import { RunAwayFromPlayer } from "../ThreeJsBoard/NPC/Routine/RunAwayFromPlayer";

interface LevelLoaderProps {
  imageLoader: ImageLoader;
  xmlLoader: XMLLoader;
}

export interface Level {
  wallsPositions: [number, number][];
  slotsPositions: [number, number][];
  startPosition: [number, number];
  endPosition: [number, number];
  waynet: WayNetwork | null;
  createAdditionalElements: () => BoardObject[];
}

export class LevelLoader extends ResourcesLoader<Level> {
  constructor(private props: LevelLoaderProps) {
    const loader = async (url: string) => {
      const boardDocument = await props.xmlLoader.load(url);
      if (boardDocument.getRoot().nodeName !== "board") {
        throw new Error("Invalid level format");
      }
      const rootAttr = boardDocument.getRootAttributes();
      const src = rootAttr.getString("src");

      const levelImage = await props.imageLoader.load(src);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = levelImage.naturalWidth;
      canvas.height = levelImage.naturalHeight;

      if (!context) {
        throw new Error("Context not found");
      }
      context.imageSmoothingEnabled = false;
      context.drawImage(levelImage, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
        {
          colorSpace: "srgb",
        },
      );
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

          const sum = red + green + blue;

          if (sum > 735) {
            //white
            continue;
          }

          // Check the color of the pixel and determine the position
          if (sum < 30) {
            // black
            wallsPositions.push([x, -y]);

            continue;
          }

          if (blue > 235) {
            //blue
            slotsPositions.push([x, -y]);
          }
          if (red > 235) {
            //red
            startPosition = [x, -y];
          }
          if (green > 235) {
            //green
            endPosition = [x, -y];
          }
        }
      }

      const waynet: WayNetwork | null = (() => {
        const levelWithWayNet =
          rootAttr.getString("wayNet", "false") === "true";
        if (levelWithWayNet) {
          const waynet = new WayNetwork(startPosition, wallsPositions);

          // prepare cache
          waynet.findPathByPosition(startPosition, endPosition);
          slotsPositions.forEach((slot) => {
            waynet.findPathByPosition(startPosition, slot);
            waynet.findPathByPosition(endPosition, slot);
          });
          return waynet;
        }
        return null;
      })();

      const levelData = {
        wallsPositions,
        slotsPositions,
        startPosition,
        endPosition,
        waynet,
        createAdditionalElements: () => {
          const result: BoardObject[] = waynet ? [waynet] : [];
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

          boardDocument.traverse((type, attributes, getChildren) => {
            if (type === "ghost" || type === "mummy") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );

              if (!waynet) {
                throw new Error("Waynet is required for NPC");
              }

              const waypoint = waynet.findWaypointAtCoords(x, y);

              if (!waypoint) {
                throw new Error(`Waypoint (${x},${y}) not found`);
              }

              push(
                new NPC(
                  waypoint,
                  resources.data.materials[type],
                  type === "ghost"
                    ? new WalkAroundGhost(new RunAwayFromPlayer(waynet))
                    : new WalkAround(new FollowPlayer(waynet)),
                ),
                attributes,
              );
            } else if (type === "interactiveMessage") {
              const position = attributes.getEnum("position", [
                "topScreen",
                "bottomScreen",
              ]);
              push(new InteractiveMessage(getChildren(), position), attributes);
            } else if (type === "pushActivatedSwitch") {
              const [x, y] = attributes.pickArrValueByAttr(
                "slot",
                slotsPositions,
              );
              const activeTimeMs = attributes.getInt("activeTimeMs");
              const directionToPush = attributes.getEnum("direction", [
                "toTop",
                "toBottom",
                "toRight",
                "toLeft",
              ]);

              push(
                new PushActivatedSwitch(
                  x * 0.32,
                  y * 0.32,
                  activeTimeMs,
                  directionToPush,
                ),
                attributes,
              );
            } else if (type === "cauldron") {
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
              const keyName = attributes.get("keyName", "null");
              const position = attributes.getEnum("position", [
                "vertical",
                "horizontal",
              ]);
              const door = new Door(
                x * 0.32,
                y * 0.32,
                keyName === "null" ? null : keyName,
                position,
              );
              push(door, attributes);
              if (waynet) {
                waynet.assignToObject(door);
              }
            } else if (type === "invertTransmitTrigger") {
              const initialStatus = attributes.getEnum("initialStatus", [
                "true",
                "false",
              ]);
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
                  new InvertTransmitTrigger(
                    initialStatus === "true",
                    target,
                    action,
                  ),
                  attributes,
                );
              }
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

              const ordered = attributes.getEnum(
                "ordered",
                ["true", "false"],
                "true",
              );

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
                    ordered === "true",
                  ),
                  attributes,
                );
              }
            } else {
              console.warn("unknown type :", type, attributes);
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
