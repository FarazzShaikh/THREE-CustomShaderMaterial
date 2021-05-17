
vec4 rotateR4(vec4 p,float x,float y,float u,float tumble){

    float cS=cos(y+0.7*tumble);
    float sS=sin(y+0.7*tumble);
    float cT=cos(x+1.5*tumble);
    float sT=sin(x+1.5*tumble);
    float cU=cos(u-1.3*tumble);
    float sU=sin(u-1.3*tumble);


    mat4 rotMatY=mat4(
    cS,0,-sS,0,
    0,cS,0,-sS,
    sS,0,cS,0,
    0,sS,0,cS
    );



    mat4 rotMatX=mat4(
    cT,0,0,-sT,
    0,cT,-sT,0,
    0,sT,cT,0,
    sT,0,0,cT
    );


    mat4 rotMatU=mat4(
    cU,-sU,0,0,
    sU,cU,0,0,
    0,0,cU,-sU,
    0,0,sU,cU
    );

    vec4 q=rotMatU*rotMatY*rotMatX*p;

    return q;
}

vec3 orthographicProj(vec4 p){
    //JUST DELETE THE W COORDINATE
    return p.xyz;
}


vec3 perspectiveProj(vec4 p){
    vec4 offset=vec4(0,0,0,1.5*baseRad);
    p=p+offset;

    return 12.*p.xyz/p.w;

}


vec3 combinedProj(vec4 v){

    //rotate in R4;
    v=rotateR4(v,PI/2.*rotY, PI/2.*rotX,PI/2.*rotU,tumble*uTime);

    //project to R3
    if(proj==0){
        return orthographicProj(v);
    }
    else{
        return perspectiveProj(v);
    }
}



vec3 displace(vec3 p){

    //rescale to live in unit square;
    vec2 sq=vec2(p.x+0.5,p.y+0.5);

    if(fn==0.){
        //if its constant: return a tiny sphere!
        float theta=2.*PI*sq.y;
        float phi=PI*sq.x;
        return 0.2*vec3(
        cos(theta)*sin(phi),
        sin(theta)*sin(phi),
        cos(phi)
        );
    }
else {
        float invPower=1./abs(fn);

        float rMax=baseRad;
        float rMin=0.;

        if (fn>0.){
            rMax=pow(baseRad, invPower);
        }
        else { //if fn<0
            rMin=pow(1./baseRad, invPower);
        }

        float r=(rMax-rMin)*sq.x+rMin;
        float t=2.*PI*sq.y;

        float R=pow(r, fn);
        float T=fn*t;

        float x=r*cos(t);
        float y=r*sin(t);
        float u=R*cos(T);
        float v=R*sin(T);

        vec4 q=vec4(x, y, u, v);

        return combinedProj(q);

    }
}