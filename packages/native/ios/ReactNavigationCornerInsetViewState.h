#pragma once

#include <react/renderer/graphics/Float.h>

namespace facebook {
namespace react {

class JSI_EXPORT ReactNavigationCornerInsetViewState final {
 public:
  using Shared = std::shared_ptr<const ReactNavigationCornerInsetViewState>;

  ReactNavigationCornerInsetViewState() = default;
  ReactNavigationCornerInsetViewState(Float value): cornerInset(value) {}

  Float cornerInset{0};
};

} // namespace react
} // namespace facebook
