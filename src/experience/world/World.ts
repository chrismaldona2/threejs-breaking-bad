import Experience from "../Experience";
import Lab from "./Lab";
import Environment from "./Environment";

class World {
  private readonly experience = Experience.getInstance();
  environment: Environment;
  lab?: Lab;

  constructor() {
    this.environment = new Environment();
    this.experience.resources.on("loaded", () => {
      this.lab = new Lab();
      this.lab.setupTweaks();
      this.experience.camera.setupTweaks();
    });
  }

  update() {
    this.lab?.update();
  }

  destroy() {
    this.lab?.destroy();
    this.environment.dispose();
  }
}

export default World;
