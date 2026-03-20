varying vec2 vUv;
varying float vElevation;
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vUv = uv;

  vec3 pos = position;

  float wave1 = sin(pos.x * 2.0 + uTime * 0.8) * 0.15;
  float wave2 = sin(pos.y * 3.0 + uTime * 0.6) * 0.1;
  float wave3 = cos(pos.x * 1.5 + pos.y * 2.0 + uTime * 0.4) * 0.08;

  float mouseInfluence = smoothstep(2.0, 0.0, length(pos.xy - uMouse * 2.0));
  float mouseWave = mouseInfluence * sin(uTime * 3.0) * 0.2;

  pos.z += wave1 + wave2 + wave3 + mouseWave;
  vElevation = pos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
