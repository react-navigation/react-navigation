// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "ReactNavigation",
  platforms: [.iOS(.v15)],
  products: [
    .library(name: "ReactNavigation", targets: ["ReactNavigation"]),
  ],
  // SwiftPM resolves these paths relative to the symlink that React Native's
  // autolinking creates at `build/generated/autolinking/libs/ReactNavigation`
  // in the app, not relative to this file's location in `node_modules`.
  dependencies: [
    .package(name: "ReactNative", path: "../../../../xcframeworks"),
    .package(name: "React-GeneratedCode", path: "../../../ios"),
  ],
  targets: [
    .target(
      name: "ReactNavigationSwift",
      path: ".",
      sources: [
        "ReactNavigationCornerInsetView.swift",
        "ReactNavigationSFSymbolView.swift",
      ]
    ),
    .target(
      name: "ReactNavigation",
      dependencies: [
        "ReactNavigationSwift",
        .product(name: "ReactHeaders", package: "ReactNative"),
        .product(name: "ReactNativeHeaders", package: "ReactNative"),
        .product(
          name: "ReactNativeDependenciesHeaders",
          package: "ReactNative"
        ),
        .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
      ],
      path: ".",
      exclude: [
        "Package.swift",
        "ReactNavigationCornerInsetView.swift",
        "ReactNavigationSFSymbolView.swift",
      ],
      cxxSettings: [
        .define("DEBUG", .when(configuration: .debug)),
        .define("NDEBUG", .when(configuration: .release)),
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
