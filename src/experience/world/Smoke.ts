import * as THREE from "three";
import Experience from "../Experience";
import vertexShader from "../../shaders/smoke/vertex.glsl";
import fragmentShader from "../../shaders/smoke/fragment.glsl";

class Smoke {
  private readonly experience: Experience;
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  texture?: THREE.Texture;
  color: string = "#d3c5e2";

  constructor() {
    this.experience = Experience.getInstance();

    this.texture =
      this.experience.resources.getAsset<THREE.Texture>("smoke_texture");
    this.setupTexture();

    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 32);
    this.geometry.translate(0, 0.5, 0);

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uTexture: new THREE.Uniform(this.texture),
        uColor: new THREE.Uniform(new THREE.Color(this.color)),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(0.0055, 0.025, 0.0055);
    this.mesh.position.set(0.2264, 0.0603, 0.305);

    this.experience.debug.gui.addColor(this, "color").onChange(() => {
      this.material.uniforms.uColor.value.set(this.color);
    });

    this.experience.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.experience.timer.elapsedTime;
  }

  setupTexture() {
    if (!this.texture) return;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
  }

  dispose() {}
}

export default Smoke;
