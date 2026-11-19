#pragma once

#include <ReactCommon/JavaTurboModule.h>
#include <folly/dynamic.h>
#include <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#include <react/renderer/components/ReactNavigationSpec/Props.h>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>
#include <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

extern const char ReactNavigationWindowInsetsViewComponentName[];

struct WindowInsetsState {
  Float top{0};
  Float bottom{0};
  Float start{0};
  Float end{0};
  bool isRTL{false};
  bool swapLeftAndRight{false};

  WindowInsetsState() = default;
  WindowInsetsState(const WindowInsetsState &previousState, folly::dynamic data);

  folly::dynamic getDynamic() const;
};

class ReactNavigationWindowInsetsViewShadowNode final : public ConcreteViewShadowNode<
                                                          ReactNavigationWindowInsetsViewComponentName,
                                                          ReactNavigationWindowInsetsViewProps,
                                                          ReactNavigationWindowInsetsViewEventEmitter,
                                                          WindowInsetsState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  void adjustLayoutWithState();
};

class ReactNavigationWindowInsetsViewComponentDescriptor final : public ConcreteComponentDescriptor<ReactNavigationWindowInsetsViewShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    static_cast<ReactNavigationWindowInsetsViewShadowNode &>(shadowNode).adjustLayoutWithState();

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

JSI_EXPORT
std::shared_ptr<TurboModule> ReactNavigationSpec_ModuleProvider(const std::string &moduleName, const JavaTurboModule::InitParams &params);

}
