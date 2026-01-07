#include "ReactNavigationCornerAdaptivityViewShadowNode.h"

#include <react/renderer/components/view/conversions.h>
#include <react/renderer/core/LayoutContext.h>
#include <yoga/Yoga.h>

namespace facebook::react {

using namespace yoga;

extern const char ReactNavigationCornerAdaptivityViewComponentName[] =
"ReactNavigationCornerAdaptivityView";

static inline Style::Length valueFromEdges(
                                           Style::Length edge,
                                           Style::Length axis,
                                           Style::Length defaultValue)
{
  if (edge.isDefined()) {
    return edge;
  }
  if (axis.isDefined()) {
    return axis;
  }
  return defaultValue;
}

void ReactNavigationCornerAdaptivityViewShadowNode::adjustLayoutWithState()
{
  ensureUnsealed();
  
  auto state =
  std::static_pointer_cast<const ReactNavigationCornerAdaptivityViewShadowNode::ConcreteState>(
                                                                                               getState());
  auto stateData = state->getData();
  
  auto defaultPadding = getConcreteProps().yogaStyle.padding(Edge::All);
  
  auto top = valueFromEdges(
                            getConcreteProps().yogaStyle.padding(Edge::Top),
                            getConcreteProps().yogaStyle.padding(Edge::Vertical),
                            defaultPadding);
  auto bottom = valueFromEdges(
                               getConcreteProps().yogaStyle.padding(Edge::Bottom),
                               getConcreteProps().yogaStyle.padding(Edge::Vertical),
                               defaultPadding);
  auto left = valueFromEdges(
                             getConcreteProps().yogaStyle.padding(Edge::Left),
                             getConcreteProps().yogaStyle.padding(Edge::Horizontal),
                             defaultPadding);
  auto right = valueFromEdges(
                              getConcreteProps().yogaStyle.padding(Edge::Right),
                              getConcreteProps().yogaStyle.padding(Edge::Horizontal),
                              defaultPadding);
  
  const auto direction = getConcreteProps().direction;
  
  if (direction == ReactNavigationCornerAdaptivityViewDirection::Vertical) {
    top = Style::Length::points(
                                top.value().unwrapOrDefault(0) + stateData.cornerInsets.top);
    bottom = Style::Length::points(
                                   bottom.value().unwrapOrDefault(0) + stateData.cornerInsets.bottom);
  } else {
    left = Style::Length::points(
                                 left.value().unwrapOrDefault(0) + stateData.cornerInsets.left);
    right = Style::Length::points(
                                  right.value().unwrapOrDefault(0) + stateData.cornerInsets.right);
  }
  
  auto adjustedStyle = getConcreteProps().yogaStyle;
  adjustedStyle.setPadding(Edge::Top, top);
  adjustedStyle.setPadding(Edge::Bottom, bottom);
  adjustedStyle.setPadding(Edge::Left, left);
  adjustedStyle.setPadding(Edge::Right, right);
  
  auto currentStyle = yogaNode_.style();
  
  if (adjustedStyle.padding(Edge::Top) != currentStyle.padding(Edge::Top) ||
      adjustedStyle.padding(Edge::Bottom) != currentStyle.padding(Edge::Bottom) ||
      adjustedStyle.padding(Edge::Left) != currentStyle.padding(Edge::Left) ||
      adjustedStyle.padding(Edge::Right) != currentStyle.padding(Edge::Right)) {
    yogaNode_.setStyle(adjustedStyle);
    yogaNode_.setDirty(true);
  }
}

} // namespace facebook::react
