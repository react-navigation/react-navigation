#include "ReactNavigationLayoutInsetViewShadowNode.h"

#include <react/renderer/core/LayoutContext.h>
#include <yoga/Yoga.h>

namespace facebook {
namespace react {

using namespace yoga;

extern const char ReactNavigationLayoutInsetViewComponentName[] =
    "ReactNavigationLayoutInsetView";

void ReactNavigationLayoutInsetViewShadowNode::adjustLayoutWithState() {
  ensureUnsealed();

  const auto &props = getConcreteProps();
  auto state =
      std::static_pointer_cast<const ReactNavigationLayoutInsetViewShadowNode::ConcreteState>(
          getState());
  auto stateData = state->getData();

  Float inset = stateData.inset;

  Dimension dimension = props.edge == ReactNavigationLayoutInsetViewEdge::Left ||
                        props.edge == ReactNavigationLayoutInsetViewEdge::Right
      ? Dimension::Width
      : Dimension::Height;

  auto newLength = StyleSizeLength::points(inset);
  auto currentLength = yogaNode_.style().dimension(dimension);

  if (currentLength != newLength) {
    yoga::Style style = yogaNode_.style();
    style.setDimension(dimension, newLength);
    yogaNode_.setStyle(style);
    yogaNode_.setDirty(true);
  }
}

} // namespace react
} // namespace facebook
