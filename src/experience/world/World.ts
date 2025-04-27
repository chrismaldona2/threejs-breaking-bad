import Experience from "../Experience";
import Lab from "./Lab";

class World {
  private readonly experience: Experience;
  lab?: Lab;

  constructor() {
    this.experience = Experience.getInstance();

    this.experience.resources.on("loaded", () => {
      this.lab = new Lab();
    });
  }

  update() {
    this.lab?.update();
  }

  destroy() {
    this.lab?.destroy();
  }
}

export default World;
