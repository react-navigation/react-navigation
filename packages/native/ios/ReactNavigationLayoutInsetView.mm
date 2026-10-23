#import "ReactNavigationLayoutInsetView.h"

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import "ReactNavigationLayoutInsetViewComponentDescriptor.h"
#import "ReactNavigationLayoutInsetViewShadowNode.h"

#import <react/renderer/components/ReactNavigationSpec/Props.h>

#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTMountingTransactionObserving.h>

using namespace facebook::react;

static NSTimeInterval const ReactNavigationLayoutInsetAnimationTimeConstant = 0.04;
static CGFloat const ReactNavigationLayoutInsetAnimationTolerance = 0.5;

static CGFloat insetForEdge(UIEdgeInsets insets, ReactNavigationLayoutInsetViewEdge edge)
{
    switch (edge) {
      case ReactNavigationLayoutInsetViewEdge::Top:
        return insets.top;
      case ReactNavigationLayoutInsetViewEdge::Right:
        return insets.right;
      case ReactNavigationLayoutInsetViewEdge::Bottom:
        return insets.bottom;
      case ReactNavigationLayoutInsetViewEdge::Left:
        return insets.left;
    }
}

@interface ReactNavigationLayoutInsetView () <ReactNavigationLayoutMeasurementViewDelegate, RCTMountingTransactionObserving>

@end

@implementation ReactNavigationLayoutInsetView {
  ReactNavigationLayoutMeasurementView * _view;
  ReactNavigationLayoutInsetViewShadowNode::ConcreteState::Shared _state;
  CGFloat _currentInset;
  CGFloat _targetInset;
  CADisplayLink * _insetAnimationDisplayLink;
  BOOL _needsMeasurement;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationLayoutInsetViewComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationLayoutInsetViewProps>();
    _props = defaultProps;

    _view = [[ReactNavigationLayoutMeasurementView alloc] init];
    _view.delegate = self;

    self.contentView = _view;

    // On the first mount, the props are compared with the defaults, which they may match
    // So we always measure without animation after the first mount
    _needsMeasurement = YES;
  }

  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &previousProps = *std::static_pointer_cast<ReactNavigationLayoutInsetViewProps const>(_props);
    const auto &nextProps = *std::static_pointer_cast<ReactNavigationLayoutInsetViewProps const>(props);

    BOOL changed = previousProps.edge != nextProps.edge ||
                   previousProps.cornerAdaptation != nextProps.cornerAdaptation ||
                   previousProps.collapseUnlessAdapted != nextProps.collapseUnlessAdapted;

    [super updateProps:props oldProps:oldProps];

    _needsMeasurement = _needsMeasurement || changed;
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    // Any ancestor can move in the transaction, so we measure after all of it is mounted
    // We animate changes from the layout (e.g. resizing the window), but not changes from the props
    [_view updateMeasurementWithForce:_needsMeasurement animated:!_needsMeasurement];
    _needsMeasurement = NO;
}

- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
    _state = std::static_pointer_cast<ReactNavigationLayoutInsetViewShadowNode::ConcreteState const>(state);
}

- (void)measureIn:(UIView *)view animated:(BOOL)animated
{
    if (@available(iOS 26.0, *)) {
        const auto &props = *std::static_pointer_cast<ReactNavigationLayoutInsetViewProps const>(_props);

        UIViewLayoutRegionAdaptivityAxis axis = props.cornerAdaptation == ReactNavigationLayoutInsetViewCornerAdaptation::Horizontal
            ? UIViewLayoutRegionAdaptivityAxisHorizontal
            : UIViewLayoutRegionAdaptivityAxisVertical;

        CGFloat inset = insetForEdge(
            [view edgeInsetsForLayoutRegion:[UIViewLayoutRegion marginsLayoutRegionWithCornerAdaptation:axis]],
            props.edge
        );

        if (props.collapseUnlessAdapted &&
            inset == insetForEdge(
                [view edgeInsetsForLayoutRegion:[UIViewLayoutRegion marginsLayoutRegionWithCornerAdaptation:UIViewLayoutRegionAdaptivityAxisNone]],
                props.edge
            )) {
            inset = 0;
        }

        if (inset == _targetInset) {
            return;
        }

        _targetInset = inset;

        if (!animated) {
            [_insetAnimationDisplayLink invalidate];
            _insetAnimationDisplayLink = nil;
            [self applyInset:inset];
        } else if (_insetAnimationDisplayLink == nil) {
            _insetAnimationDisplayLink =
                [CADisplayLink displayLinkWithTarget:self selector:@selector(handleInsetAnimationFrame:)];
            [_insetAnimationDisplayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
        }
    }
}

- (void)handleInsetAnimationFrame:(CADisplayLink *)displayLink
{
    CGFloat progress = 1 - exp((displayLink.timestamp - displayLink.targetTimestamp) / ReactNavigationLayoutInsetAnimationTimeConstant);
    CGFloat inset = _currentInset + (_targetInset - _currentInset) * progress;

    if (fabs(_targetInset - inset) < ReactNavigationLayoutInsetAnimationTolerance) {
        [displayLink invalidate];
        _insetAnimationDisplayLink = nil;
        inset = _targetInset;
    }

    [self applyInset:inset];
}

- (void)applyInset:(CGFloat)inset
{
    _currentInset = inset;

    if (!_state) {
        return;
    }

    _state->updateState(ReactNavigationLayoutInsetViewState(inset), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
}

@end
