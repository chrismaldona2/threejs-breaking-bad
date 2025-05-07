import GUI from "lil-gui";

class Debug {
  gui: GUI;

  constructor() {
    this.gui = new GUI({ title: "Tweaks" });
    this.gui.close();
    window.addEventListener("keydown", this.handleKeydown);
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === "h") this.toggle();
  };

  toggle() {
    this.gui.show(this.gui._hidden);
  }

  dispose() {
    window.removeEventListener("keydown", this.handleKeydown);
    this.gui.destroy();
  }
}

export default Debug;
