#pragma once

#include <react/renderer/core/ConcreteComponentDescriptor.h>

#include "ReactNavigationCornerAdaptivityViewShadowNode.h"

namespace facebook::react {

class ReactNavigationCornerAdaptivityViewComponentDescriptor final
: public ConcreteComponentDescriptor<ReactNavigationCornerAdaptivityViewShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;
  
  void adopt(ShadowNode &shadowNode) const override
  {
    auto &concreteShadowNode =
    static_cast<ReactNavigationCornerAdaptivityViewShadowNode &>(shadowNode);
    concreteShadowNode.adjustLayoutWithState();
    
    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace facebook::react
