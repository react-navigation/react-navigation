#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#include "../cpp/ReactNavigationScrollInsets.h"

#import <React/RCTComponentEvent.h>
#import <React/RCTConstants.h>
#import <React/RCTConversions.h>
#import <React/RCTI18nUtil.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTViewComponentView.h>
#import <React/RCTScrollViewComponentView.h>
#import <React/RCTCustomPullToRefreshViewProtocol.h>

#import <react/featureflags/ReactNativeFeatureFlags.h>
#import <react/renderer/components/ReactNavigationSpec/EventEmitters.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>
#import <react/renderer/components/scrollview/ScrollViewProps.h>
#import <react/renderer/components/view/ConcreteViewShadowNode.h>
#import <react/renderer/core/ConcreteComponentDescriptor.h>
#import <react/utils/FollyConvert.h>
#include <yoga/algorithm/FlexDirection.h>

namespace facebook::react {

namespace {

constexpr char LayoutRegionViewComponentName[] = "ReactNavigationLayoutRegionView";

struct LayoutRegionState {
  Float top{0};
  Float bottom{0};
  Float start{0};
  Float end{0};
  bool isRTL{false};
  Tag contentTag{0};
  Tag previousContentTag{0};

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

    bool swap = [i18nUtil isRTL] && [i18nUtil doLeftAndRightSwapInRTL];
    if (getConcreteProps().adjustScrollInsets) {
      applyScrollInsets(yogaNode_, getConcreteProps().edges, getStateData(), swap);
    } else {
      applyInsetsPadding(yogaNode_, getConcreteProps(), getStateData(), swap);
    }
  }

