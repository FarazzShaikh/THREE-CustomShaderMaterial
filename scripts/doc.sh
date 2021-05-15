mkdir -p docs &&\

cp -R example docs/example &&\
cp -R build docs/build &&\

jsdoc --configure jsdoc.json --verbose