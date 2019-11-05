# Scope

add a release-notes patch to the release-notes of Livingdocs.

Even when it's public, this is a higly individual repository and is useless for others to use.

# Example

### via CLI


```bash
# tag = tag of the patch
# sha = sha of the patch
npx github:DaRaFF/release-notes-patch \
  --token='gh-token' \
  --owner=livingdocsIO \
  --repo=livingdocs-server \
  --sha=29d528db124df6e4fce1b4f9f4232e17d8776ccd \
  --tag=v75.15.5
```
