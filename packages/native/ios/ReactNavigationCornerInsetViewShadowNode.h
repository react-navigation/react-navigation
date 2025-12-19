#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#include <react/renderer/components/ReactNavigationSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "ReactNavigationCornerInsetViewState.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char ReactNavigationCornerInsetViewComponentName[];

class JSI_EXPORT ReactNavigationCornerInsetViewShadowNode final
    : public ConcreteViewShadowNode<
          ReactNavigationCornerInsetViewComponentName,
          ReactNavigationCornerInsetViewProps,
          ViewEventEmitter,
          ReactNavigationCornerInsetViewState> {
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

 public:
  void adjustLayoutWithState();
};

} // namespace react
} // namespace facebook
