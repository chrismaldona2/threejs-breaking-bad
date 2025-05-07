import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience = Experience.getInstance();
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    this.directionalLight.position.set(-0.25, 0.5, 0.05);

    this.experience.scene.add(this.ambientLight, this.directionalLight);
  }

  dispose() {
    this.ambientLight.dispose();
    this.directionalLight.dispose();
    this.experience.scene.remove(this.ambientLight, this.directionalLight);
  }
}

export default Environment;
