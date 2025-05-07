import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import Steam, { SteamOptions } from "./Steam";
import RadioController from "./RadioController";
import AcidEffect from "./AcidEffect";

class Lab {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly gui = this.experience.debug.gui;

  group: THREE.Group;
  lab?: THREE.Object3D;
  textures?: {
    lab_p1: THREE.Texture;
    lab_p2: THREE.Texture;
    lab_p3: THREE.Texture;
  };

  acidEffect?: AcidEffect;
  glass?: THREE.Mesh;

  coffeeSteam?: Steam;
  greenChemicalSteam?: Steam;
  blueChemicalSteam?: Steam;
  orangeChemicalSteam?: Steam;

  radioController?: RadioController;

  constructor() {
    this.group = new THREE.Group();
    this.init();
    this.group.scale.setScalar(0.025);
    this.experience.scene.add(this.group);
  }

  private init() {
    this.setupTextures();
    this.setupLab();
    this.setupGlass();
    this.setupLabMaterials();
    this.setupEmissive();
    this.setupCoffeeSteam();
    this.setupChemicalsSteams();
    this.setupRadio();
    this.setupAcid();
  }

  private setupLab() {
    const labModelFile = this.resources.getAsset<GLTF>("lab_model");
    if (!labModelFile) return null;
    this.lab = labModelFile.scene;
    this.group.add(this.lab);
  }

  private setupTextures() {
    const lab_p1 = this.resources.getAsset<THREE.Texture>("lab_texture_p1");
    const lab_p2 = this.resources.getAsset<THREE.Texture>("lab_texture_p2");
    const lab_p3 = this.resources.getAsset<THREE.Texture>("lab_texture_p3");

    if (!lab_p1 || !lab_p2 || !lab_p3) return;

    lab_p1.flipY = false;
    lab_p1.colorSpace = THREE.SRGBColorSpace;
    lab_p2.flipY = false;
    lab_p2.colorSpace = THREE.SRGBColorSpace;
    lab_p3.flipY = false;
    lab_p3.colorSpace = THREE.SRGBColorSpace;

    this.textures = {
      lab_p1,
      lab_p2,
      lab_p3,
    };
  }

  private getMesh(name: string, source?: THREE.Object3D): THREE.Mesh {
    const src = source ?? this.lab!;
    const mesh = src.getObjectByName(name);

    if (!mesh || !(mesh instanceof THREE.Mesh)) {
      throw new Error(`Lab: couldn’t find mesh named "${name}"`);
    }

    return mesh;
  }

