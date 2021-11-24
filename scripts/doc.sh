#!/usr/bin/env bash

mkdir -p docs

cp -R Assets docs
cp -R example docs
cp -R build docs

jsdoc --configure jsdoc.json --verbose

chmod +x scripts/patch.sh
scripts/patch.sh docs /Assets/logo.png