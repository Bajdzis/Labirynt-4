import { GroupUI } from "./GroupUI";
import { logoSVG } from "./logo";

export class MenuGroupUI extends GroupUI<
  "play" | "playFormSavedState" | "showControls" | "authors" | "exit"
> {
  create() {
    this.cleanup();

    this.container.classList.add("menu");

    const logoContainer = document.createElement("div");
    logoContainer.innerHTML = logoSVG;
    logoContainer.classList.add("menu-logo");
    this.container.appendChild(logoContainer);

    const menuOptionContainer = document.createElement("div");
    menuOptionContainer.classList.add("menu-options");
    this.container.appendChild(menuOptionContainer);

    const play = this.createButton("Nowa gra", menuOptionContainer);
    const playFormSavedState = this.createButton(
      "Kontynuuj",
      menuOptionContainer,
    );
    const showControls = this.createButton("Sterowanie", menuOptionContainer);
    const authors = this.createButton("Autorzy", menuOptionContainer);
    const exit = this.createButton("Wyjście", menuOptionContainer);

    return { play, playFormSavedState, showControls, authors, exit };
  }
}
