import * as THREE from "three";
import sources, { Source } from "../data/sources";
import EventEmitter from "./EventEmitter";
import { DRACOLoader, GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

type SupportedLoaders =
  | GLTFLoader
  | THREE.TextureLoader
  | THREE.CubeTextureLoader;
type SupportedFiles = GLTF | THREE.Texture;

class Resources extends EventEmitter {
  private sources: Source[];
  private toLoad: number;
  private loaded: number;
  private items: Record<string, SupportedFiles>;
  private loaders: Record<string, SupportedLoaders>;

  constructor() {
    super();
    this.sources = sources;
    this.loaded = 0;
    this.toLoad = sources.length;
    this.loaders = this.initializeLoaders();
    this.items = {};

    this.startLoading();
  }

  private initializeLoaders(): Record<string, SupportedLoaders> {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    return {
      gltf: gltfLoader,
      texture: textureLoader,
      cubeTexture: cubeTextureLoader,
    };
  }

  private startLoading() {
    this.sources.forEach((source) => {
      if (source.type === "cubeTexture") {
        const loader = this.loaders[source.type] as THREE.CubeTextureLoader;
        loader.load(
          source.path as string[],
          (texture) => {
            this.items[source.name] = texture;
            this.fileLoaded();
          },
          undefined,
          (error) => {
            console.error(`Error loading ${source.name}:`, error);
            this.fileLoaded();
          }
        );
      } else {
        const loader = this.loaders[source.type] as
          | GLTFLoader
          | THREE.TextureLoader;
        loader.load(
          source.path as string,
          (file) => {
            this.items[source.name] = file;
            this.fileLoaded();
          },
          undefined,
          (error) => {
            console.error(`Error loading ${source.name}:`, error);
            this.fileLoaded();
          }
        );
      }
    });
  }

  private fileLoaded() {
    this.loaded++;
    if (this.toLoad === this.loaded) {
      this.trigger("loaded");
    }
  }

  getAsset<T extends SupportedFiles>(name: string): T | undefined {
    return this.items[name] as T;
  }
}

export default Resources;
