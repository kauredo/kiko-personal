varying vec2 vUv;
varying float vElevation;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

void main() {
  float mixFactor = (vElevation + 0.3) * 1.5;
  mixFactor = clamp(mixFactor, 0.0, 1.0);

  vec3 color = mix(uColorA, uColorB, mixFactor);

  float pulse = sin(vUv.x * 10.0 + uTime * 0.5) * 0.05 + 0.95;
  color *= pulse;

  float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
  edgeFade *= smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

  gl_FragColor = vec4(color, uOpacity * edgeFade);
}
