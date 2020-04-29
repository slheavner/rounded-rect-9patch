const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs-extra");
const path = require("path");
const template = require("./template");

function createContent(config) {
  const {
    radius,
    extraRadius,
    stretchWidth,
    paddingWidth,
    paddingHeight,
    paddingX,
    paddingY,
    borderWidth,
  } = config;

  const width =
    radius * extraRadius * 2 + margin * 2 + stretchWidth + borderWidth * 2;
  const stretchMargin = width / 2 - 1;
  const marginWidth = width / 2 - stretchWidth / 2;
  const rectWidth = width - margin * 2 - borderWidth * 2;
  const topMargin = marginWidth - 1;
  const paddingLeftMargin = paddingX + 1;
  const paddingTopMargin = paddingY + 1;
  return {
    ...config,
    width,
    stretchMargin,
    marginWidth,
    rectWidth,
    topMargin,
    paddingLeftMargin,
    paddingTopMargin,
  };
}

function createImage(config, output) {
  nodeHtmlToImage({
    output,
    content: createContent(config),
    html: template,
    transparent: true,
  }).then(() =>
    console.log(`Created ${config.radius}px rounded rectangle at ${output}`)
  );
}

const margin = 1;
const config = {
  radius: 5,
  extraRadius: 1,
  stretchWidth: 4,
  paddingHeight: 0,
  paddingWidth: 0,
  paddingY: 0,
  paddingX: 0,
  borderColor: "#FFFFFFFF",
  fillColor: "#FFFFFFFF",
  borderWidth: 2,
  res: "fhd",
  margin,
};

module.exports.generateImage = function (options, res, realRadius) {
  const theseOptions = {
    ...config,
    ...options,
  };
  const output = options.output
    .replace("{res}", res)
    .replace("{radius}", realRadius);
  fs.ensureDir(path.dirname(output));
  createImage(theseOptions, output);
};
