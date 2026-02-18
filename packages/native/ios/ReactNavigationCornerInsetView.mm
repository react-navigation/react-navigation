#import "ReactNavigationCornerInsetView.h"

#import <React/RCTConversions.h>

#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import "ReactNavigationCornerInsetViewComponentDescriptor.h"
#import "ReactNavigationCornerInsetViewShadowNode.h"

#import <QuartzCore/QuartzCore.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

static NSTimeInterval const ReactNavigationCornerInsetAnimationDuration = 0.2;
static CGFloat const ReactNavigationCornerInsetAnimationTolerance = 0.01;

@interface ReactNavigationCornerInsetView () <ReactNavigationCornerInsetViewImplDelegate>

@end

@implementation ReactNavigationCornerInsetView {
  ReactNavigationCornerInsetViewImpl * _view;
  ReactNavigationCornerInsetViewShadowNode::ConcreteState::Shared _state;
  CGFloat _currentCornerInset;
  CADisplayLink * _cornerInsetAnimationDisplayLink;
  CFTimeInterval _cornerInsetAnimationStartTime;
  CGFloat _cornerInsetAnimationFromValue;
  CGFloat _cornerInsetAnimationToValue;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationCornerInsetViewComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const ReactNavigationCornerInsetViewProps>();
    _props = defaultProps;

    _view = [[ReactNavigationCornerInsetViewImpl alloc] init];
    _view.delegate = self;

    self.contentView = _view;
  }

  return self;
}

static ReactNavigationCornerInsetViewImplProps *convertProps(const Props::Shared &props) {
    const auto &viewProps = *std::static_pointer_cast<ReactNavigationCornerInsetViewProps const>(props);

    ReactNavigationCornerInsetViewImplProps *swiftProps = [[ReactNavigationCornerInsetViewImplProps alloc] init];

    swiftProps.direction = viewProps.direction == ReactNavigationCornerInsetViewDirection::Horizontal
        ? CornerInsetDirectionHorizontal
        : CornerInsetDirectionVertical;

    swiftProps.edge = viewProps.edge == ReactNavigationCornerInsetViewEdge::Left
        ? CornerInsetEdgeLeft
        : viewProps.edge == ReactNavigationCornerInsetViewEdge::Right
            ? CornerInsetEdgeRight
            : viewProps.edge == ReactNavigationCornerInsetViewEdge::Bottom
                ? CornerInsetEdgeBottom
                : CornerInsetEdgeTop;

    return swiftProps;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [_view updateProps:convertProps(props) oldProps:convertProps(_props)];
    [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(const State::Shared &)state oldState:(const State::Shared &)oldState
{
    _state = std::static_pointer_cast<ReactNavigationCornerInsetViewShadowNode::ConcreteState const>(state);
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
    if ([commandName isEqualToString:@"relayout"]) {
        [_view relayout];
        return;
    }

    [super handleCommand:commandName args:args];
}

- (void)dealloc
{
    [self stopCornerInsetAnimation];
}

- (void)cornerInsetDidChange:(CGFloat)cornerInset animated:(BOOL)animated
{
    if (animated) {
        if (fabs(_currentCornerInset - cornerInset) <= ReactNavigationCornerInsetAnimationTolerance) {
            return;
        }

        [self startCornerInsetAnimationTo:cornerInset];
        return;
    }

    if (_cornerInsetAnimationDisplayLink != nil &&
        fabs(_cornerInsetAnimationToValue - cornerInset) <= ReactNavigationCornerInsetAnimationTolerance) {
        return;
    }

    [self stopCornerInsetAnimation];

    if (fabs(_currentCornerInset - cornerInset) <= ReactNavigationCornerInsetAnimationTolerance) {
        return;
    }

    [self applyCornerInset:cornerInset];
}

- (void)startCornerInsetAnimationTo:(CGFloat)cornerInset
{
    [self stopCornerInsetAnimation];

    _cornerInsetAnimationFromValue = _currentCornerInset;
    _cornerInsetAnimationToValue = cornerInset;
    _cornerInsetAnimationStartTime = CACurrentMediaTime();
    _cornerInsetAnimationDisplayLink =
        [CADisplayLink displayLinkWithTarget:self selector:@selector(handleCornerInsetAnimationFrame:)];
    [_cornerInsetAnimationDisplayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
}

- (void)stopCornerInsetAnimation
{
    [_cornerInsetAnimationDisplayLink invalidate];
    _cornerInsetAnimationDisplayLink = nil;
    _cornerInsetAnimationStartTime = 0;
}

- (void)handleCornerInsetAnimationFrame:(CADisplayLink *)displayLink
{
    NSTimeInterval elapsed = CACurrentMediaTime() - _cornerInsetAnimationStartTime;
    CGFloat progress = MIN(1, elapsed / ReactNavigationCornerInsetAnimationDuration);
    CGFloat inverseProgress = 1 - progress;
    CGFloat easedProgress = 1 - inverseProgress * inverseProgress * inverseProgress;

    CGFloat cornerInset = _cornerInsetAnimationFromValue +
                          (_cornerInsetAnimationToValue - _cornerInsetAnimationFromValue) * easedProgress;
    [self applyCornerInset:cornerInset];

    if (progress >= 1) {
        [self stopCornerInsetAnimation];
        [self applyCornerInset:_cornerInsetAnimationToValue];
    }
}

- (void)applyCornerInset:(CGFloat)cornerInset
{
    _currentCornerInset = cornerInset;

    if (!_state) {
        return;
    }

    _state->updateState(ReactNavigationCornerInsetViewState(cornerInset), facebook::react::EventQueue::UpdateMode::unstable_Immediate);
}

@end
