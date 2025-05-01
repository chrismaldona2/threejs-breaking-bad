import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience: Experience;

  constructor() {
    this.experience = Experience.getInstance();

    this.experience.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  }
}

export default Environment;
