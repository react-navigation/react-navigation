#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#include "../cpp/ReactNavigationInsetsPadding.h"

#import <React/RCTComponentEvent.h>
#import <React/RCTConstants.h>
#import <React/RCTConversions.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTViewComponentView.h>

#import <react/featureflags/ReactNativeFeatureFlags.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/view/ConcreteViewShadowNode.h>
#import <react/renderer/core/ConcreteComponentDescriptor.h>
#import <react/utils/FollyConvert.h>

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

class LayoutRegionShadowNode final : public ConcreteViewShadowNode<
                                         LayoutRegionViewComponentName,
                                         ReactNavigationLayoutRegionViewProps,
                                         ReactNavigationLayoutRegionViewEventEmitter,
                                         LayoutRegionState> {
 public:
  using ConcreteViewShadowNode::ConcreteViewShadowNode;

  void adjustLayoutWithState() {
    ensureUnsealed();

    RCTI18nUtil *i18nUtil = [RCTI18nUtil sharedInstance];

    applyInsetsPadding(yogaNode_, getConcreteProps(), getStateData(), [i18nUtil isRTL] && [i18nUtil doLeftAndRightSwapInRTL]);
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
  std::optional<LayoutRegionState> _committedState;
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
                       onEdge:RCTNSStringFromString(toString(newProps.onEdge))
                       extent:newProps.extent];

    [super updateProps:props oldProps:oldProps];

    [self commitInsetsIfNeeded];
}

- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
    _state = std::static_pointer_cast<LayoutRegionShadowNode::ConcreteState const>(state);

    if (!oldState || state->getRevision() == State::initialRevisionValue) {
        _committedState = _state->getData();
    }
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];

    _measuredState.reset();
    _committedState.reset();
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

    [self commitInsetsIfNeeded];

    [self sendInsetsChangeIfNeeded];
}

- (void)commitInsetsIfNeeded
{
    if (!_measuredState.has_value()) {
        return;
    }

    const auto &edges = static_cast<const ReactNavigationLayoutRegionViewProps &>(*_props).edges;

    if (edges.top == decltype(edges.top)::Off && edges.bottom == decltype(edges.bottom)::Off &&
        edges.start == decltype(edges.start)::Off && edges.end == decltype(edges.end)::Off) {
        return;
    }

    auto state = *_measuredState;

    state.top = edges.top != decltype(edges.top)::Off ? state.top : 0;
    state.bottom = edges.bottom != decltype(edges.bottom)::Off ? state.bottom : 0;
    state.start = edges.start != decltype(edges.start)::Off ? state.start : 0;
    state.end = edges.end != decltype(edges.end)::Off ? state.end : 0;

    if (_committedState != state) {
        _committedState = state;

        // We commit the insets immediately, so they're applied in the same frame
        _state->updateState(std::move(state), EventQueue::UpdateMode::unstable_Immediate);
    }
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

    folly::dynamic payload = folly::dynamic::object
        ("insets", folly::dynamic::object
            ("top", state.top)
            ("bottom", state.bottom)
            ("start", state.start)
            ("end", state.end));

    // FIXME: The legacy native Animated module doesn't receive Fabric events,
    // so we post it separately for `Animated.event` with `useNativeDriver: true`
    if (!ReactNativeFeatureFlags::cxxNativeAnimatedEnabled()) {
        RCTComponentEvent *event = [[RCTComponentEvent alloc] initWithName:@"onInsetsChange"
                                                                viewTag:@(self.tag)
                                                                   body:convertFollyDynamicToId(payload)];

        [[NSNotificationCenter defaultCenter] postNotificationName:RCTNotifyEventDispatcherObserversOfEvent_DEPRECATED
                                                            object:nil
                                                          userInfo:@{ @"event": event }];
    }

    _eventEmitter->experimental_flushSync([&]() {
        _eventEmitter->dispatchEvent("insetsChange", std::move(payload), RawEvent::Category::Discrete);
    });
}

@end
