yarn build &&\ 
cp package.json dist/package.json &&\
cp README.md dist &&\
cp LICENSE  dist &&\
yarn patchJSON &&\
cd dist &&\
npm publish