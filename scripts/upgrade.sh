for d in ./examples/* ; do
    cd $d
    yarn upgrade --latest
    cd ../../
done