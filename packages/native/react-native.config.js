module.exports = {
  dependency: {
    platforms: {
      android: {
        // FIXME: Autolinking skips specs with `interfaceOnly: true`, which we need for a custom shadow node
        // So we list all the descriptors, since setting the list replaces the ones found by autolinking
        componentDescriptors: [
          'ReactNavigationMaterialSymbolViewComponentDescriptor',
          'ReactNavigationOverlayInsetsProviderComponentDescriptor',
          'ReactNavigationWindowInsetsViewComponentDescriptor',
        ],
        cmakeListsPath: 'src/main/jni/CMakeLists.txt',
      },
    },
  },
};
