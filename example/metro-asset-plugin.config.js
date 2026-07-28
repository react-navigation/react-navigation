module.exports = (asset) => {
  if (
    /[\\/]node_modules[\\/]/.test(asset.fileSystemLocation) &&
    asset.httpServerLocation.includes('?export_path=')
  ) {
    return {
      ...asset,
      httpServerLocation: '/assets?export_path=/assets/vendor',
    };
  }

  return asset;
};
