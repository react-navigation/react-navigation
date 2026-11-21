#pragma once

#include "ReactNavigationInsetsPadding.h"
#include <string_view>
#include <react/renderer/components/view/ConcreteViewShadowNode.h>

namespace facebook::react {

inline const yoga::Node *findScrollContent(const yoga::Node &node, Tag tag, std::vector<size_t> &path) {
  for (size_t i = 0; i < node.getChildCount(); i++) {
    auto child = node.getChild(i);
    auto shadow = static_cast<const YogaLayoutableShadowNode *>(child->getContext());
    path.push_back(i);

    if (std::string_view(shadow->getComponentName()) == "ScrollView") {
      for (size_t j = 0; j < child->getChildCount(); j++) {
        auto content = child->getChild(j);
        if (static_cast<const YogaLayoutableShadowNode *>(content->getContext())->getTag() == tag) {
          path.push_back(j);
          return content;
        }
      }
    } else if (auto found = findScrollContent(*child, tag, path)) {
      return found;
    }

    path.pop_back();
  }

  return nullptr;
}

template <typename Edges, typename State>
void applyScrollContentPadding(yoga::Node &root, const Edges &edges, const State &state, bool swapLeftAndRight) {
  if (state.contentTag == 0) {
    return;
  }

  std::vector<size_t> path;
  auto content = findScrollContent(root, state.contentTag, path);
  if (!content) {
    return;
  }

  auto shadow = static_cast<const YogaLayoutableShadowNode *>(content->getContext());
  const auto &contentProps = static_cast<const ViewProps &>(*shadow->getProps());
  auto insets = state;
  auto direction = contentProps.yogaStyle.direction();
  if (direction != yoga::Direction::Inherit && (direction == yoga::Direction::RTL) != state.isRTL) {
    insets.isRTL = !state.isRTL;
    std::swap(insets.start, insets.end);
  }

  auto style = resolveInsetsPadding(*content, contentProps, edges, insets, swapLeftAndRight);

  // FIXME: ScrollContentView rebuilds its Yoga style when Fabric clones it.
  // Own its path before layout even when the current padding already matches.
  if (style == content->style() && std::string_view(shadow->getComponentName()) != "ScrollContentView") {
    return;
  }

  // Fabric shares children between revisions. Its Yoga clone callback replaces both
  // the Yoga child and the corresponding shadow child in the new revision.
  auto node = &root;
  for (auto index : path) {
    auto child = node->getChild(index);
    if (child->getOwner() != node) {
      node->getConfig()->cloneNode(child, node, index);
    }
    node = node->getChild(index);
  }
  if (node->style() != style) {
    node->setStyle(style);
    while (node != &root) {
      node->setDirty(true);
      node = node->getOwner();
    }
    root.setDirty(true);
  }
}

template <typename Edges, typename State>
void applyScrollInsets(yoga::Node &root, const Edges &edges, const State &state, bool swapLeftAndRight) {
  if (state.previousContentTag != 0) {
    State previous{};
    previous.contentTag = state.previousContentTag;
    previous.isRTL = state.isRTL;
    applyScrollContentPadding(root, edges, previous, swapLeftAndRight);
  }
  applyScrollContentPadding(root, edges, state, swapLeftAndRight);
}

}
