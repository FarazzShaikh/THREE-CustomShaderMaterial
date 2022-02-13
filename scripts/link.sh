
cd dist
yarn link
cd ../


cd ./node_modules/react
yarn link
cd ../../
cd ./node_modules/three
yarn link
cd ../../
cd ./node_modules/@react-three/fiber
yarn link
cd ../../../

for d in ./examples/* ; do
    cd $d
    yarn link three-custom-shader-material
    yarn link react
    yarn link three
    yarn link @react-three/fiber
    cd ../../
done