#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import <react/renderer/components/ReactNavigationSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationSpec/Props.h>

using namespace facebook::react;

@interface ReactNavigationSafeAreaInsetsProvider : RCTViewComponentView
@end

@implementation ReactNavigationSafeAreaInsetsProvider {
    UIViewController *_viewController;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
    return concreteComponentDescriptorProvider<ReactNavigationSafeAreaInsetsProviderComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        static const auto defaultProps = std::make_shared<const ReactNavigationSafeAreaInsetsProviderProps>();

        _props = defaultProps;
    }

    return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    [super updateProps:props oldProps:oldProps];

    [self updateAdditionalSafeAreaInsets];
}

- (void)prepareForRecycle
{
    [super prepareForRecycle];

    // The view controller and the view reference each other,
    // so we need clear the view first
    _viewController.view = nil;
    _viewController = nil;
}

- (void)didMoveToWindow
{
    [super didMoveToWindow];

    if (self.window == nil) {
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

    if (_viewController == nil) {
        _viewController = [UIViewController new];
        _viewController.view = self;
    }

    [parentViewController addChildViewController:_viewController];
    [_viewController didMoveToParentViewController:parentViewController];

    // `additionalSafeAreaInsets` is ignored until the view controller has appeared
    // The view was already in the window, so we need to run the appearance transition ourselves
    [_viewController beginAppearanceTransition:YES animated:NO];
    [_viewController endAppearanceTransition];

    [self updateAdditionalSafeAreaInsets];
}

- (void)detachViewController
{
    if (_viewController.parentViewController == nil) {
        return;
    }

    [_viewController beginAppearanceTransition:NO animated:NO];
    [_viewController endAppearanceTransition];

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

    const auto &insets = static_cast<const ReactNavigationSafeAreaInsetsProviderProps &>(*_props).insets;

    UIEdgeInsets current = _viewController.additionalSafeAreaInsets;
    UIEdgeInsets safeArea = self.safeAreaInsets;

    BOOL isRTL = self.effectiveUserInterfaceLayoutDirection == UIUserInterfaceLayoutDirectionRightToLeft;

    UIEdgeInsets additional = UIEdgeInsetsMake(
        MAX(0, insets.top - (safeArea.top - current.top)),
        MAX(0, (isRTL ? insets.end : insets.start) - (safeArea.left - current.left)),
        MAX(0, insets.bottom - (safeArea.bottom - current.bottom)),
        MAX(0, (isRTL ? insets.start : insets.end) - (safeArea.right - current.right))
    );

    if (!UIEdgeInsetsEqualToEdgeInsets(additional, current)) {
        _viewController.additionalSafeAreaInsets = additional;
    }
}

@end
