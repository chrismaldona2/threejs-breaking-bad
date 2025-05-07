import * as THREE from "three";
import Experience from "../Experience";
import { animate } from "motion";

class RadioController {
  private readonly experience = Experience.getInstance();
  private readonly radio: THREE.Mesh[];

  private isOn = false;
  private music: THREE.PositionalAudio;
  private switchSound: THREE.PositionalAudio;
  private loader = new THREE.AudioLoader();
  private volume = 0.7;

  private raycaster: THREE.Raycaster;
  private mouseTracker: THREE.Vector2;

  constructor(radioMesh: THREE.Mesh | THREE.Mesh[]) {
    this.radio = Array.isArray(radioMesh) ? radioMesh : [radioMesh];
    this.music = new THREE.PositionalAudio(this.experience.listener.instance);

    this.loader.load(
      "./audio/main_theme.mp3",
      (buffer) => {
        this.music.setBuffer(buffer);
        this.music.setLoop(true);
        this.music.setRefDistance(0.02);
        this.music.setRolloffFactor(1.5);
        this.music.setDistanceModel("exponential");
        this.music.setVolume(this.volume);
      },
      undefined,
      (err) => console.error(`Error loading "Main Theme" song:`, err)
    );

    this.switchSound = new THREE.PositionalAudio(
      this.experience.listener.instance
    );
    this.loader.load(
      "./audio/switch_2.mp3",
      (buffer) => {
        this.switchSound.setBuffer(buffer);
        this.switchSound.setLoop(false);
        this.switchSound.setRefDistance(0.05);
        this.switchSound.setRolloffFactor(1.5);
        this.switchSound.setDistanceModel("exponential");
        this.switchSound.setVolume(this.volume);
      },
      undefined,
      (err) => console.error(`Error loading "Switch" sound effect:`, err)
    );

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

  dispose() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("click", this.handleClick);
    this.radio.forEach((mesh) => {
      mesh.remove(this.music, this.switchSound);
    });
  }
}

export default RadioController;
