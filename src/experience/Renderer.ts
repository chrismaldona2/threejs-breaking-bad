import * as THREE from "three";
import Experience from "./Experience";
import Sizes from "./utils/Sizes";

class Renderer {
  experience: Experience;
  instance: THREE.WebGLRenderer;
  sizes: Sizes;
  clearColor: string = "#100e1d";

  constructor() {
    this.experience = Experience.getInstance();

    this.sizes = this.experience.sizes;
    this.instance = new THREE.WebGLRenderer({
      canvas: this.experience.canvas.domElement,
      antialias: true,
    });
    this.instance.setClearColor(this.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    this.setTweaks();
  }

  setTweaks() {
    const debug = this.experience.debug.gui.addFolder("Renderer");
    debug.addColor(this, "clearColor").onChange(() => {
      this.instance.setClearColor(this.clearColor);
    });
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
