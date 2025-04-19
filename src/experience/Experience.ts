import * as THREE from "three";
import Sizes from "./utils/Sizes";
import FullscreenHandler from "./utils/FullscreenHandler";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Timer from "./utils/Timer";
import Debug from "./utils/Debug";
import Resources from "./utils/Resources";
import World from "./world/World";

class Experience {
  private static instance: Experience;
  debug!: Debug;
  sizes!: Sizes;
  canvas!: HTMLCanvasElement;
  resources!: Resources;
  scene!: THREE.Scene;
  timer!: Timer;
  camera!: Camera;
  renderer!: Renderer;
  fullscreenHandler!: FullscreenHandler;
  world!: World;

  constructor(canvas: HTMLCanvasElement) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    this.canvas = canvas;
    this.fullscreenHandler = new FullscreenHandler(this.canvas);
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.resources = new Resources();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.timer = new Timer();
    this.world = new World();

    this.sizes.on("resize", () => this.resize());
    this.timer.on("tick", () => this.update());
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.dispose();
    this.timer.off("tick");
    this.resources.dispose();
    this.fullscreenHandler.dispose();

    //  GEOMETRIES AND MATERIALS DISPOSE
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.orbitControls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.gui) {
      this.debug.dispose();
    }
  }

  static getInstance(): Experience {
    if (!Experience.instance) {
      throw new Error("Experience not initialized yet");
    }
    return Experience.instance;
  }
}

export default Experience;
