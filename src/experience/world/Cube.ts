import Experience from "../Experience";
import * as THREE from "three";

class Cube {
  private readonly experience: Experience;

  constructor() {
    this.experience = Experience.getInstance();

    this.experience.scene.add(
      new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
      )
    );
  }
}

export default Cube;
