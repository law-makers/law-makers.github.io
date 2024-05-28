#!/bin/bash

rm -rf public/
hugo --cleanDestinationDir --gc --minify -b "https://theden.github.io/thoughts.theden.sh/"

echo "run prettier"
prettier -w .

cpu_cores="$(nproc)"

echo "Minifying everything we can"
find ./public/ -type f \( \
  -name "*.html" \
  -o -name '*.js' \
  -o -name '*.css' \
  -o -name '*.svg' \
  -o -name "*.xml" \
  -o -name "*.json" \
  -o -name "*.html" \
  \) \
  -and ! -name "*.min*" -print0 |
  xargs -0 -n1 -P"${cpu_cores}" -I '{}' sh -c 'minify -o "{}" "{}"'

cp CNAME public/
