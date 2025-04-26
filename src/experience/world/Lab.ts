import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import * as THREE from "three";

class Lab {
  private readonly experience: Experience;
  model?: THREE.Object3D;
  material?: THREE.MeshBasicMaterial;

  constructor() {
    this.experience = Experience.getInstance();

    const gltf = this.experience.resources.getAsset<GLTF>("labModel");
    const texture =
      this.experience.resources.getAsset<THREE.Texture>("labBakedTexture");
    if (texture) {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
    }

    if (gltf) {
      this.material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      this.model = gltf.scene;
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = this.material;
        }
      });

      this.experience.scene.add(this.model);
    }
  }
}

export default Lab;
