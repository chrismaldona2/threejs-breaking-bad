import Experience from "../Experience";
import Lab from "./Lab";

class World {
  private readonly experience: Experience;
  constructor() {
    this.experience = Experience.getInstance();

    this.experience.resources.on("loaded", () => {
      new Lab();
    });
  }
}

export default World;