  void appendChild(const std::shared_ptr<const ShadowNode> &child) override {
    ConcreteViewShadowNode::appendChild(child);
    if (getConcreteProps().adjustScrollInsets) {
      adjustLayoutWithState();
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
  __weak RCTScrollViewComponentView *_scrollComponent;
  BOOL _suspendedAutomaticInsets;
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

  [_impl invalidateMeasurement];

  const auto &props = static_cast<const ReactNavigationLayoutRegionViewProps &>(*_props);
  if (props.adjustScrollInsets) {
    [self updateScrollMeasurement];
  } else {
    [_impl updateMeasurementOf:self];
  }
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &newProps = *std::static_pointer_cast<ReactNavigationLayoutRegionViewProps const>(props);

    [_impl setPropsWithRegion:RCTNSStringFromString(toString(newProps.region))
             cornerAdaptation:RCTNSStringFromString(toString(newProps.cornerAdaptation))
                       onEdge:RCTNSStringFromString(toString(newProps.onEdge))
                       extent:newProps.extent];

    [super updateProps:props oldProps:oldProps];

    if (!newProps.adjustScrollInsets) {
        [self commitInsetsIfNeeded];
    }
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
    [self bindScrollComponent:nil];
    [_impl invalidateMeasurement];
    [super prepareForRecycle];

    _measuredState.reset();
    _committedState.reset();
    _state.reset();
    _sentState.reset();
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    const auto &props = static_cast<const ReactNavigationLayoutRegionViewProps &>(*_props);
    if (props.adjustScrollInsets) {
        [self updateScrollMeasurement];
    } else {
        [_impl updateMeasurementOf:self];
    }

    [self sendInsetsChangeIfNeeded];
}

- (void)updateScrollMeasurement
{
    [self bindScrollComponent:[self findScrollComponentIn:self]];
    if (_scrollComponent != nil) {
        [self updateAutomaticInsetsForScrollComponent:_scrollComponent bound:YES];
        [_impl updateMeasurementOf:_scrollComponent];
        [self commitInsetsIfNeeded];
    } else if (_state && _committedState.has_value() && _committedState->contentTag != 0) {
        LayoutRegionState state{};
        state.previousContentTag = _committedState->contentTag;
        _committedState = state;
        _state->updateState(std::move(state), EventQueue::UpdateMode::unstable_Immediate);
    }
}

- (RCTScrollViewComponentView *)findScrollComponentIn:(UIView *)parent
{
    for (UIView *child in parent.subviews) {
        if ([child isKindOfClass:[RCTScrollViewComponentView class]]) {
            return (RCTScrollViewComponentView *)child;
        }
        if ([child isKindOfClass:[ReactNavigationLayoutRegionView class]] &&
            static_cast<const ReactNavigationLayoutRegionViewProps &>(*((ReactNavigationLayoutRegionView *)child)->_props).adjustScrollInsets) {
            continue;
        }
        RCTScrollViewComponentView *found = [self findScrollComponentIn:child];
        if (found != nil) {
            return found;
        }
    }
    return nil;
}

- (void)bindScrollComponent:(RCTScrollViewComponentView *)component
{
    if (_scrollComponent != component) {
        if (_suspendedAutomaticInsets) {
            [self updateAutomaticInsetsForScrollComponent:_scrollComponent bound:NO];
        }
        [_impl invalidateMeasurement];
        _measuredState.reset();
        _sentState.reset();
        _scrollComponent = component;
    }
}

- (void)updateAutomaticInsetsForScrollComponent:(RCTScrollViewComponentView *)component bound:(BOOL)bound
{
    if (component == nil) {
        _suspendedAutomaticInsets = NO;
        return;
    }

    auto props = std::static_pointer_cast<const ScrollViewProps>(component.props);
    UIScrollView *scroll = component.scrollView;
    auto behavior = props->contentInsetAdjustmentBehavior;
    BOOL dependsOnSize = behavior == ContentInsetAdjustmentBehavior::Automatic ||
        behavior == ContentInsetAdjustmentBehavior::ScrollableAxes;
    // FIXME: React Native 0.88 only forwards the scroll axis through the host's flex direction on iOS.
    BOOL horizontal = props->horizontal || facebook::yoga::isRow(props->yogaStyle.flexDirection());
    BOOL bounces = horizontal ? scroll.alwaysBounceHorizontal : scroll.alwaysBounceVertical;

    // FIXME: For short content, padding can make the axis scrollable and turn UIKit's
    // adjustment on. Removing that padding then turns the adjustment off again.
    if (bound && dependsOnSize && !bounces) {
        if (scroll.contentInsetAdjustmentBehavior != UIScrollViewContentInsetAdjustmentNever) {
            scroll.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
        _suspendedAutomaticInsets = YES;
    } else if (_suspendedAutomaticInsets) {
        if (dependsOnSize) {
            scroll.contentInsetAdjustmentBehavior = behavior == ContentInsetAdjustmentBehavior::Automatic
                ? UIScrollViewContentInsetAdjustmentAutomatic : UIScrollViewContentInsetAdjustmentScrollableAxes;
        }
        _suspendedAutomaticInsets = NO;
    }
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

    if (static_cast<const ReactNavigationLayoutRegionViewProps &>(*_props).adjustScrollInsets) {
        UIScrollView *scroll = _scrollComponent.scrollView;
        UIView *content = nil;
        for (UIView *child in _scrollComponent.containerView.subviews) {
            if (![child conformsToProtocol:@protocol(RCTCustomPullToRefreshViewProtocol)]) {
                content = child;
                break;
            }
        }
        if (content.tag == 0) {
            return;
        }
        UIEdgeInsets adjusted = scroll.adjustedContentInset;
        UIEdgeInsets authored = scroll.contentInset;
#if __has_include(<react/renderer/components/scrollview/ScrollContentViewShadowNode.h>)
        // React Native 0.89 cancels UIKit's cross-axis inset and pads ScrollContentView
        // there instead. Our content padding replaces that padding on the same node.
        const auto &props = static_cast<const ScrollViewProps &>(*_scrollComponent.props);
        if (props.contentInsetAdjustmentBehavior != ContentInsetAdjustmentBehavior::Never) {
            if (props.horizontal) {
                authored.top = adjusted.top;
                authored.bottom = adjusted.bottom;
            } else {
                authored.left = adjusted.left;
                authored.right = adjusted.right;
            }
        }
#endif
        state.top = MAX(0, state.top - (adjusted.top - authored.top));
        state.bottom = MAX(0, state.bottom - (adjusted.bottom - authored.bottom));
        CGFloat left = adjusted.left - authored.left;
        CGFloat right = adjusted.right - authored.right;
        state.start = MAX(0, state.start - (state.isRTL ? right : left));
        state.end = MAX(0, state.end - (state.isRTL ? left : right));
        state.contentTag = (Tag)content.tag;
        if (_committedState.has_value()) {
            state.previousContentTag = _committedState->contentTag != state.contentTag
                ? _committedState->contentTag : _committedState->previousContentTag;
        }
    }

    if (_committedState != state && _state) {
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

    if (_eventEmitter == nullptr || !_measuredState.has_value() || _sentState == _measuredState) {
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
