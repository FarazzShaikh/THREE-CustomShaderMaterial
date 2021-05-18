//INPUT: a point  vec3 params, having x and y coordinates in 0,1 and z=0
//OUTPUT: a point vec3 giving location in R3 for the parametric surface




//=============================================
//Components for building the surface
//=============================================


//take in polar coordinates, spit out cartesian
vec2 toZ(vec2 p){
    float r=p.x;
    float t=p.y;

    float x=r*cos(t);
    float y=r*sin(t);

    return vec2(x,y);
}


//take in cartesian, spit out polar
vec2 fromZ(vec2 q){

    float r=length(q);
    float t=atan(q.y, q.x);

    return vec2(r, t);
}





//=============================================
//Components for working with points in R4
//=============================================

vec4 translateR4(vec4 p,vec4 q){
    return p+q;
}


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


vec3 stereographicProj(vec4 p){

    if(p.w>-0.999){

        return p.xyz/(p.w+1.0);
    }
    else{//delete the triangle
        return vec3(0./0.);
    }
}


vec3 perspectiveProj(vec4 p){
    vec4 offset=vec4(0,0,0,2.);
    p=p+offset;

    return 2.*p.xyz/p.w;

}


vec3 combinedProj(vec4 v){

    //rotate in R4;
    v=rotateR4(v,PI/2.*roty, PI/2.*rotx,PI/2.*rotu,tumble*time);

    //project to R3
    if(proj==0){
        return 3.*stereographicProj(v);
    }
    if(proj==1){
        return 3.*perspectiveProj(v);
    }
    else{
        return 3.*orthographicProj(v);
    }
}




//=============================================
//Functions to Export: Graping Z^n in R4
//=============================================


vec2 znPolar(float r,float t){
    //input: r,theta
    //output: R,Theta taking input to the n^th power

    float R=pow(r, n);
    float T=n*t;

    return vec2(R,T);
}


vec2 setDomain(vec2 params,out vec2 rBounds){
    //take in point in square [0,1]x[0,1]
    //output polar coordinates in domain

    float invPower=1./abs(n);

    float rMax=baseRad;
    float rMin=0.;


    //setting the size of the domain
    if (n>0.){
        rMax=pow(baseRad, invPower);
    }
    else { //if n<0
        rMin=pow(1./baseRad, invPower);
    }

    //converting correctly to polar coordinates
    float r=(rMax-rMin)*params.x+rMin;
    float t=2.*PI*params.y;

    rBounds=vec2(rMin,rMax);
    return vec2(r,t);
}


//overload of previous not bothering to output the new r bounds
vec2 setDomain(vec2 params){
    vec2 rBounds;
    return setDomain(params,rBounds);
}


vec4 r4Graph(vec3 params){

    //set up the domain
    vec2 dom=setDomain(params.xy);
    float r=dom.x;
    float t=dom.y;

    //apply the function
    vec2 codom=znPolar(r,t);
    float R=codom.x;
    float T=codom.y;

    //make the graph
    float x=r*cos(t);
    float y=r*sin(t);
    float u=R*cos(T);
    float v=R*sin(T);

    vec4 q=vec4(x, y, u, v);

    return q;

}

vec3 displace(vec3 params){

    //params arive in (-0.5,0.5)^2: need to rescale
    params+=vec3(0.5,0.5,0.);
    //now in [0,1]^2:

    if(n==0.){
        //if its constant: return a tiny sphere!
        float theta=2.*PI*params.y;
        float phi=PI*params.x;
        return 0.2*vec3(
        cos(theta)*sin(phi),
        sin(theta)*sin(phi),
        cos(phi)
        );
    }
    else {
       vec4 q=r4Graph(params);

        return combinedProj(q);

    }
}
