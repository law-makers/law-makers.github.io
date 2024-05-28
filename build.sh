#!/bin/bash

rm -rf public/
hugo --cleanDestinationDir --gc --minify -b "https://muhammad-zulfikar.github.io/blog/"

echo "run prettier"
prettier -w .

cpu_cores="$(nproc)"

cp CNAME public/
