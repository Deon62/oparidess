const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

let svgTransformerPath;
try {
  svgTransformerPath = require.resolve('react-native-svg-transformer');
} catch (e) {
  svgTransformerPath = undefined;
}

if (svgTransformerPath) {
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: svgTransformerPath,
  };

  config.resolver = {
    ...config.resolver,
    assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...config.resolver.sourceExts, 'svg'],
  };
}

module.exports = config;
