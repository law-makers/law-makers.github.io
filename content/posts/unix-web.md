---
title: "Unix philosophy-esque approach to web tooling"
date: "2021-06-05"
Description: "Unix philosophy + frontend"
draft: false
---

[Ongoing. I'll be adding for snippets to this page that I find useful over time [Suggestions are also welcome](https://github.com/TheDen/thoughts.theden.sh)]

# Creating WebP images

If you want to recursively create `.webp` versions of images in a folder (same name, saved in same location, different extension name), this script will do that

```bash
while IFS= read -r -d '' file; do
  cwebp -q 90 "$file" -o "${file%.*}.webp" || true
done < <(find ./ -type f \( -name "*.png" -o -name "*.jpg" \) -print0)
```

Some notes:

- The `cwebp` binary from [libwebp](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html) is required.
- The `-q 90` flag is the quality factor.
- The snippet assumes that image files are either `.jpg` or `.png`.

# Deployment

Assuming you want `dist/` to be the deployed folder

```bash
rsync -av . dist/ --exclude dist/ --exclude .git/ --exclude .gitignore
```

and to push the folder as a specific git branch, for example to deploy it on GitHub pages

```bash
git subtree push --prefix dist origin gh-pages
```

# Minification

Using the [minify](https://github.com/tdewolff/minify) cli tool, this example snippet will minify any assets in the `dist/` folder. Files that contain `.min` will be excluded

```bash
find ./dist/ -type f \( \
  -name "*.html" \
  -o -name '*.js' \
  -o -name '*.css' \
  -o -name '*.svg' \
  -o -name "*.xml" \
  -o -name "*.json" \
  -o -name "*.htm" \
  \) \
  -and ! -name "*.min*" -print0 |
  xargs -0 -n1 -P4 -I '{}' sh -c 'minify -o "{}" "{}"'
```
