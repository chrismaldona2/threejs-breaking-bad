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
      0.01,
      100
    );
    this.instance.position.set(0.5, 0.54, 0.73);

    // ORBIT CONTROLS
    this.orbitControls = new OrbitControls(
      this.instance,
      experience.canvas.domElement
    );
    this.orbitControls.target.set(-0.05, 0, 0);
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.panSpeed = 0.5;
    this.orbitControls.minDistance = 0.1;
    this.orbitControls.maxPolarAngle = Math.PI / 2.1;
    this.orbitControls.maxDistance = 1;
    this.orbitControls.zoomSpeed = 0.5;
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
