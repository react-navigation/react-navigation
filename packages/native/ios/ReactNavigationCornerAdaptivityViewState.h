#pragma once

#include <react/renderer/graphics/RectangleEdges.h>

namespace facebook::react {

class ReactNavigationCornerAdaptivityViewState final {
public:
  using Shared = std::shared_ptr<const ReactNavigationCornerAdaptivityViewState>;
  
  ReactNavigationCornerAdaptivityViewState() = default;
  
  EdgeInsets cornerInsets{};
};

} // namespace facebook::react
