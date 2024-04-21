uniform float uTime;

vec3 displace(vec3 point) {
    vec3 instancePosition = (instanceMatrix * vec4(point, 1.)).xyz;
    return instancePosition + (normal * gln_perlin((instancePosition * 2.) + uTime) * 0.5);
}  

vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
    : vec3(0.0, -v.z, v.y));
}

vec3 recalcNormals(vec3 newPos) {
    float offset = 0.001;
    vec3 tangent = orthogonal(normal);
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 neighbour1 = position + tangent * offset;
    vec3 neighbour2 = position + bitangent * offset;

    vec3 displacedNeighbour1 = displace(neighbour1);
    vec3 displacedNeighbour2 = displace(neighbour2);

    vec3 displacedTangent = displacedNeighbour1 - newPos;
    vec3 displacedBitangent = displacedNeighbour2 - newPos;

    return normalize(cross(displacedTangent, displacedBitangent));
}

void main() {
    vec3 p = displace(position);
    csm_PositionRaw = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.);
    csm_Normal = recalcNormals(p);
}