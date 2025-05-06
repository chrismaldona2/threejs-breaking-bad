import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience: Experience;

  constructor() {
    this.experience = Experience.getInstance();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-0.25, 0.5, 0.05);

    this.experience.scene.add(ambientLight, directionalLight);
  }
}

export default Environment;
