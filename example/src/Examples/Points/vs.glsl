uniform float uTime;
varying float vVisibility;
varying vec3 vViewNormal;

void main() {
    vec3 n = gln_curl(position + uTime * 0.05);
    
    vec3 _viewNormal = normalMatrix * normal;
    vViewNormal = _viewNormal;
    vec4 _mvPosition = modelViewMatrix * vec4(position, 1.);

    float visibility = step(-0.1, dot(-normalize(_mvPosition.xyz), normalize(_viewNormal)));
    vVisibility = visibility;

    csm_Position = position + (normal * n * 0.5);
    csm_PointSize += ((1. - visibility) * 0.05);
}