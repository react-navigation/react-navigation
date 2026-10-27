#pragma once

#include <react/renderer/graphics/Float.h>

namespace facebook {
namespace react {

class JSI_EXPORT ReactNavigationLayoutInsetViewState final {
 public:
  using Shared = std::shared_ptr<const ReactNavigationLayoutInsetViewState>;

  ReactNavigationLayoutInsetViewState() = default;
  ReactNavigationLayoutInsetViewState(Float value): inset(value) {}

  Float inset{0};
};

} // namespace react
} // namespace facebook
