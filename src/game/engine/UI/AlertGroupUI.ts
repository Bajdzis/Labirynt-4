import { GroupUI } from "./GroupUI";

export class AlertGroupUI extends GroupUI<"accept" | "cancel"> {
  constructor(private title: string) {
    super();
  }
  create() {
    this.cleanup();
    this.container.classList.add("game-alert");

    const titleContainer = document.createElement("div");
    titleContainer.innerText = this.title;

    titleContainer.classList.add("game-alert-title");
    this.container.appendChild(titleContainer);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("game-alert-buttons");
    this.container.appendChild(buttonsContainer);

    const accept = this.createButton("Ok", buttonsContainer);
    const cancel = this.createButton("Anuluj", buttonsContainer);

    return { accept, cancel };
  }
}
