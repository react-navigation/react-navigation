#pragma once

#include "ReactNavigationCornerInsetViewShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class ReactNavigationCornerInsetViewComponentDescriptor final
    : public ConcreteComponentDescriptor<ReactNavigationCornerInsetViewShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    auto &concreteShadowNode =
        static_cast<ReactNavigationCornerInsetViewShadowNode &>(shadowNode);
    concreteShadowNode.adjustLayoutWithState();

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook
