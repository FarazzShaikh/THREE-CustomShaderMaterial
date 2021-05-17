vec3 newPos = position + (normal * displace(position));

float offset = 20.0 / 256.0;
vec3 tangent = orthogonal(normal);
vec3 bitangent = normalize(cross(normal, tangent));
vec3 neighbour1 = position + tangent * offset;
vec3 neighbour2 = position + bitangent * offset;
vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);
// https://i.ya-webdesign.com/images/vector-normals-tangent-16.png
vec3 displacedTangent = displacedNeighbour1 - newPos;
vec3 displacedBitangent = displacedNeighbour2 - newPos;
// https://upload.wikimedia.org/wikipedia/commons/d/d2/Right_hand_rule_cross_product.svg
vec3 newNormal = normalize(cross(displacedTangent, displacedBitangent));