# Rounded Rect 9patch
Simple tool to generate 9patches for rounded rectangle, created for Roku development

# Usage 
```
rounded-rect-9patch --help

    Usage: rounded-rect RADIUS... [options]

    RADIUS:             list of radius values

    Options:        default     desc

    --extraRadius   1           space between the corner and stretch line
    --stretchWidth  4           width of black stretch lines (left, top)
    --borderColor   white       hex color of border, alpha optional (#AABBCCDD)
    --fillColor     white       hex color of fill, alpha optional (#AABBCCDD)
    --borderWidth   2           width of border, mostly for border-only rectangles where it needs to be > radius
    --paddingHeight 0           height of "height" padding block (right)
    --paddingWidth  0           width of "length" padding block (bottom)
    --paddingX      0           offset of "length" padding block
    --paddingY      0           offset of "height" padding block
    --res           fhd         base resolution name (fhd, hd) of radius
    --fhd           fhd         value to use for fhd resolution name
    --hd            fhd         value to use for hd resolution name
    --output        rounded-rectangle-{res}-{radius}px.9.png
                                filename template, must include {res} and {radius} if noScale=true
    --noScale       false       if true, ignore res option, create a single image
```

## Suggested usage
- leave `--borderColor` and `--fillColor` as white and use the `Poster` field  `blendColor` when you can
- leave `--res` to your main ui resolution and set `--fhd` and `--hd` to your corresponding values in your manifest field `uri_resolution_autosub`
  - fhd is a 1.5 scale of hd, only the radius changes
- make sure your `RADIUS` values are divisible by 2/3 if `--res=fhd`
- make sure to wrap colors in quotes from the command line, like `--borderColor '#AABBCC'`
- if you want only a border and no fille, set `--fillColor` to be transparent and make sure `RADIUS < --borderWidth`

## Make a simple rectangle with 10px radius to file image.9.png
`rounded-rect-9patch 10 --noScale --output image`

## Make a simple rectangle with 6px, 9px, and 15px radius, but scale to image-fhd-{radius}px.9.png and image-hd-{radius}px.9.png
`rounded-rect-9patch 6 9 15 --output image-{res}-{radius}px.9.png`

## Developement

```bash
git clone <Repo Link>
cd rounded-rect-9patch
npm install

npx rounded-rect-9patch 15 --noScale  --output buttonBg
``` 