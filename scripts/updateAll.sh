for d in ./examples/* ; do
    cd $d
    yarn add three-custom-shader-material three @types/three @react-three/fiber @react-three/drei
    cd ../../
done