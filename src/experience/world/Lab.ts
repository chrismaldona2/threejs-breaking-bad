import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import acidVertexShader from "../../shaders/acid/vertex.glsl";
import acidFragmentShader from "../../shaders/acid/fragment.glsl";
import GUI from "lil-gui";
import Steam, { SteamOptions } from "./Steam";

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
  glass?: THREE.Mesh;
  coffeeSteam?: Steam;
  blueChemicalSteam?: Steam;

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
    this.setupCoffeeSteam();
    this.setupChemicalsSteams();
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

  private getMesh(name: string, source: THREE.Object3D): THREE.Mesh {
    const m = source.getObjectByName(name);
    if (!m || !(m instanceof THREE.Mesh)) {
      throw new Error(`Lab: couldn’t find mesh named "${name}"`);
    }
    return m;
  }

  private setupLabMaterials() {
    if (!this.lab || !this.textures) return;
    this.lab.getObjectByName;

    const p1_objects = this.getMesh("part1", this.lab);
    const p2_objects = this.getMesh("part2", this.lab);
    const p3_objects = this.getMesh("part3", this.lab);

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

    this.glass = this.getMesh("glass", glassModelFile.scene);

    // this.glass.material = new THREE.MeshPhysicalMaterial({
    //   roughness: 0.2,
    //   thickness: 0.1,
    //   transmission: 0.85,
    //   side: THREE.DoubleSide,
    //   depthWrite: false,
    // });

    const envMap =
      this.experience.resources.getAsset<THREE.CubeTexture>("env_map");
    if (envMap) {
      envMap.colorSpace = THREE.SRGBColorSpace;
    }

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

    const radio = this.getMesh("radio", this.lab);

    radio.material = new THREE.MeshBasicMaterial({
      map: this.textures.lab_texture_p3,
    });
  }

  private setupEmissive() {
    if (!this.lab) return;

    const redLights = this.getMesh("red_lights", this.lab);
    const greenLights = this.getMesh("green_lights", this.lab);
    const blackLights = this.getMesh("black_lights", this.lab);
    const whiteLights = this.getMesh("white_lights", this.lab);
    const cabinetLights = this.getMesh("cabinet_light", this.lab);
    const bigRedLight = this.getMesh("big_red_light", this.lab);

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

    this.lab.add(this.coffeeSteam.mesh);
  }

  private setupChemicalsSteams() {
    if (!this.lab) return;

    const chemicalSteamConf: SteamOptions = {
      steamOpacity: 0.5,
      steamUvScale: 0.26,
      steamThresholdLow: 0.43,
      steamThresholdHigh: 0.68,
      twistAmount: 7,
      windSpeed: 0.01,
      windStrength: 17.5,
      windExponent: 5,
    };

    this.blueChemicalSteam = new Steam({
      ...chemicalSteamConf,
      color: "#a8f5ff",
    });
    this.blueChemicalSteam.mesh.position.set(1.515, 3.193, -4.35);
    this.blueChemicalSteam.mesh.scale.set(0.13, 1.4, 0.13);

    this.lab.add(this.blueChemicalSteam.mesh);
  }

  private setupAcid() {
    if (!this.lab) return;

    const acid = this.getMesh("acid", this.lab);
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
    this.tweaks = this.experience.debug.gui;
    if (this.acid) {
      const acidTweaks = this.tweaks.addFolder("Acid");
      acidTweaks.close();
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
        this.acid!.material.uniforms.uOutsideColor.value.set(
          this.acid!.outsideColor
        );
      });
      acidTweaks.addColor(this.acid, "insideColor").onChange(() => {
        this.acid!.material.uniforms.uInsideColor.value.set(
          this.acid!.insideColor
        );
      });
    }

    if (this.glass?.material instanceof THREE.MeshPhongMaterial) {
      const glassTweaks = this.tweaks.addFolder("Glass");
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
      const coffeSteamTweaks = this.tweaks.addFolder("CoffeeSteam");
      coffeSteamTweaks.close();
      coffeSteamTweaks.addColor(debug, "color").onChange(() => {
        this.coffeeSteam!.material.uniforms.uColor.value.set(debug.color);
      });
      coffeSteamTweaks.add(this.coffeeSteam.material, "wireframe");
    }

    if (this.blueChemicalSteam) {
      const debug = {
        color: this.blueChemicalSteam.material.uniforms.uColor.value.getHex(),
      };
      const blueChemicalTweaks = this.tweaks.addFolder("BlueChemicalSteam");

      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.position, "x")
        .min(0)
        .max(4)
        .step(0.001)
        .name("positionX");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.position, "y")
        .min(0)
        .max(4)
        .step(0.001)
        .name("positionY");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.position, "z")
        .min(-6)
        .max(0)
        .step(0.001)
        .name("positionZ");

      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.scale, "x")
        .min(0)
        .max(2)
        .step(0.001)
        .name("scaleX");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.scale, "y")
        .min(0)
        .max(3)
        .step(0.001)
        .name("scaleY");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.mesh.scale, "z")
        .min(0)
        .max(2)
        .step(0.001)
        .name("scaleZ");

      blueChemicalTweaks.addColor(debug, "color").onChange(() => {
        this.blueChemicalSteam!.material.uniforms.uColor.value.set(debug.color);
      });
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uSteamOpacity, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("opacity");

      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uSteamUvScale, "value")
        .min(0)
        .max(1)
        .step(0.01)
        .name("uvScale");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uSteamSpeed, "value")
        .min(0)
        .max(0.5)
        .step(0.001)
        .name("speed");
      blueChemicalTweaks
        .add(
          this.blueChemicalSteam.material.uniforms.uSteamThresholdLow,
          "value"
        )
        .min(0)
        .max(1)
        .step(0.001)
        .name("steamThresholdLow");
      blueChemicalTweaks
        .add(
          this.blueChemicalSteam.material.uniforms.uSteamThresholdHigh,
          "value"
        )
        .min(0)
        .max(1)
        .step(0.001)
        .name("steamThresholdHigh");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uTwistSpeed, "value")
        .min(0)
        .max(0.5)
        .step(0.001)
        .name("twistSpeed");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uTwistAmount, "value")
        .min(0)
        .max(14)
        .step(0.01)
        .name("twistAmount");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uWindSpeed, "value")
        .min(0)
        .max(0.1)
        .step(0.001)
        .name("windSpeed");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uWindStrength, "value")
        .min(0)
        .max(100)
        .step(0.01)
        .name("windStrength");
      blueChemicalTweaks
        .add(this.blueChemicalSteam.material.uniforms.uWindExponent, "value")
        .min(0)
        .max(7)
        .step(1)
        .name("windExponent");
      blueChemicalTweaks.add(this.blueChemicalSteam.material, "wireframe");
    }
  }

  update() {
    if (this.acid) {
      this.acid.material.uniforms.uTime.value =
        this.experience.timer.elapsedTime;
    }

    this.coffeeSteam?.update();
    this.blueChemicalSteam?.update();
  }

  destroy() {
    this.coffeeSteam?.dispose();
    this.blueChemicalSteam?.dispose();
  }
}

export default Lab;
