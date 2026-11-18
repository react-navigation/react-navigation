#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTConversions.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTViewComponentView.h>

#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/view/ConcreteViewShadowNode.h>
#import <react/renderer/core/ConcreteComponentDescriptor.h>

namespace facebook::react {

namespace {

constexpr char LayoutRegionViewComponentName[] = "ReactNavigationLayoutRegionView";

struct LayoutRegionState {
  Float top{0};
  Float bottom{0};
  Float start{0};
  Float end{0};
  bool isRTL{false};

  bool operator==(const LayoutRegionState &) const = default;
};

yoga::Style::Length firstDefined(std::initializer_list<yoga::Style::Length> lengths) {
  for (const auto &length : lengths) {
    if (length.isDefined()) {
      return length;
    }
  }

  return yoga::StyleLength::undefined();
}

class LayoutRegionShadowNode final : public ConcreteViewShadowNode<
                                         LayoutRegionViewComponentName,
                                         ReactNavigationLayoutRegionViewProps,
                                         ReactNavigationLayoutRegionViewEventEmitter,
                                         LayoutRegionState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  void adjustLayoutWithState() {
    ensureUnsealed();

    const auto &props = getConcreteProps();
    const auto &style = props.yogaStyle;
    const auto &state = getStateData();

    yoga::Style newStyle = yogaNode_.style();

    newStyle.setPadding(yoga::Edge::Top, firstDefined({style.padding(yoga::Edge::Top), props.paddingBlockStart}));
    newStyle.setPadding(yoga::Edge::Bottom, firstDefined({style.padding(yoga::Edge::Bottom), props.paddingBlockEnd}));
    newStyle.setPadding(yoga::Edge::Start, firstDefined({props.paddingInlineStart, style.padding(yoga::Edge::Start)}));
    newStyle.setPadding(yoga::Edge::End, firstDefined({props.paddingInlineEnd, style.padding(yoga::Edge::End)}));
    newStyle.setPadding(yoga::Edge::Left, style.padding(yoga::Edge::Left));
    newStyle.setPadding(yoga::Edge::Right, style.padding(yoga::Edge::Right));

    RCTI18nUtil *i18nUtil = [RCTI18nUtil sharedInstance];

    if ([i18nUtil isRTL] && [i18nUtil doLeftAndRightSwapInRTL]) {
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

    if (newStyle != yogaNode_.style()) {
      yogaNode_.setStyle(newStyle);
      yogaNode_.setDirty(true);
    }
  }
};

class LayoutRegionComponentDescriptor final : public ConcreteComponentDescriptor<LayoutRegionShadowNode> {
  using ConcreteComponentDescriptor::ConcreteComponentDescriptor;

  void adopt(ShadowNode &shadowNode) const override {
    static_cast<LayoutRegionShadowNode &>(shadowNode).adjustLayoutWithState();

    ConcreteComponentDescriptor::adopt(shadowNode);
  }
};

} // namespace

} // namespace facebook::react

using namespace facebook::react;

@interface ReactNavigationLayoutRegionView : RCTViewComponentView <ReactNavigationLayoutRegionViewImplDelegate, RCTMountingTransactionObserving>
@end

@implementation ReactNavigationLayoutRegionView {
  ReactNavigationLayoutRegionViewImpl * _impl;
  LayoutRegionShadowNode::ConcreteState::Shared _state;
  std::optional<LayoutRegionState> _measuredState;
  std::optional<LayoutRegionState> _sentState;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<LayoutRegionComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // FIXME:
    // In debug builds, we get a crash in RCTViewComponentView if `_props` is still a plain `ViewProps` on the first update
    // So we start with the default props of our own props type
    static const auto defaultProps = std::make_shared<const ReactNavigationLayoutRegionViewProps>();

    _props = defaultProps;

    _impl = [[ReactNavigationLayoutRegionViewImpl alloc] initWithView:self];
  }

  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  [_impl didMoveToWindow];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<ReactNavigationLayoutRegionViewProps const>(props);

    [_impl setPropsWithRegion:RCTNSStringFromString(toString(newProps.region))
             cornerAdaptation:RCTNSStringFromString(toString(newProps.cornerAdaptation))
         cornerAdaptationOnly:newProps.cornerAdaptationOnly
                       onEdge:RCTNSStringFromString(toString(newProps.onEdge))
                       extent:newProps.extent];

    [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
    _state = std::static_pointer_cast<LayoutRegionShadowNode::ConcreteState const>(state);
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];

    _measuredState.reset();
    _sentState.reset();
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    [_impl updateMeasurement];

    [self sendInsetsChangeIfNeeded];
}

- (UIViewLayoutRegion *)barLayoutRegionOnEdge:(NSDirectionalRectEdge)edge extent:(CGFloat)extent API_AVAILABLE(ios(26.0))
{
#if __IPHONE_OS_VERSION_MAX_ALLOWED >= 270100
    if (@available(iOS 27.1, *)) {
        return [UIViewLayoutRegion layoutRegionForBarOnDirectionalEdge:edge extent:extent];
    }
#endif

    return nil;
}

- (void)updateInsetsWithTop:(CGFloat)top bottom:(CGFloat)bottom start:(CGFloat)start end:(CGFloat)end isRTL:(BOOL)isRTL
{
    LayoutRegionState state = {top, bottom, start, end, static_cast<bool>(isRTL)};

    _measuredState = state;

    if (state != _state->getData()) {
        // We commit the insets immediately, so they're applied in the same frame
        _state->updateState(std::move(state), EventQueue::UpdateMode::unstable_Immediate);
    }

    [self sendInsetsChangeIfNeeded];
}

- (void)sendInsetsChangeIfNeeded
{
    const auto &props = static_cast<const ReactNavigationLayoutRegionViewProps &>(*_props);

    if (!props.hasInsetsChangeListener) {
        _sentState.reset();

        return;
    }

    if (_eventEmitter == nullptr || _sentState == _measuredState) {
        return;
    }

    _sentState = _measuredState;

    const auto &state = *_measuredState;

    auto eventEmitter = std::static_pointer_cast<const ReactNavigationLayoutRegionViewEventEmitter>(_eventEmitter);

    eventEmitter->experimental_flushSync([&]() {
        eventEmitter->onInsetsChange({
            .insets = {.top = state.top, .bottom = state.bottom, .start = state.start, .end = state.end},
        });
    });
}

@end
