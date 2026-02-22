#include "ReactNavigationCornerInsetViewShadowNode.h"

#include <react/renderer/core/LayoutContext.h>
#include <yoga/Yoga.h>

namespace facebook {
namespace react {

using namespace yoga;

extern const char ReactNavigationCornerInsetViewComponentName[] =
    "ReactNavigationCornerInsetView";

void ReactNavigationCornerInsetViewShadowNode::adjustLayoutWithState() {
  ensureUnsealed();

  const auto &props = getConcreteProps();
  auto state =
      std::static_pointer_cast<const ReactNavigationCornerInsetViewShadowNode::ConcreteState>(
          getState());
  auto stateData = state->getData();

  Float cornerInset = stateData.cornerInset;

  Dimension dimension = props.edge == ReactNavigationCornerInsetViewEdge::Left ||
                        props.edge == ReactNavigationCornerInsetViewEdge::Right
      ? Dimension::Width
      : Dimension::Height;

  auto newLength = StyleSizeLength::points(cornerInset);
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
