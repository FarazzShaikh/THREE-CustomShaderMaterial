#!/bin/sh
# Add favicon to header of HTML files.
# One use case is for javadoc-generated API documentation.
#
# Run like this:
# add-favicon <directory> <favicon.png>
# The arguments should be paths relative to the current working directory.

# Once this has been run, running it another time has no effect.

patchIt () {
  for f in $1/*.html ; do
    if [ -f "$f" ]; then     # if no .html files exist, f is literal "*.html"
    #   awk '{sub(/<h3>Modules<\/h3>/,"<h3>GLSL<\/h3>")}1' $f > temp.txt && mv temp.txt $f
    #   awk '{sub(/<h3>Global<\/h3>/,"<h3>Loaders<\/h3>")}1' $f > temp.txt && mv temp.txt $f
    #   awk '{sub(/<p>Module<\/p>/,"<p>GLSL<\/p>")}1' $f > temp.txt && mv temp.txt $f

      tmpfile=`mktemp patch_favicon_XXXXX`
      # This creates tmpfile, with the same permissions as $f.
      # The next command will overwrite it but preserve the permissions.
      # Hat tip to http://superuser.com/questions/170226/standard-way-to-duplicate-a-files-permissions for this trick.
      \cp -p $f $tmpfile
      sed -e " s%<head>\$%<head><link rel=\"icon\" href=\"$2\" type=\"image/png\"/>%" $f > $tmpfile
      mv -f $tmpfile $f
    fi;
  done ;
  for d in $1/* ; do
    if [ -d $d ]; then echo "descending to "$d ; patchIt $d ../$2 ; fi ;
  done
}

patchIt $1 $2
rm -rf index.temp.ts



#eof