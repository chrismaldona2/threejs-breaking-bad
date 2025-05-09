import * as THREE from "three";
import Canvas from "./Canvas";
import Sizes from "./utils/Sizes";
import FullscreenHandler from "./utils/FullscreenHandler";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Timer from "./utils/Timer";
import Debug from "./utils/Debug";
import Resources from "./utils/Resources";
import World from "./world/World";
import AudioListener from "./utils/AudioListener";
import LoadingScreen from "./LoadingScreen";
import InstructionBanner from "./InstructionBanner";

class Experience {
  private static instance: Experience;
  debug: Debug;
  sizes: Sizes;
  canvas: Canvas;
  fullscreenHandler: FullscreenHandler;
  scene: THREE.Scene;
  camera: Camera;
  timer: Timer;
  renderer: Renderer;
  resources: Resources;
  loadingScreen: LoadingScreen;
  world: World;
  listener: AudioListener;
  instructionBanner?: InstructionBanner;

  private constructor() {
    Experience.instance = this;

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.canvas = new Canvas();
    this.fullscreenHandler = new FullscreenHandler(this.canvas.domElement);
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.timer = new Timer();
    this.renderer = new Renderer();
    this.resources = new Resources();
    this.loadingScreen = new LoadingScreen();
    this.world = new World();
    this.listener = new AudioListener();

    this.sizes.on("resize", () => this.resize());
    this.timer.on("tick", () => this.update());
    this.resources.on("loadFinish", () => {
      this.instructionBanner = new InstructionBanner();
    });
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
    this.timer.dispose();
    this.resources.dispose();
    this.sizes.dispose();
    this.fullscreenHandler.dispose();

    this.world.destroy();
    this.camera.dispose();
    this.renderer.dispose();

    this.debug.dispose();
    this.canvas.destroy();
    this.loadingScreen?.destroy();
    this.instructionBanner?.destroy();
  }

  static getInstance(): Experience {
    if (!Experience.instance) Experience.instance = new Experience();
    return Experience.instance;
  }
}

export default Experience;
