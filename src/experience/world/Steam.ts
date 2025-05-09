import * as THREE from "three";
import Experience from "../Experience";
import vertexShader from "../../shaders/steam/vertex.glsl";
import fragmentShader from "../../shaders/steam/fragment.glsl";

interface Options {
  color: string;
  twistSpeed: number;
  twistStrength: number;
  windSampleX: number;
  windSampleZ: number;
  windSpeed: number;
  windStrength: number;
  windExponent: number;
  steamUvScale: number;
  steamSpeed: number;
  steamThresholdLow: number;
  steamThresholdHigh: number;
  steamOpacity: number;
}

const defaultOptions: Options = {
  color: "#d3c5e2",
  twistSpeed: 0.01,
  twistStrength: 7,
  windSampleX: 0.25,
  windSampleZ: 0.75,
  windSpeed: 0.01,
  windStrength: 2,
  windExponent: 4,
  steamUvScale: 0.2,
  steamSpeed: 0.03,
  steamThresholdLow: 0.4,
  steamThresholdHigh: 1.0,
  steamOpacity: 0.5,
};

export type SteamOptions = Partial<Options>;

class Steam {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;

  constructor(options: SteamOptions = {}) {
    this.experience = Experience.getInstance();

    const texture = this.resources.getAsset<THREE.Texture>("steam_texture");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

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
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(new THREE.Color(mergedOpts.color)),
        uTwistSpeed: new THREE.Uniform(mergedOpts.twistSpeed),
        uTwistStrength: new THREE.Uniform(mergedOpts.twistStrength),
        uWindSampleX: new THREE.Uniform(mergedOpts.windSampleX),
        uWindSampleZ: new THREE.Uniform(mergedOpts.windSampleZ),
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

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default Steam;
