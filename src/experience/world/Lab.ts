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
      this.model.scale.setScalar(0.05);
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name !== "glass") {
          child.material = this.material;
        }

        if (child instanceof THREE.Mesh && child.name === "glass") {
          child.material = new THREE.MeshPhysicalMaterial({
            clearcoat: 0.8,
            ior: 1.15,
            specularIntensity: 0.6,
            roughness: 0.0,
            thickness: 0.5,
            transmission: 0.5,
            sheen: 0.0,
          });
        }
      });
      this.experience.scene.add(this.model);
    }
  }

  update() {}

  destroy() {
    if (!this.model) return;

    this.model.traverse((child) => {
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
  }
}

export default Lab;
