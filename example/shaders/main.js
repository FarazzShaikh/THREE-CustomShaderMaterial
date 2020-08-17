export default `
    vec2 offset = vec2(xoff + time, yoff + time);    
    
    vec3 noise =  vec3(Displace(position.xy, offset));
    vec3 newPosition = position + (normal * noise) * zscale;

    vec3 transformed = vec3(newPosition);
`