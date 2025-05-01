import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import * as THREE from "three";

class Lab {
  private readonly experience: Experience;
  sceneModel?: THREE.Object3D;
  postersModel?: THREE.Object3D;
  sceneMaterial?: THREE.MeshBasicMaterial;
  posterMaterial?: THREE.MeshBasicMaterial;
  glassMaterial?: THREE.MeshPhysicalMaterial;

  constructor() {
    this.experience = Experience.getInstance();

    const sceneGltf = this.experience.resources.getAsset<GLTF>("sceneModel");
    const postersGltf =
      this.experience.resources.getAsset<GLTF>("postersModel");

    const sceneTexture =
      this.experience.resources.getAsset<THREE.Texture>("sceneBakedTexture");
    const postersTexture = this.experience.resources.getAsset<THREE.Texture>(
      "postersBakedTexture"
    );

    if (sceneGltf && sceneTexture) {
      sceneTexture.flipY = false;
      sceneTexture.colorSpace = THREE.SRGBColorSpace;

      this.sceneMaterial = new THREE.MeshBasicMaterial({
        map: sceneTexture,
      });
      this.glassMaterial = new THREE.MeshPhysicalMaterial({
        clearcoat: 0.8,
        ior: 1.15,
        specularIntensity: 0.5,
        roughness: 0.2,
        thickness: 0.5,
        transmission: 0.45,
        sheen: 0.2,
      });

      this.sceneModel = sceneGltf.scene;
      this.sceneModel.scale.setScalar(0.025);
      this.sceneModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          switch (child.name) {
            case "tiny_red_lights":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xc9001c,
              });
              break;
            case "tiny_green_lights":
              child.material = new THREE.MeshBasicMaterial({
                color: 0x45b600,
              });
              break;
            case "black_lights":
              child.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              });
              break;
            case "big_red_light":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xbb0010,
              });
              break;
            case "acid":
              child.material = new THREE.MeshBasicMaterial({
                color: 0x7ad63e,
              });
              break;
            case "cabinet_light002":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xfdfbdd,
              });
              break;
            case "cabinet_light001C":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xfdfbdd,
              });
              break;
            case "wall_light":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
              });
              break;
            case "wall_light001":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
              });
              break;
            case "wall_light002":
              child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
              });
              break;
            case "glass":
              child.material = this.glassMaterial;
              break;
            case "glass001":
              child.material = this.glassMaterial;
              break;
            case "glass002":
              child.material = this.glassMaterial;
              break;
            default:
              child.material = this.sceneMaterial;
              break;
          }
        }
      });
      this.experience.scene.add(this.sceneModel);
    }

    if (postersGltf && postersTexture) {
      postersTexture.flipY = false;
      postersTexture.colorSpace = THREE.SRGBColorSpace;
      this.posterMaterial = new THREE.MeshBasicMaterial({
        map: postersTexture,
      });

      this.postersModel = postersGltf.scene;
      this.postersModel.scale.setScalar(0.025);
      this.postersModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = this.posterMaterial;
        }
      });
      this.experience.scene.add(this.postersModel);
    }
  }

  update() {}

  destroy() {}
}

export default Lab;
