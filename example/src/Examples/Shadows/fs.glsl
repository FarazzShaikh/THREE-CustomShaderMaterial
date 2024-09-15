uniform sampler2D uMap;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(uMap, vUv);
    csm_DiffuseColor = vec4(vec3(color.a), 1.0);
    csm_DepthAlpha = color.a;
}