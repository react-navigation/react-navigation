#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

using namespace facebook::react;

@interface ReactNavigationOverlayInsetsProvider : RCTViewComponentView <RCTMountingTransactionObserving>
@end

@implementation ReactNavigationOverlayInsetsProvider {
    __weak UIViewController *_viewController;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationOverlayInsetsProviderComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ReactNavigationOverlayInsetsProviderProps>();

        _props = defaultProps;
    }

    return self;
}

- (void)mountingTransactionDidMount:(const MountingTransaction &)transaction
               withSurfaceTelemetry:(const SurfaceTelemetry &)surfaceTelemetry
{
    [self updateAdditionalSafeAreaInsets];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [super updateProps:props oldProps:oldProps];

    [self updateViewController];
    [self updateAdditionalSafeAreaInsets];
}

- (void)updateLayoutMetrics:(const LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const LayoutMetrics &)oldLayoutMetrics
{
    [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

    if (layoutMetrics.layoutDirection != oldLayoutMetrics.layoutDirection) {
        [self updateAdditionalSafeAreaInsets];
    }
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];

    [self updateViewController];
}

- (void)updateViewController
{
    const auto &insets = static_cast<const ReactNavigationOverlayInsetsProviderProps &>(*_props).insets;

    if (self.window == nil || (insets.top == 0 && insets.start == 0 && insets.bottom == 0 && insets.end == 0)) {
        [self detachViewController];

        return;
    }

    UIResponder *responder = self.superview;

    while (responder != nil && ![responder isKindOfClass:[UIViewController class]]) {
        responder = responder.nextResponder;
    }

    UIViewController *parentViewController = (UIViewController *)responder;

    if (_viewController.parentViewController == parentViewController) {
        return;
    }

    [self detachViewController];

    if (parentViewController == nil) {
        return;
    }

    UIViewController *viewController = _viewController;
    BOOL isNewViewController = viewController == nil;

    if (isNewViewController) {
        viewController = [UIViewController new];
        viewController.view = self;
        _viewController = viewController;
    }

    [parentViewController addChildViewController:viewController];
    [viewController didMoveToParentViewController:parentViewController];

    if (isNewViewController) {
        // `additionalSafeAreaInsets` is ignored until the view controller has appeared
        // UIKit makes a view controller appear when its view is added to the window
        // Here the view is already in the window when we create the view controller,
        // so we need to run the appearance transition ourselves
        [viewController beginAppearanceTransition:YES animated:NO];
        [viewController endAppearanceTransition];
    }

    [self updateAdditionalSafeAreaInsets];
}

- (void)detachViewController
{
    if (_viewController.parentViewController == nil) {
        return;
    }

    [_viewController willMoveToParentViewController:nil];
    [_viewController removeFromParentViewController];
}

- (void)safeAreaInsetsDidChange
{
    [super safeAreaInsetsDidChange];

    [self updateAdditionalSafeAreaInsets];
}

- (void)updateAdditionalSafeAreaInsets
{
    if (_viewController.parentViewController == nil) {
        return;
    }

    const auto &insets = static_cast<const ReactNavigationOverlayInsetsProviderProps &>(*_props).insets;

    // FIXME: UIKit calculates the safe area with the transforms of ancestors, e.g. during a push.
    // It keeps that value after the transform is removed, so it can be wrong for the final position.
    // So we calculate the inherited insets from the position of the view without the transforms.
    UIEdgeInsets inherited = [ReactNavigationLayoutRegionViewImpl inheritedSafeAreaInsetsOf:self
                                                                                        in:_viewController.parentViewController.view];

    BOOL isRTL = self.effectiveUserInterfaceLayoutDirection == UIUserInterfaceLayoutDirectionRightToLeft;

    UIEdgeInsets wanted = UIEdgeInsetsMake(
        MAX(insets.top, inherited.top),
        MAX(isRTL ? insets.end : insets.start, inherited.left),
        MAX(insets.bottom, inherited.bottom),
        MAX(isRTL ? insets.start : insets.end, inherited.right)
    );

    UIEdgeInsets current = _viewController.additionalSafeAreaInsets;
    UIEdgeInsets safeArea = self.safeAreaInsets;

    UIEdgeInsets additional = UIEdgeInsetsMake(
        MAX(0, wanted.top - (safeArea.top - current.top)),
        MAX(0, wanted.left - (safeArea.left - current.left)),
        MAX(0, wanted.bottom - (safeArea.bottom - current.bottom)),
        MAX(0, wanted.right - (safeArea.right - current.right))
    );

    if (!UIEdgeInsetsEqualToEdgeInsets(additional, current)) {
        _viewController.additionalSafeAreaInsets = additional;
    }
}

@end
