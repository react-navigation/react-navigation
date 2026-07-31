// swift-tools-version: 6.0

import PackageDescription

let package = Package(
  name: "ReactNavigation",
  platforms: [.iOS(.v15)],
  products: [
    .library(name: "ReactNavigation", targets: ["ReactNavigation"]),
  ],
  dependencies: [
    .package(name: "ReactNative", path: "../../../../xcframeworks"),
    .package(name: "React-GeneratedCode", path: "../../../ios"),
  ],
  targets: [
    .target(
      name: "ReactNavigationSwift",
      path: "swift"
    ),
    .target(
      name: "ReactNavigationSwiftBridge",
      dependencies: ["ReactNavigationSwift"],
      path: "spm",
      publicHeadersPath: "include"
    ),
    .target(
      name: "ReactNavigation",
      dependencies: [
        "ReactNavigationSwiftBridge",
        .product(name: "ReactHeaders", package: "ReactNative"),
        .product(name: "ReactNativeHeaders", package: "ReactNative"),
        .product(
          name: "ReactNativeDependenciesHeaders",
          package: "ReactNative"
        ),
        .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
      ],
      path: "objc",
      publicHeadersPath: "include",
      cxxSettings: [
        .define("DEBUG", .when(configuration: .debug)),
        .define("NDEBUG", .when(configuration: .release)),
      ],
      linkerSettings: [
        .linkedFramework("UIKit"),
        .linkedFramework("Foundation"),
        .linkedFramework("CoreGraphics"),
        .linkedFramework("QuartzCore"),
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
