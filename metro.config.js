const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure SVG transformer
let svgTransformerPath;
try {
  svgTransformerPath = require.resolve('react-native-svg-transformer');
} catch (e) {
  // SVG transformer not found - this should not happen if package is installed
  console.warn('react-native-svg-transformer not found');
}

if (svgTransformerPath) {
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: svgTransformerPath,
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };
}

module.exports = config;
