import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import * as THREE from "three";

class Lab {
  private readonly experience: Experience;
  lab: THREE.Group;

  constructor() {
    this.experience = Experience.getInstance();
    this.lab = new THREE.Group();
    this.getPart1();
    this.getPart2();
    this.getPart3();

    this.lab.scale.setScalar(0.025);
    this.experience.scene.add(this.lab);
  }

  getPart1() {
    const lab_p1 = this.experience.resources.getAsset<GLTF>("lab_p1");
    const lab_p1_texture =
      this.experience.resources.getAsset<THREE.Texture>("lab_p1_texture");

    if (!lab_p1 || !lab_p1_texture) return;

    lab_p1_texture.flipY = false;
    lab_p1_texture.colorSpace = THREE.SRGBColorSpace;
    lab_p1_texture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: lab_p1_texture,
    });

    const model = lab_p1.scene.children[0];
    if (model instanceof THREE.Mesh) {
      model.material = material;
    }
    this.lab.add(model);
  }

  getPart2() {
    const lab_p2 = this.experience.resources.getAsset<GLTF>("lab_p2");
    const lab_p2_texture =
      this.experience.resources.getAsset<THREE.Texture>("lab_p2_texture");

    if (!lab_p2 || !lab_p2_texture) return;

    lab_p2_texture.flipY = false;
    lab_p2_texture.colorSpace = THREE.SRGBColorSpace;
    lab_p2_texture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshBasicMaterial({
      map: lab_p2_texture,
    });

    const model = lab_p2.scene.children[0];
    if (model instanceof THREE.Mesh) {
      model.material = material;
    }
    this.lab.add(model);
  }

  getPart3() {
    const lab_p3 = this.experience.resources.getAsset<GLTF>("lab_p3");
    const lab_p3_texture =
      this.experience.resources.getAsset<THREE.Texture>("lab_p3_texture");

    if (!lab_p3 || !lab_p3_texture) return;

    lab_p3_texture.flipY = false;
    lab_p3_texture.colorSpace = THREE.SRGBColorSpace;
    lab_p3_texture.magFilter = THREE.LinearFilter;

    const model = lab_p3.scene;

    /* BAKED MERGED MESH */
    const textureMaterial = new THREE.MeshBasicMaterial({
      map: lab_p3_texture,
    });

    const bakedMesh = model.children.find(
      (child) => child.name === "part3"
    ) as THREE.Mesh;
    bakedMesh.material = textureMaterial;

    /* RADIO */
    const radio = model.children.find(
      (child) => child.name === "radio"
    ) as THREE.Mesh;
    radio.material = textureMaterial;

    /* EMISSION MESHES */
    // RED LIGHTS
    const redLights = model.children.find(
      (child) => child.name === "red_lights"
    ) as THREE.Mesh;
    redLights.material = new THREE.MeshBasicMaterial({ color: 0xbe0014 });

    // GREEN LIGHTS
    const greenLights = model.children.find(
      (child) => child.name === "green_lights"
    ) as THREE.Mesh;
    greenLights.material = new THREE.MeshBasicMaterial({ color: 0x68d500 });

    // BLACK LIGHTS
    const blackLights = model.children.find(
      (child) => child.name === "black_lights"
    ) as THREE.Mesh;
    blackLights.material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // WHITE LIGHTS
    const whiteLights = model.children.find(
      (child) => child.name === "white_lights"
    ) as THREE.Mesh;
    whiteLights.material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // CABINET LIGHTS
    const cabinetLights = model.children.find(
      (child) => child.name === "cabinet_light"
    ) as THREE.Mesh;
    cabinetLights.material = new THREE.MeshBasicMaterial({
      color: 0xfdfce3,
    });

    // BIG RED LIGHT
    const bigRedLight = model.children.find(
      (child) => child.name === "big_red_light"
    ) as THREE.Mesh;
    bigRedLight.material = new THREE.MeshBasicMaterial({
      color: 0xb7000b,
    });

    // ACID
    const acid = model.children.find(
      (child) => child.name === "acid"
    ) as THREE.Mesh;
    acid.material = new THREE.MeshBasicMaterial({ color: 0xb3ff6f });

    /* GLASS */
    const glass = model.children.find(
      (child) => child.name === "glass"
    ) as THREE.Mesh;
    glass.material = new THREE.MeshPhysicalMaterial({
      clearcoat: 0.5,
      ior: 1.25,
      specularIntensity: 1,
      roughness: 0.5,
      thickness: 0.35,
      transmission: 0.65,
      iridescence: 0.75,
    });

    this.lab.add(model);
  }

  update() {}

  destroy() {}
}

export default Lab;
