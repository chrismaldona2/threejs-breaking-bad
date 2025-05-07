import * as THREE from "three";
import Experience from "../Experience";
import vertexShader from "../../shaders/steam/vertex.glsl";
import fragmentShader from "../../shaders/steam/fragment.glsl";

export interface SteamOptions {
  color?: string;
  twistSpeed?: number;
  twistStrength?: number;
  windSpeed?: number;
  windStrength?: number;
  windExponent?: number;
  steamUvScale?: number;
  steamSpeed?: number;
  steamThresholdLow?: number;
  steamThresholdHigh?: number;
  steamOpacity?: number;
}

const defaultOptions: SteamOptions = {
  color: "#d3c5e2",
  twistSpeed: 0.01,
  twistStrength: 7,
  windSpeed: 0.01,
  windStrength: 2,
  windExponent: 4,
  steamUvScale: 0.2,
  steamSpeed: 0.03,
  steamThresholdLow: 0.4,
  steamThresholdHigh: 1.0,
  steamOpacity: 0.5,
};

class Steam {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  private texture?: THREE.Texture;

  constructor(options: SteamOptions = {}) {
    this.experience = Experience.getInstance();

    this.texture = this.resources.getAsset<THREE.Texture>("steam_texture");
    this.setupTexture();

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 32);
    this.geometry.translate(0, 0.5, 0);

    const mergedOpts = { ...defaultOptions, ...options };

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uTexture: new THREE.Uniform(this.texture),
        uColor: new THREE.Uniform(new THREE.Color(mergedOpts.color)),
        uTwistSpeed: new THREE.Uniform(mergedOpts.twistSpeed),
        uTwistStrength: new THREE.Uniform(mergedOpts.twistStrength),
        uWindSpeed: new THREE.Uniform(mergedOpts.windSpeed),
        uWindStrength: new THREE.Uniform(mergedOpts.windStrength),
        uWindExponent: new THREE.Uniform(mergedOpts.windExponent),
        uSteamUvScale: new THREE.Uniform(mergedOpts.steamUvScale),
        uSteamSpeed: new THREE.Uniform(mergedOpts.steamSpeed),
        uSteamThresholdLow: new THREE.Uniform(mergedOpts.steamThresholdLow),
        uSteamThresholdHigh: new THREE.Uniform(mergedOpts.steamThresholdHigh),
        uSteamOpacity: new THREE.Uniform(mergedOpts.steamOpacity),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.timer.elapsedTime;
  }

  setupTexture() {
    if (!this.texture) return;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default Steam;
