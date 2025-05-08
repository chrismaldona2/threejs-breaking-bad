import * as THREE from "three";
import Experience from "../Experience";
import { animate } from "motion";
import GUI from "lil-gui";

class RadioController {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly gui = this.experience.debug.gui;
  private tweaks?: GUI;
  private readonly radio: THREE.Mesh[];

  private isOn = false;
  private music: THREE.PositionalAudio;
  private switchSound: THREE.PositionalAudio;

  private volume = 0.75;
  private refDistance = 0.03;
  private rollOffFactor = 1.5;

  private raycaster: THREE.Raycaster;
  private mouseTracker: THREE.Vector2;

  constructor(radioMesh: THREE.Mesh | THREE.Mesh[]) {
    this.radio = Array.isArray(radioMesh) ? radioMesh : [radioMesh];

    this.music = new THREE.PositionalAudio(this.experience.listener.instance);
    this.setupMusic();

    this.switchSound = new THREE.PositionalAudio(
      this.experience.listener.instance
    );
    this.setupSwitchSound();

    this.radio.forEach((mesh) => {
      mesh.add(this.music, this.switchSound);
    });

    this.raycaster = new THREE.Raycaster();
    this.mouseTracker = new THREE.Vector2();
    this.setupMouseInteraction();
  }

  toggleMusic() {
    this.switchSound.stop();
    this.switchSound.play();

    if (this.isOn) {
      this.music.stop();
      this.isOn = false;
    } else {
      if (!this.music.isPlaying) this.music.play();
      this.isOn = true;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0.0, Math.min(1.0, volume));
    this.music.setVolume(this.volume);
    this.switchSound.setVolume(this.volume);
  }

  private setupMusic() {
    const buffer = this.resources.getAsset<AudioBuffer>("main_theme");
    this.music.setBuffer(buffer);
    this.music.setLoop(true);
    this.music.setRefDistance(this.refDistance);
    this.music.setRolloffFactor(this.rollOffFactor);
    this.music.setDistanceModel("exponential");
    this.music.setVolume(this.volume);
  }

  private setupSwitchSound() {
    const buffer = this.resources.getAsset<AudioBuffer>("switch_sfx");
    this.switchSound.setBuffer(buffer);
    this.switchSound.setLoop(false);
    this.switchSound.setRefDistance(this.refDistance + 0.02);
    this.switchSound.setRolloffFactor(this.rollOffFactor);
    this.switchSound.setDistanceModel("exponential");
    this.switchSound.setVolume(this.volume);
  }

  private setupMouseInteraction() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("click", this.handleClick);
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.mouseTracker.x = (event.clientX / this.experience.sizes.width) * 2 - 1;
    this.mouseTracker.y =
      -(event.clientY / this.experience.sizes.height) * 2 + 1;

    this.raycaster.setFromCamera(
      this.mouseTracker,
      this.experience.camera.instance
    );

    const intersects = this.raycaster.intersectObjects(this.radio);

    if (intersects.length > 0) {
      document.body.style.cursor = "pointer";
      this.radio.forEach((mesh) => {
        animate(mesh.scale, { x: 1.02, y: 1.02, z: 1.02 });
      });
    } else {
      document.body.style.cursor = "default";
      this.radio.forEach((mesh) => {
        animate(mesh.scale, { x: 1, y: 1, z: 1 });
      });
    }
  };

  private handleClick = () => {
    const intersects = this.raycaster.intersectObjects(this.radio);

    if (intersects.length > 0) {
      this.toggleMusic();
      this.radio.forEach((mesh) => {
        animate(
          mesh.scale,
          { x: [1, 0.99, 1.02], y: [1, 0.985, 1.02], z: [1, 0.99, 1.02] },
          { duration: 0.35 }
        );
      });
    }
  };

  setupTweaks() {
    const radioDebug = {
      volume: this.volume * 100,
      refDistance: this.refDistance,
      rollOffFactor: this.rollOffFactor,
    };

    this.tweaks = this.gui.addFolder("Radio");
    this.tweaks.close();

    this.tweaks
      .add(radioDebug, "volume")
      .min(0)
      .max(100)
      .onChange(() => {
        this.setVolume(radioDebug.volume / 100);
      });
    this.tweaks
      .add(radioDebug, "refDistance")
      .min(0)
      .max(1)
      .step(0.001)
      .onChange(() => {
        this.music.setRefDistance(radioDebug.refDistance);
        this.switchSound.setRefDistance(radioDebug.refDistance + 0.02);
      });
    this.tweaks
      .add(radioDebug, "rollOffFactor")
      .min(0)
      .max(3)
      .step(0.001)
      .onChange(() => {
        this.music.setRolloffFactor(radioDebug.rollOffFactor);
        this.switchSound.setRolloffFactor(radioDebug.rollOffFactor);
      });
  }

  dispose() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("click", this.handleClick);
    this.radio.forEach((mesh) => {
      mesh.remove(this.music, this.switchSound);
    });
    this.tweaks?.destroy();
  }
}

export default RadioController;
