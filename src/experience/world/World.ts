import Experience from "../Experience";
import Lab from "./Lab";
import Environment from "./Environment";
import Smoke from "./Smoke";

class World {
  private readonly experience: Experience;
  lab?: Lab;
  coffeeSmoke?: Smoke;
  environment: Environment;

  constructor() {
    this.experience = Experience.getInstance();

    this.environment = new Environment();
    this.experience.resources.on("loaded", () => {
      this.lab = new Lab();
      this.coffeeSmoke = new Smoke();
    });
  }

  update() {
    this.lab?.update();
    this.coffeeSmoke?.update();
  }

  destroy() {
    this.lab?.destroy();
  }
}

export default World;
