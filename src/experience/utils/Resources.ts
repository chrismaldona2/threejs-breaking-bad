import * as THREE from "three";
import sources from "../data/sources";
import EventEmitter from "./EventEmitter";
import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

type Loaders = {
  gltf: GLTFLoader;
  texture: THREE.TextureLoader;
  cubeTexture: THREE.CubeTextureLoader;
  audio: THREE.AudioLoader;
};

type SupportedFiles = GLTF | THREE.Texture | THREE.CubeTexture | AudioBuffer;

class Resources extends EventEmitter {
  private sources = sources;
  private resources: Record<string, SupportedFiles>;
  private loaders: Loaders;

  private toLoad = sources.length;
  private loaded = 0;
  loadProgress = 0;

  constructor() {
    super();
    this.resources = {};
    this.loaders = this.initLoaders();
    this.startLoading();
  }

  private initLoaders(): Loaders {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    return {
      gltf: gltfLoader,
      texture: new THREE.TextureLoader(),
      audio: new THREE.AudioLoader(),
      cubeTexture: new THREE.CubeTextureLoader(),
    };
  }

  private startLoading() {
    this.sources.forEach((src) => {
      switch (src.type) {
        case "gltf":
          this.loaders.gltf.load(
            src.path,
            (gltf) => this.handleLoadSuccess(src.name, gltf),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        case "texture":
          this.loaders.texture.load(
            src.path,
            (tex) => this.handleLoadSuccess(src.name, tex),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        case "audio":
          this.loaders.audio.load(
            src.path,
            (buffer) => this.handleLoadSuccess(src.name, buffer),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        case "cubeTexture":
          this.loaders.cubeTexture.load(
            src.path,
            (cubeTex) => this.handleLoadSuccess(src.name, cubeTex),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
      }
    });
  }

  private handleLoadSuccess(name: string, asset: SupportedFiles) {
    this.resources[name] = asset;
    this.loaded++;
    this.loadProgress = this.loaded / this.toLoad;
    this.trigger("fileLoaded");

    if (this.loaded === this.toLoad) {
      this.trigger("loadFinish");
    }
  }

  private handleLoadError(name: string, error: unknown) {
    console.error(`Error loading ${name}:`, error);
    this.loaded++;
    this.loadProgress = this.loaded / this.toLoad;
    this.trigger("fileLoaded");

    if (this.loaded === this.toLoad) {
      this.trigger("loadFinish");
    }
  }

  getAsset<T extends SupportedFiles>(name: string): T {
    const asset = this.resources[name] as T;

    if (!asset)
      throw new Error(`There was an error trying to retrieve ${name}`);

    return asset;
  }

  dispose() {
    this.off("fileLoaded");
    this.off("loadFinish");
  }
}

export default Resources;
