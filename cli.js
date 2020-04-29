#!/usr/bin/env node
const minimist = require("minimist");
const index = require("./index");
const package = require("./package.json");

const help = `
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
    --res           fhd         base resolution name (fhd, hd) of radius. The other image will scale in the opposite direction.
    --fhd           fhd         value to use for fhd resolution name
    --hd            fhd         value to use for hd resolution name
    --output        rounded-rectangle-{res}-{radius}px.9.png
                                filename template, must include {res} and {radius} if noScale=true
    --noScale       false       if true, ignore res option, create a single image
`;
let unknowns = false;
const options = minimist(process.argv.slice(2), {
  default: {
    noScale: false,
    output: "rounded-rectangle-{res}-{radius}px.9.png",
    res: "fhd",
    fhd: "fhd",
    hd: "hd",
  },
  string: [
    "extraRadius",
    "stretchWidth",
    "borderColor",
    "fillColor",
    "borderWidth",
    "res",
    "paddingHeight",
    "paddingWidth",
    "paddingX",
    "paddingY",
    "output",
    "fhd",
    "hd",
  ],
  boolean: ["noScale", "version"],
  alias: {
    version: "v",
  },
  unknown: (p) => {
    if (isNaN(p)) {
      if (p !== "-h" && p !== "--help") {
        console.error("Unknown option " + p);
      }
      unknowns = true;
    }
  },
});
if (options.v) {
  console.log("rounded-rect v" + package.version);
}

if (unknowns) {
  console.log(help);
  process.exit(1);
}

options.radius = options._;
if (options.res) {
  options.res = options.res.toLowerCase();
}

const validatorFunctions = {
  isNumber: (n) => {
    return !isNaN(n);
  },
  isFHDorHD: (res) => {
    return res === "fhd" || res === "hd";
  },
  isColor: (c) => {
    return /#[\da-zA-Z]{6}([\da-zA-Z]{2})?/.test(c);
  },
  isOutputPath: (path) => {
    return (
      options.noScale || (path.includes("{res}") && path.includes("{radius}"))
    );
  },
  isRadiusList: (arr) => {
    return arr.length > 0 && !arr.find((r) => isNaN(r));
  },
};
validatorFunctions.isNumber.message = "Is not a number";
validatorFunctions.isFHDorHD.message = 'Must be "fhd" or "hd" resolution';
validatorFunctions.isColor.message =
  "Must be a hex RGBA color #rrggbbaa (alpha optional)";
validatorFunctions.isOutputPath.message =
  "Must include template values {res} and {radius} if noScale=true";
validatorFunctions.isRadiusList.message = "Must include radius as a number";

const validators = {
  radius: "isNumber",
  extraRadius: "isNumber",
  stretchWidth: "isNumber",
  borderColor: "isColor",
  fillColor: "isColor",
  borderWidth: "isNumber",
  res: "isFHDorHD",
  paddingHeight: "isNumber",
  paddingWidth: "isNumber",
  paddingX: "isNumber",
  paddingY: "isNumber",
  output: "isOutputPath",
  radius: "isRadiusList",
};
const valid = [];
Object.keys(options)
  .filter((k) => !!validators[k])
  .forEach((o) => {
    valid.push({
      option: o,
      function: validatorFunctions[validators[o]],
      valid: validatorFunctions[validators[o]](options[o]),
    });
  });

let hasError = false;
valid.forEach((v) => {
  if (!v.valid) {
    console.error(
      `option ${v.option}: value "${options[v.option].toString()}" - ${
        v.function.message
      }`
    );
    hasError = true;
  }
});
if (hasError) {
  console.error(help);
  process.exit(1);
}

if (options.output && !options.output.endsWith(".9.png")) {
  options.output = options.output + ".9.png";
}

const numbers = [
  "extraRadius",
  "stretchWidth",
  "paddingHeight",
  "paddingWidth",
  "paddingY",
  "paddingX",
  "borderWidth",
];
numbers.forEach((key) => {
  if (options[key] !== undefined) {
    options[key] = Number.parseInt(options[key]);
  }
});
options.radius.forEach((r) => {
  index.generateImage({ ...options, radius: r }, options[options.res], r);
  if (!options.noScale) {
    if (options.res === "fhd") {
      index.generateImage({ ...options, radius: r * (2 / 3) }, options.hd, r);
    } else {
      index.generateImage({ ...options, radius: r * 1.5 }, options.fhd, r);
    }
  }
});