  private setupLabMaterials() {
    if (!this.lab || !this.textures) return;

    const p1_objects = this.getMesh("part1");
    const p2_objects = this.getMesh("part2");
    const p3_objects = this.getMesh("part3");

    p1_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_p1,
    });
    p2_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_p2,
    });
    p3_objects.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_p3,
    });
  }

  private setupGlass() {
    if (!this.lab) return;

    const glassModelFile = this.resources.getAsset<GLTF>("glass_model");
    if (!glassModelFile) return;

    this.glass = this.getMesh("glass", glassModelFile.scene);

    const envMap = this.resources.getAsset<THREE.CubeTexture>("env_map");
    if (envMap) envMap.colorSpace = THREE.SRGBColorSpace;

    this.glass.material = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      transparent: true,
      opacity: 0.225,
      shininess: 50,
      fog: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      refractionRatio: 0.5,
      combine: THREE.MixOperation,
      reflectivity: 0.38,
      envMap,
    });

    this.group.add(this.glass);
  }

  private setupRadio() {
    if (!this.lab || !this.textures) return;

    const radio = this.getMesh("radio");
    const buttons = this.getMesh("radio_buttons");

    radio.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_p3,
    });
    buttons.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_p2,
    });

    this.radioController = new RadioController([radio, buttons]);
  }

  private setupEmissive() {
    if (!this.lab) return;

    const redLights = this.getMesh("red_lights");
    const greenLights = this.getMesh("green_lights");
    const blackLights = this.getMesh("black_lights");
    const whiteLights = this.getMesh("white_lights");
    const cabinetLights = this.getMesh("cabinet_light");
    const bigRedLight = this.getMesh("big_red_light");

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

  private setupCoffeeSteam() {
    if (!this.lab) return;

    this.coffeeSteam = new Steam();
    this.coffeeSteam.mesh.position.set(9.055, 2.4, 12.2);
    this.coffeeSteam.mesh.scale.set(0.22, 1.5, 0.22);

    this.group.add(this.coffeeSteam.mesh);
  }

  private setupChemicalsSteams() {
    if (!this.lab) return;

    const chemicalSteamConf: SteamOptions = {
      steamOpacity: 0.5,
      steamUvScale: 0.26,
      steamThresholdLow: 0,
      steamThresholdHigh: 0.75,
      twistStrength: 7,
      windSpeed: 0.01,
      windStrength: 17.5,
      windExponent: 5,
    };

    this.greenChemicalSteam = new Steam({
      ...chemicalSteamConf,
      color: "#8af4a7",
      steamThresholdHigh: 1,
      steamOpacity: 0.85,
    });
    this.greenChemicalSteam.mesh.scale.set(0.13, 1, 0.13);
    this.greenChemicalSteam.mesh.position.set(0.834, 3.27, -4);

    this.blueChemicalSteam = new Steam({
      ...chemicalSteamConf,
      color: "#a8f5ff",
    });
    this.blueChemicalSteam.mesh.scale.set(0.13, 1.4, 0.13);
    this.blueChemicalSteam.mesh.position.set(1.515, 3.193, -4.35);

    this.orangeChemicalSteam = new Steam({
      ...chemicalSteamConf,
      color: "#ffb22e",
      steamOpacity: 0.6,
      twistStrength: 11.25,
      windStrength: 5.3,
      steamUvScale: 0.08,
      twistSpeed: 0.01,
      steamThresholdLow: 0,
      steamThresholdHigh: 1,
    });
    this.orangeChemicalSteam.mesh.scale.set(0.13, 0.85, 0.13);
    this.orangeChemicalSteam.mesh.position.set(2.2, 3.18, -3.931);

    this.group.add(
      this.blueChemicalSteam.mesh,
      this.greenChemicalSteam.mesh,
      this.orangeChemicalSteam.mesh
    );
  }

  private setupAcid() {
    if (!this.lab) return;
    const acid = this.getMesh("acid");
    this.acidEffect = new AcidEffect(acid);
  }

  setupTweaks() {
    if (this.glass?.material instanceof THREE.MeshPhongMaterial) {
      const glassTweaks = this.gui.addFolder("Glass");
      glassTweaks.close();
      glassTweaks
        .add(this.glass.material, "opacity")
        .min(0)
        .max(1)
        .step(0.01)
        .name("opacity");
      glassTweaks
        .add(this.glass.material, "shininess")
        .min(0)
        .max(200)
        .step(1)
        .name("shininess");
      glassTweaks.add(this.glass.material, "reflectivity").min(0).max(1);
    }

    if (this.coffeeSteam) {
      const debug = {
        color: this.coffeeSteam.material.uniforms.uColor.value.getHex(),
      };
      const coffeSteamTweaks = this.gui.addFolder("CoffeeSteam");
      coffeSteamTweaks.close();
      coffeSteamTweaks.addColor(debug, "color").onChange(() => {
        this.coffeeSteam!.material.uniforms.uColor.value.set(debug.color);
      });
      coffeSteamTweaks.add(this.coffeeSteam.material, "wireframe");
    }

    if (this.acidEffect) this.acidEffect.setupTweaks();

    if (this.radioController) {
      const radioDebug = {
        volume: 70,
      };
      const radioTweaks = this.gui.addFolder("Radio");
      radioTweaks.close();
      radioTweaks
        .add(radioDebug, "volume")
        .min(0)
        .max(100)
        .onChange(() => {
          this.radioController!.setVolume(radioDebug.volume / 100);
        });
    }
  }

  update() {
    this.acidEffect?.update();
    this.coffeeSteam?.update();
    this.greenChemicalSteam?.update();
    this.blueChemicalSteam?.update();
    this.orangeChemicalSteam?.update();
  }

  destroy() {
    this.acidEffect?.dispose();
    this.coffeeSteam?.dispose();
    this.greenChemicalSteam?.dispose();
    this.blueChemicalSteam?.dispose();
    this.orangeChemicalSteam?.dispose();
    this.radioController?.dispose();

    this.group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    this.experience.scene.remove(this.group);
  }
}

export default Lab;
