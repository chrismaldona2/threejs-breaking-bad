import * as THREE from "three";
import Experience from "../Experience";
import acidVertexShader from "../../shaders/acid/vertex.glsl";
import acidFragmentShader from "../../shaders/acid/fragment.glsl";
import GUI from "lil-gui";

class AcidEffect {
  private readonly experience = Experience.getInstance();
  private readonly gui = this.experience.debug.gui;
  private tweaks?: GUI;
  private readonly timer = this.experience.timer;

  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;

  outsideColor: string = "#d6ffb3";
  insideColor: string = "#befb88";

  constructor(mesh: THREE.Mesh) {
    this.mesh = mesh;
    this.material = new THREE.ShaderMaterial({
      vertexShader: acidVertexShader,
      fragmentShader: acidFragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAnimationSpeed: new THREE.Uniform(0.15),
        uFrequency: new THREE.Uniform(2.5),
        uOutsideColor: new THREE.Uniform(new THREE.Color(this.outsideColor)),
        uInsideColor: new THREE.Uniform(new THREE.Color(this.insideColor)),
        uOuterGlowScale: new THREE.Uniform(1.5),
        uOuterGlowOffset: new THREE.Uniform(-0.485),
        uStepThreshold: new THREE.Uniform(-0.005),
        uStepStrength: new THREE.Uniform(0.37),
      },
    });
    this.mesh.material = this.material;
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsedTime;
  }

  dispose() {
    this.material.dispose();
    this.tweaks?.destroy();
  }

  setupTweaks() {
    this.tweaks = this.gui.addFolder("Acid");
    this.tweaks.close();
    this.tweaks
      .add(this.material.uniforms.uAnimationSpeed, "value")
      .min(0)
      .max(2)
      .step(0.01)
      .name("animationSpeed");
    this.tweaks
      .add(this.material.uniforms.uFrequency, "value")
      .min(0)
      .max(8)
      .step(0.1)
      .name("frequency");
    this.tweaks
      .add(this.material.uniforms.uOuterGlowScale, "value")
      .min(0)
      .max(4)
      .step(0.01)
      .name("glowScale");
    this.tweaks
      .add(this.material.uniforms.uOuterGlowOffset, "value")
      .min(-1)
      .max(1)
      .step(0.001)
      .name("glowOffset");
    this.tweaks
      .add(this.material.uniforms.uStepThreshold, "value")
      .min(-0.5)
      .max(0.5)
      .step(0.001)
      .name("stepThreshold");
    this.tweaks
      .add(this.material.uniforms.uStepStrength, "value")
      .min(0)
      .max(2)
      .step(0.001)
      .name("stepStrength");
    this.tweaks.addColor(this, "outsideColor").onChange(() => {
      this.material.uniforms.uOutsideColor.value.set(this.outsideColor);
    });
    this.tweaks.addColor(this, "insideColor").onChange(() => {
      this.material.uniforms.uInsideColor.value.set(this.insideColor);
    });
  }
}

export default AcidEffect;
