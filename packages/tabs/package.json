{
  "name": "react-navigation-tabs",
  "version": "2.7.0",
  "description": "Tab Navigation components for React Navigation",
  "main": "lib/commonjs/index.js",
  "module": "lib/module/index.js",
  "react-native": "lib/module/index.js",
  "types": "lib/typescript/src/index.d.ts",
  "files": [
    "src",
    "lib"
  ],
  "scripts": {
    "test": "jest",
    "typescript": "tsc --noEmit",
    "lint": "eslint --ext .js,.ts,.tsx .",
    "bootstrap": "yarn --cwd example && yarn",
    "example": "yarn --cwd example",
    "release": "yarn release-it",
    "prepare": "bob build"
  },
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  },
  "keywords": [
    "react-native-component",
    "react-component",
    "react-native",
    "ios",
    "android",
    "tab",
    "swipe",
    "scrollable",
    "coverflow"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/react-navigation/tabs.git"
  },
  "author": "Satyajit Sahoo <satyajit.happy@gmail.com> (https://github.com/satya164/)",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/react-navigation/tabs/issues"
  },
  "homepage": "https://github.com/react-navigation/tabs#readme",
  "dependencies": {
    "hoist-non-react-statics": "^3.3.0",
    "react-lifecycles-compat": "^3.0.4",
    "react-native-safe-area-view": "^0.14.6",
    "react-native-tab-view": "^2.11.0"
  },
  "devDependencies": {
    "@commitlint/config-conventional": "^7.5.0",
    "@expo/vector-icons": "^10.0.1",
    "@react-native-community/bob": "^0.6.1",
    "@types/hoist-non-react-statics": "^3.3.1",
    "@types/react": "^16.8.17",
    "@types/react-native": "^0.57.57",
    "babel-jest": "^24.5.0",
    "commitlint": "^7.5.2",
    "conventional-changelog-cli": "^2.0.12",
    "enzyme": "3.9.0",
    "enzyme-adapter-react-16": "^1.11.2",
    "enzyme-to-json": "^3.2.2",
    "eslint": "^6.5.1",
    "eslint-config-satya164": "^3.1.2",
    "eslint-plugin-react-native-globals": "^0.1.0",
    "flow-bin": "~0.78.0",
    "husky": "^1.3.1",
    "jest": "^24.5.0",
    "prettier": "^1.18.2",
    "react": "16.5.0",
    "react-dom": "16.5.0",
    "react-native": "~0.57.1",
    "react-native-gesture-handler": "^1.4.1",
    "react-native-reanimated": "^1.2.0",
    "react-navigation": "^4.0.7",
    "react-test-renderer": "16.5.0",
    "release-it": "^10.3.1",
    "typescript": "^3.5.2"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "react-native-gesture-handler": "^1.0.0",
    "react-native-reanimated": "^1.0.0-alpha",
    "react-native-screens": "^1.0.0 || ^1.0.0-alpha",
    "react-navigation": "^4.0.7"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "yarn lint && yarn flow check"
    }
  },
  "jest": {
    "preset": "react-native",
    "setupFiles": [
      "<rootDir>/__setup__/enzyme.js"
    ],
    "modulePathIgnorePatterns": [
      "<rootDir>/example/node_modules",
      "<rootDir>/lib/"
    ],
    "snapshotSerializers": [
      "enzyme-to-json/serializer"
    ]
  },
  "@react-native-community/bob": {
    "source": "src",
    "output": "lib",
    "targets": [
      "commonjs",
      "module",
      "typescript"
    ]
  }
}
