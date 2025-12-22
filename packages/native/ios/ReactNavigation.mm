#import "ReactNavigation.h"

#import <UIKit/UIKit.h>

@class ReactNavigationSafeAreaObserverView;

@interface ReactNavigation ()

@property (nonatomic, strong)
ReactNavigationSafeAreaObserverView *safeAreaObserverView;

@end

@interface ReactNavigationSafeAreaObserverView : UIView

- (instancetype)initWithModule:(ReactNavigation *)module;

@end

@implementation ReactNavigationSafeAreaObserverView {
  __weak ReactNavigation *_module;
}

- (instancetype)initWithModule:(ReactNavigation *)module
{

  self = [super initWithFrame:CGRectZero];

  if (self != nil) {
    _module = module;
    self.userInteractionEnabled = NO;
    self.hidden = YES;
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth |
    UIViewAutoresizingFlexibleHeight;
  }

  return self;
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];

  if (self.window != nil) {
    self.frame = self.window.bounds;
  }

  [self notifySafeAreaChanged];
}

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self notifySafeAreaChanged];
}

- (void)notifySafeAreaChanged
{
  if (_module == nil) {
    return;
  }

  [_module emitOnCornerInsetsChanged:nil];
}

@end
#if (defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000) || \
(defined(__TV_OS_VERSION_MAX_ALLOWED) && __TV_OS_VERSION_MAX_ALLOWED >= 260000)
static UIWindow *ReactNavigationGetPreferredWindow(void)
{
  NSSet<UIScene *> *connectedScenes = [UIApplication sharedApplication].connectedScenes;

  for (UIScene *scene in connectedScenes) {
    if (scene.activationState != UISceneActivationStateForegroundActive) {
      continue;
    }

    if (![scene isKindOfClass:[UIWindowScene class]]) {
      continue;
    }

    UIWindowScene *windowScene = (UIWindowScene *)scene;

    for (UIWindow *window in windowScene.windows) {
      if (window.isHidden) {
        continue;
      }

      if (window.isKeyWindow) {
        return window;
      }
    }
  }

  return nil;
}
#endif

static NSDictionary *ReactNavigationDictionaryFromInsets(UIEdgeInsets insets)
{
  return @{
    @"top": @(insets.top),
    @"right": @(insets.right),
    @"bottom": @(insets.bottom),
    @"left": @(insets.left),
  };
}

#if (defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000) || \
(defined(__TV_OS_VERSION_MAX_ALLOWED) && __TV_OS_VERSION_MAX_ALLOWED >= 260000)
static NSDictionary *
ReactNavigationCornerInsetsForAxis(UIWindow *window,
                                   UIViewLayoutRegionAdaptivityAxis axis)
{
  if (window == nil) {
    return ReactNavigationDictionaryFromInsets(UIEdgeInsetsZero);
  }

  UIEdgeInsets insets = window.safeAreaInsets;

  if (@available(iOS 26.0, tvOS 26.0, *)) {
    UIViewLayoutRegion *region =
    [UIViewLayoutRegion safeAreaLayoutRegionWithCornerAdaptation:axis];

    insets = [window edgeInsetsForLayoutRegion:region];
  }


  return ReactNavigationDictionaryFromInsets(insets);
}

static UIViewLayoutRegionAdaptivityAxis
ReactNavigationAxisFromDirection(NSString *direction)
{
  if ([[direction lowercaseString] isEqualToString:@"vertical"]) {
    return UIViewLayoutRegionAdaptivityAxisVertical;
  }

  return UIViewLayoutRegionAdaptivityAxisHorizontal;
}
#endif

@implementation ReactNavigation (SafeAreaObserver)

- (void)installSafeAreaObserverIfNeededForWindow:(UIWindow *)window
{
  if (![NSThread isMainThread]) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self installSafeAreaObserverIfNeededForWindow:window];
    });
    return;
  }


  if (self.safeAreaObserverView == nil) {
    self.safeAreaObserverView =
    [[ReactNavigationSafeAreaObserverView alloc] initWithModule:self];
  }
}

@end

@implementation ReactNavigation
- (NSDictionary *)cornerInsetsForAdaptivity:(NSString *)direction
{
#if (defined(__IPHONE_OS_VERSION_MAX_ALLOWED) && __IPHONE_OS_VERSION_MAX_ALLOWED >= 260000) || \
(defined(__TV_OS_VERSION_MAX_ALLOWED) && __TV_OS_VERSION_MAX_ALLOWED >= 260000)
  if (@available(iOS 26.0, tvOS 26.0, *)) {
    UIWindow *window = ReactNavigationGetPreferredWindow();
    [self installSafeAreaObserverIfNeededForWindow:window];
    UIViewLayoutRegionAdaptivityAxis axis =
    ReactNavigationAxisFromDirection(direction);

    return ReactNavigationCornerInsetsForAxis(window, axis);
  }
#endif
  return ReactNavigationDictionaryFromInsets(UIEdgeInsets());
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeReactNavigationImplSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"ReactNavigation";
}

@end
