#if __has_include("ReactNavigation/ReactNavigation-Swift.h")
#import "ReactNavigation/ReactNavigation-Swift.h"
#else
#import "ReactNavigation-Swift.h"
#endif

#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTViewComponentView.h>
#import <React/UIView+React.h>
#import <UIKit/UIKit.h>

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

using namespace facebook::react;

@interface ReactNavigationOverlayInsetsProvider : RCTViewComponentView <RCTMountingTransactionObserving>
@end

@implementation ReactNavigationOverlayInsetsProvider {
    UIViewController *_viewController;
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
    [self updateViewController];
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];

    [self updateViewController];
}

- (void)willMoveToSuperview:(UIView *)newSuperview
{
    [super willMoveToSuperview:newSuperview];

    if (newSuperview != nil && _viewController == nil) {
        // Give nested controllers a parent before they enter the window.
        _viewController = [UIViewController new];
        _viewController.view = self;
    }
}

- (void)didMoveToSuperview
{
    [super didMoveToSuperview];

    if (self.superview == nil) {
        [_viewController willMoveToParentViewController:nil];
        [_viewController removeFromParentViewController];
        // Clear the view association before Fabric can recycle this view.
        _viewController.view = nil;
        _viewController = nil;
    }
}

- (void)updateViewController
{
    // UIKit can temporarily remove the presenting view from the window.
    // Keep the controller attached while the view still belongs to its parent.
    UIViewController *parentViewController = self.superview.reactViewController;

    if (parentViewController != nil && _viewController.parentViewController != parentViewController) {
        [parentViewController addChildViewController:_viewController];
        [_viewController didMoveToParentViewController:parentViewController];

        if (self.window != nil) {
            // FIXME: `additionalSafeAreaInsets` is ignored until the view controller has appeared
            // UIKit makes a view controller appear when its view is added to the window
            // Here the view is already in the window when we attach the view controller,
            // so we need to run the appearance transition ourselves
            [_viewController beginAppearanceTransition:YES animated:NO];
            [_viewController endAppearanceTransition];
        }
    }

    [self updateAdditionalSafeAreaInsets];
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

    // Using the view's `safeAreaInsets` directly would include transforms.
    // So we use the same logic as LayoutRegionView instead.
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
