module.exports = function(api) {
  api.cache(true);
  const isProduction = api.env('production');
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove console.log in production (optional - Metro minifier also does this)
      ...(isProduction ? [] : [])
    ]
  };
};

