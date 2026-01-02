#pragma once

#include <react/renderer/components/ReactNavigationSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/components/view/ViewEventEmitter.h>

#include "ReactNavigationCornerAdaptivityViewState.h"

namespace facebook::react {

extern const char ReactNavigationCornerAdaptivityViewComponentName[];

class ReactNavigationCornerAdaptivityViewShadowNode final
: public ConcreteViewShadowNode<
ReactNavigationCornerAdaptivityViewComponentName,
ReactNavigationCornerAdaptivityViewProps,
ViewEventEmitter,
ReactNavigationCornerAdaptivityViewState> {
  using ConcreteViewShadowNode::ConcreteViewShadowNode;
  
public:
  void adjustLayoutWithState();
};

} // namespace facebook::react
