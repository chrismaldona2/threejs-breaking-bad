#include ../partials/cnoise.glsl

uniform float uTime;
uniform float uAnimationSpeed;
uniform float uFrequency;
uniform vec3 uOutsideColor;
uniform vec3 uInsideColor;
uniform float uOuterGlowScale;  
uniform float uOuterGlowOffset;
uniform float uStepThreshold;     
uniform float uStepStrength;     

varying vec2 vUv;

void main() {
  vec2 displacedUv = vUv + cnoise(vec3(vUv * uFrequency, uTime * uAnimationSpeed + 0.1));

  float strength = cnoise(vec3(displacedUv * uFrequency, uTime * uAnimationSpeed));

  float outerGlow = distance(vUv, vec2(0.5)) * uOuterGlowScale + uOuterGlowOffset;
  strength += outerGlow;

  strength += step(uStepThreshold, strength) * uStepStrength;

  vec3 color = mix(uInsideColor, uOutsideColor, strength);
  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
