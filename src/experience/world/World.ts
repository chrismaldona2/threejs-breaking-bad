import Experience from "../Experience";
import Lab from "./Lab";
import Environment from "./Environment";

class World {
  private readonly experience: Experience;
  lab?: Lab;
  environment: Environment;

  constructor() {
    this.experience = Experience.getInstance();

    this.environment = new Environment();
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
