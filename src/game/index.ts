import * as THREE from "three";
import { Mesh } from "three";
import { MyGame } from "./engine/MyGame";
import { resources } from "./engine/Resources/Resources";
import { ThreeJsRenderer } from "./engine/ThreeJsRenderer";
import { wallOutlineGeometry } from "./engine/Resources/Geometries";
import { customCursor } from "./engine/HTMLAnimation/CustomCursor";
import { MyMenu } from "./engine/MyMenu";
import { electronIntegration } from "./electron/electronIntegration";

declare global {
  interface Window {
    setProgressBar: (msg: string, value: number) => void;
    disposeProgressBar: () => void;
    showTextInsteadOfProgressBar: () => {
      playButton?: HTMLButtonElement | null;
      playFormSavedStateButton?: HTMLButtonElement | null;
      showControlsButton?: HTMLButtonElement | null;
      authorsButton?: HTMLButtonElement | null;
      exitButton?: HTMLButtonElement | null;
    };
    electronBridge?: {
      sendEvent: (eventName: string) => void;
      setItem: (key: string, value: string) => void;
      getItem: (key: string) => Promise<string | null>;
      removeItem: (key: string) => void;
    };
  }
}

if (electronIntegration.isAvailable()) {
  document.body.classList.add("run-in-electron");
  requestIdleCallback(() => {
    electronIntegration.showWindow();
  });
}
// initialize customCursor
customCursor.then((cursor) => {
  cursor.showCursor("waiting");
});

window.setProgressBar("Pobieranie zasobów...", 2);

resources
  .prepareAllResources((progress) => {
    window.setProgressBar("Pobieranie zasobów...", progress * 50);
  })
  .then(async () => {
    const renderer = new ThreeJsRenderer();

    window.setProgressBar("Kompilowanie shaderów...", 50);

    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.player1),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 55);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.floor),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 65);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.floorShadow),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 70);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.torch),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 75);
    await waitForEnd(() => {
      renderer.render(
        new Mesh(wallOutlineGeometry, resources.data.materials.door),
      );
    });

    window.setProgressBar("Kompilowanie shaderów...", 80);
    const game = new MyGame(renderer);

    // await waitForEnd(() => {
    //   renderer.render(game.getScene());
    // });
    window.setProgressBar("Kompilowanie shaderów...", 85);

    await waitForEnd(() => {
      // clean up
      renderer.render(new THREE.Group());
    });
    window.setProgressBar("Kompilowanie shaderów...", 90);

    if (electronIntegration.isAvailable()) {
      electronIntegration.openFullscreen();
      resources.data.sounds.theme.play();
    }

    const menu = new MyMenu((status) => {
      menu.stop();
      window.disposeProgressBar();
      if (!electronIntegration.isAvailable()) {
        resources.data.sounds.theme.play();
      }
      game.runMyGame(status);
    });

    menu.run();
  });

function waitForEnd(callback: () => void) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      callback();
      requestAnimationFrame(resolve);
    });
  });
}
