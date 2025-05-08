import * as THREE from "three";
import Experience from "./Experience";

class Renderer {
  private readonly experience = Experience.getInstance();
  private readonly sizes = this.experience.sizes;

  instance: THREE.WebGLRenderer;
  private clearColor: string = "#100e1d";

  constructor() {
    this.sizes = this.experience.sizes;
    this.instance = new THREE.WebGLRenderer({
      canvas: this.experience.canvas.domElement,
      antialias: true,
    });
    this.instance.setClearColor(this.clearColor);
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

  dispose() {
    this.instance.dispose();
  }
}
export default Renderer;
