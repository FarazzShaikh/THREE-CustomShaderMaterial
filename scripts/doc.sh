#!/usr/bin/env bash

match="<h2><a href=\"index.html\">Home<\/a><\/h2>"
replace="<h2><a href=\"index.html\">Home<\/a><\/h2><h3><a href=\".\/\example\/index.html\">Demo<\/a><\/h3>"


lineNum=$(grep -n "<h2><a href=\"index.html\">Home</a></h2>" docs/index.html | cut -d: -f1)



unameOut="$(uname -s)"

if [ "$unameOut" = "Darwin" ]; then
    sed -i '' "${lineNum}s/$match/$replace/" docs/index.html
else
    sed -i "${lineNum}s/$match/$replace/" docs/index.html
fi

cp -R example docs

mkdir -p docs/build
cp build/three-csm.js docs/build/three-csm.js