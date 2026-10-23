#pragma once

#include "ReactNavigationLayoutInsetViewShadowNode.h"
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook {
namespace react {

class ReactNavigationLayoutInsetViewComponentDescriptor final
    : public ConcreteComponentDescriptor<ReactNavigationLayoutInsetViewShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    auto &concreteShadowNode =
        static_cast<ReactNavigationLayoutInsetViewShadowNode &>(shadowNode);
    concreteShadowNode.adjustLayoutWithState();

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace react
} // namespace facebook
