import * as THREE from "three";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  sizes: Sizes;
  instance: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;

  constructor() {
    const experience = Experience.getInstance();

    this.sizes = experience.sizes;
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(1, 1, 1);

    // ORBIT CONTROLS
    this.orbitControls = new OrbitControls(
      this.instance,
      experience.canvas.domElement
    );
    this.orbitControls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbitControls.update();
  }
}

export default Camera;
