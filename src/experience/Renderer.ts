import * as THREE from "three";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";

class Renderer {
  experience: Experience;
  instance: THREE.WebGLRenderer;
  sizes: Sizes;

  constructor() {
    this.experience = Experience.getInstance();

    this.sizes = this.experience.sizes;
    this.instance = new THREE.WebGLRenderer({
      canvas: this.experience.canvas.domElement,
      antialias: true,
    });
    this.instance.setClearColor(0x100e1d);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance
    );
  }
}
export default Renderer;
