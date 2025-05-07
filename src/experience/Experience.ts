import * as THREE from "three";
import Sizes from "./utils/Sizes";
import FullscreenHandler from "./utils/FullscreenHandler";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Timer from "./utils/Timer";
import Debug from "./utils/Debug";
import Resources from "./utils/Resources";
import World from "./world/World";
import Canvas from "./utils/Canvas";
import AudioListener from "./utils/AudioListener";

class Experience {
  private static instance: Experience;
  debug!: Debug;
  sizes!: Sizes;
  canvas!: Canvas;
  fullscreenHandler!: FullscreenHandler;
  resources!: Resources;
  scene!: THREE.Scene;
  timer!: Timer;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;
  listener!: AudioListener;

  constructor() {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    this.canvas = new Canvas();
    this.fullscreenHandler = new FullscreenHandler(this.canvas.domElement);
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.resources = new Resources();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.timer = new Timer();
    this.world = new World();
    this.listener = new AudioListener();

    this.sizes.on("resize", () => this.resize());
    this.timer.on("tick", () => this.update());
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.world.update();
    this.camera.update();
    this.renderer.update();
  }

  destroy() {
    this.timer.off("tick");
    this.resources.off("loaded");
    this.sizes.dispose();
    this.fullscreenHandler.dispose();

    // GEOMETRIES AND MATERIALS DISPOSE
    this.world.destroy();
    this.camera.dispose();
    this.renderer.instance.dispose();

    if (this.debug.gui) {
      this.debug.dispose();
    }
    this.canvas.destroy();
  }

  static getInstance(): Experience {
    if (!Experience.instance) {
      throw new Error("Experience not initialized yet");
    }
    return Experience.instance;
  }
}

export default Experience;
