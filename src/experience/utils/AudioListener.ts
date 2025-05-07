import * as THREE from "three";
import Experience from "../Experience";

class AudioListener {
  private readonly experience: Experience;
  instance: THREE.AudioListener;

  constructor() {
    this.experience = Experience.getInstance();

    this.instance = new THREE.AudioListener();
    this.setupCameraListener();
  }

  setupCameraListener() {
    if (
      this.experience.camera.instance.children.some(
        (child) => child instanceof THREE.AudioListener
      )
    ) {
      this.experience.camera.instance.remove(this.instance);
    }
    this.experience.camera.instance.add(this.instance);
  }
}

export default AudioListener;
