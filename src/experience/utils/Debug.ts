import GUI from "lil-gui";

class Debug {
  gui: GUI;
  private keydownHandler: (event: KeyboardEvent) => void;

  constructor() {
    this.gui = new GUI({ title: "Tweaks", closeFolders: true });

    this.keydownHandler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "h") this.toggle();
    };
    window.addEventListener("keydown", this.keydownHandler);
  }

  toggle() {
    this.gui.show(this.gui._hidden);
  }

  dispose() {
    window.removeEventListener("keydown", this.keydownHandler);
    this.gui.destroy();
  }
}

export default Debug;
