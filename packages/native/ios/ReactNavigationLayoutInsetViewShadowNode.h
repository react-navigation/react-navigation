#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#include <react/renderer/components/ReactNavigationSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include "ReactNavigationLayoutInsetViewState.h"

namespace facebook {
namespace react {

JSI_EXPORT extern const char ReactNavigationLayoutInsetViewComponentName[];

class JSI_EXPORT ReactNavigationLayoutInsetViewShadowNode final
    : public ConcreteViewShadowNode<
          ReactNavigationLayoutInsetViewComponentName,
          ReactNavigationLayoutInsetViewProps,
          ViewEventEmitter,
          ReactNavigationLayoutInsetViewState> {
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

 public:
  void adjustLayoutWithState();
};

} // namespace react
} // namespace facebook
