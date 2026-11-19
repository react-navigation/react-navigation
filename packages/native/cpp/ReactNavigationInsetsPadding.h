#pragma once

#include <algorithm>
#include <initializer_list>
#include <utility>
#include <react/renderer/graphics/Float.h>
#include <yoga/node/Node.h>

namespace facebook::react {

template <typename Props, typename State>
void applyInsetsPadding(yoga::Node &node, const Props &props, const State &state, bool swapLeftAndRight) {
  const auto &style = props.yogaStyle;

  auto firstDefined = [](std::initializer_list<yoga::Style::Length> lengths) {
    for (const auto &length : lengths) {
      if (length.isDefined()) {
        return length;
      }
    }

    return yoga::StyleLength::undefined();
  };

  yoga::Style newStyle = node.style();

  newStyle.setPadding(yoga::Edge::Top, firstDefined({style.padding(yoga::Edge::Top), props.paddingBlockStart}));
  newStyle.setPadding(yoga::Edge::Bottom, firstDefined({style.padding(yoga::Edge::Bottom), props.paddingBlockEnd}));
  newStyle.setPadding(yoga::Edge::Start, firstDefined({props.paddingInlineStart, style.padding(yoga::Edge::Start)}));
  newStyle.setPadding(yoga::Edge::End, firstDefined({props.paddingInlineEnd, style.padding(yoga::Edge::End)}));
  newStyle.setPadding(yoga::Edge::Left, style.padding(yoga::Edge::Left));
  newStyle.setPadding(yoga::Edge::Right, style.padding(yoga::Edge::Right));

  if (swapLeftAndRight) {
    for (const auto &[side, edge] : {std::pair{yoga::Edge::Left, yoga::Edge::Start}, std::pair{yoga::Edge::Right, yoga::Edge::End}}) {
      if (newStyle.padding(side).isDefined()) {
        newStyle.setPadding(edge, newStyle.padding(side));
        newStyle.setPadding(side, yoga::StyleLength::undefined());
      }
    }
  }

  auto applyInset = [&](yoga::Edge edge, auto mode, Float inset, std::initializer_list<yoga::Style::Length> paddings) {
    using Mode = decltype(mode);

    if (mode == Mode::Off || inset == 0) {
      return;
    }

    auto padding = firstDefined(paddings);

    // We can't combine percentages with the inset before layout, so we treat them as 0
    Float value = padding.isPoints() ? padding.value().unwrap() : 0;

    newStyle.setPadding(edge, yoga::StyleLength::points(mode == Mode::Maximum ? std::max(value, inset) : value + inset));
  };

  auto startSide = state.isRTL ? yoga::Edge::Right : yoga::Edge::Left;
  auto endSide = state.isRTL ? yoga::Edge::Left : yoga::Edge::Right;

  auto vertical = newStyle.padding(yoga::Edge::Vertical);
  auto horizontal = newStyle.padding(yoga::Edge::Horizontal);
  auto all = newStyle.padding(yoga::Edge::All);

  applyInset(yoga::Edge::Top, props.edges.top, state.top, {newStyle.padding(yoga::Edge::Top), vertical, all});
  applyInset(yoga::Edge::Bottom, props.edges.bottom, state.bottom, {newStyle.padding(yoga::Edge::Bottom), vertical, all});
  applyInset(yoga::Edge::Start, props.edges.start, state.start, {newStyle.padding(yoga::Edge::Start), newStyle.padding(startSide), horizontal, all});
  applyInset(yoga::Edge::End, props.edges.end, state.end, {newStyle.padding(yoga::Edge::End), newStyle.padding(endSide), horizontal, all});

  if (newStyle != node.style()) {
    node.setStyle(newStyle);
    node.setDirty(true);
  }
}

}
