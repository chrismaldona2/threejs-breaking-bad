import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import acidVertexShader from "../../shaders/acid/vertex.glsl";
import acidFragmentShader from "../../shaders/acid/fragment.glsl";
import GUI from "lil-gui";

class Lab {
  private readonly experience: Experience;
  group: THREE.Group;
  lab?: THREE.Object3D;
  textures?: {
    lab_texture_p1: THREE.Texture;
    lab_texture_p2: THREE.Texture;
    lab_texture_p3: THREE.Texture;
  };
  tweaks?: GUI;
  acid?: {
    mesh: THREE.Mesh;
    material: THREE.ShaderMaterial;
    outsideColor: string;
    insideColor: string;
  };

  constructor() {
    this.experience = Experience.getInstance();

    this.group = new THREE.Group();
    this.init();
    this.group.scale.setScalar(0.025);
    this.experience.scene.add(this.group);

    this.setupTweaks();
  }

  private init() {
    this.setupTextures();
    this.setupLab();
    this.setupGlass();
    this.setupLabMaterials();
    this.setupEmissive();
    this.setupRadio();
    this.setupAcid();
  }

  private setupLab() {
    const labModelFile = this.experience.resources.getAsset<GLTF>("lab_model");
    if (!labModelFile) return null;
    this.lab = labModelFile.scene;
    this.group.add(this.lab);
  }

  private setupTextures() {
    const lab_texture_p1 =
      this.experience.resources.getAsset<THREE.Texture>("lab_texture_p1");
    const lab_texture_p2 =
      this.experience.resources.getAsset<THREE.Texture>("lab_texture_p2");
    const lab_texture_p3 =
      this.experience.resources.getAsset<THREE.Texture>("lab_texture_p3");

    if (!lab_texture_p1 || !lab_texture_p2 || !lab_texture_p3) return;

    lab_texture_p1.flipY = false;
    lab_texture_p1.colorSpace = THREE.SRGBColorSpace;
    lab_texture_p2.flipY = false;
    lab_texture_p2.colorSpace = THREE.SRGBColorSpace;
    lab_texture_p3.flipY = false;
    lab_texture_p3.colorSpace = THREE.SRGBColorSpace;

    this.textures = {
      lab_texture_p1,
      lab_texture_p2,
      lab_texture_p3,
    };
  }

