// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude react-native-maps from watchman if it exists
config.watchFolders = config.watchFolders || [];
config.resolver = {
  ...config.resolver,
  blockList: [
    // Block any react-native-maps references
    /.*\/node_modules\/\.react-native-maps.*/,
  ],
};

module.exports = config;