  private setupLabMaterials() {
    if (!this.lab || !this.textures) return;
    this.lab.getObjectByName;

    const p1_objects = this.lab.getObjectByName("part1") as THREE.Mesh;
    const p2_objects = this.lab.getObjectByName("part2") as THREE.Mesh;
    const p3_objects = this.lab.getObjectByName("part3") as THREE.Mesh;

    if (!p1_objects || !p2_objects || !p3_objects) return;

    p1_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_texture_p1,
    });
    p2_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_texture_p2,
    });
    p3_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_texture_p3,
    });
  }

  private setupGlass() {
    if (!this.lab) return;

    const glassModelFile =
      this.experience.resources.getAsset<GLTF>("glass_model");
    if (!glassModelFile) return;

    const glass = glassModelFile.scene.getObjectByName("glass") as THREE.Mesh;
    if (!glass) return;

    glass.material = new THREE.MeshPhysicalMaterial({
      clearcoat: 0.5,
      ior: 1.25,
      specularIntensity: 1,
      roughness: 0.5,
      thickness: 0.35,
      transmission: 0.65,
      iridescence: 0.75,
    });

    this.group.add(glass);
  }

  private setupRadio() {
    if (!this.lab || !this.textures) return;

    const radio = this.lab.getObjectByName("radio") as THREE.Mesh;
    if (!radio) return;
    radio.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_texture_p3,
    });
  }

  private setupEmissive() {
    if (!this.lab) return;

    const redLights = this.lab.getObjectByName("red_lights") as THREE.Mesh;
    const greenLights = this.lab.getObjectByName("green_lights") as THREE.Mesh;
    const blackLights = this.lab.getObjectByName("black_lights") as THREE.Mesh;
    const whiteLights = this.lab.getObjectByName("white_lights") as THREE.Mesh;
    const cabinetLights = this.lab.getObjectByName(
      "cabinet_light"
    ) as THREE.Mesh;
    const bigRedLight = this.lab.getObjectByName("big_red_light") as THREE.Mesh;

    if (
      !redLights ||
      !greenLights ||
      !blackLights ||
      !whiteLights ||
      !cabinetLights ||
      !bigRedLight
    )
      return;

    redLights.material = new THREE.MeshBasicMaterial({ color: 0xbe0014 });
    greenLights.material = new THREE.MeshBasicMaterial({ color: 0x68d500 });
    blackLights.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    whiteLights.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    cabinetLights.material = new THREE.MeshBasicMaterial({
      color: 0xfdfce3,
    });
    bigRedLight.material = new THREE.MeshBasicMaterial({
      color: 0xb7000b,
    });
  }

  private setupAcid() {
    if (!this.lab) return;

    const acid = this.lab.getObjectByName("acid") as THREE.Mesh;
    if (!acid) return;
    acid.scale.setScalar(1.4);

    const acidMaterial = new THREE.ShaderMaterial({
      vertexShader: acidVertexShader,
      fragmentShader: acidFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAnimationSpeed: new THREE.Uniform(0.15),
        uFrequency: new THREE.Uniform(2.5),
        uOutsideColor: new THREE.Uniform(new THREE.Color("#d6ffb3")),
        uInsideColor: new THREE.Uniform(new THREE.Color("#befb88")),
        uOuterGlowScale: new THREE.Uniform(1.5),
        uOuterGlowOffset: new THREE.Uniform(-0.485),
        uStepThreshold: new THREE.Uniform(-0.005),
        uStepStrength: new THREE.Uniform(0.37),
      },
    });

    acid.material = acidMaterial;

    this.acid = {
      mesh: acid,
      material: acidMaterial,
      outsideColor: "#d6ffb3",
      insideColor: "#befb88",
    };
  }

  setupTweaks() {
    this.tweaks = this.experience.debug.gui.addFolder("Lab");
    if (this.acid) {
      const acidTweaks = this.tweaks.addFolder("Acid");
      acidTweaks
        .add(this.acid.material.uniforms.uAnimationSpeed, "value")
        .min(0)
        .max(2)
        .step(0.01)
        .name("animationSpeed");
      acidTweaks
        .add(this.acid.material.uniforms.uFrequency, "value")
        .min(0)
        .max(8)
        .step(0.1)
        .name("frequency");

      acidTweaks
        .add(this.acid.material.uniforms.uOuterGlowScale, "value")
        .min(0)
        .max(4)
        .step(0.01)
        .name("glowScale");

      acidTweaks
        .add(this.acid.material.uniforms.uOuterGlowOffset, "value")
        .min(-1)
        .max(1)
        .step(0.001)
        .name("glowOffset");

      acidTweaks
        .add(this.acid.material.uniforms.uStepThreshold, "value")
        .min(-0.5)
        .max(0.5)
        .step(0.001)
        .name("stepThreshold");

      acidTweaks
        .add(this.acid.material.uniforms.uStepStrength, "value")
        .min(0)
        .max(2)
        .step(0.001)
        .name("stepStrength");

      acidTweaks.addColor(this.acid, "outsideColor").onChange(() => {
        this.acid?.material.uniforms.uOutsideColor.value.set(
          this.acid.outsideColor
        );
      });
      acidTweaks.addColor(this.acid, "insideColor").onChange(() => {
        this.acid?.material.uniforms.uInsideColor.value.set(
          this.acid.insideColor
        );
      });
    }
  }

  update() {
    if (this.acid) {
      this.acid.material.uniforms.uTime.value =
        this.experience.timer.elapsedTime;
    }
  }

  destroy() {}
}

export default Lab;
