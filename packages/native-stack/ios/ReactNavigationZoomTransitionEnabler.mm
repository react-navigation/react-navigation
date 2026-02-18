#import "ReactNavigationZoomTransitionEnabler.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/ReactNavigationNativeStackSpec/ComponentDescriptors.h>
#import <react/renderer/components/ReactNavigationNativeStackSpec/Props.h>

#import <React/RCTLog.h>

#import "RCTFabricComponentsPlugins.h"
#import "ReactNavigationNativeStackZoomTransitionAnimator.h"
#import "ReactNavigationNativeStackZoomTransitionUtils.h"

using namespace facebook::react;

@implementation ReactNavigationZoomTransitionEnabler {
  NSString *_routeKey;
  BOOL _isObservingRouteConfigChanges;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ReactNavigationZoomTransitionEnablerComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps =
        std::make_shared<const ReactNavigationZoomTransitionEnablerProps>();
    _props = defaultProps;
  }

  return self;
}

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];

  if (self.superview != nil) {
    [self startObservingRouteConfigChangesIfNeeded];
    [self scheduleTransitionSetup];
  } else {
    [self stopObservingRouteConfigChanges];
  }
}

- (void)prepareForRecycle
{
  [self stopObservingRouteConfigChanges];
  _routeKey = nil;
  [super prepareForRecycle];
}

- (void)dealloc
{
  [self stopObservingRouteConfigChanges];
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &newViewProps =
      *std::static_pointer_cast<const ReactNavigationZoomTransitionEnablerProps>(props);
  NSString *routeKey = newViewProps.routeKey.empty() ? nil : RCTNSStringFromString(newViewProps.routeKey);

  if (![_routeKey isEqualToString:routeKey]) {
    _routeKey = [routeKey copy];
    [self scheduleTransitionSetup];
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)startObservingRouteConfigChangesIfNeeded
{
  if (_isObservingRouteConfigChanges) {
    return;
  }

  [[NSNotificationCenter defaultCenter]
      addObserver:self
         selector:@selector(handleRouteConfigDidChange:)
             name:ReactNavigationRouteConfigDidChangeNotificationName
           object:nil];
  [[NSNotificationCenter defaultCenter]
      addObserver:self
         selector:@selector(handlePendingSourceDidChange:)
             name:ReactNavigationPendingSourceDidChangeNotificationName
           object:nil];
  _isObservingRouteConfigChanges = YES;
}

- (void)stopObservingRouteConfigChanges
{
  if (!_isObservingRouteConfigChanges) {
    return;
  }

  [[NSNotificationCenter defaultCenter]
      removeObserver:self
                name:ReactNavigationRouteConfigDidChangeNotificationName
              object:nil];
  [[NSNotificationCenter defaultCenter]
      removeObserver:self
                name:ReactNavigationPendingSourceDidChangeNotificationName
              object:nil];
  _isObservingRouteConfigChanges = NO;
}

- (void)handleRouteConfigDidChange:(NSNotification *)notification
{
  NSString *updatedRouteKey =
      notification.userInfo[ReactNavigationRouteConfigDidChangeRouteKeyUserInfoKey];
  if (updatedRouteKey.length == 0 ||
      ![updatedRouteKey isEqualToString:_routeKey]) {
    return;
  }

  [self scheduleTransitionSetup];
}

- (void)handlePendingSourceDidChange:(__unused NSNotification *)notification
{
  [self scheduleTransitionSetup];
}

- (void)scheduleTransitionSetup
{
  if (_routeKey.length == 0 || self.superview == nil) {
    return;
  }

  __weak __typeof(self) weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    __typeof(self) strongSelf = weakSelf;
    if (strongSelf == nil || strongSelf.superview == nil ||
        strongSelf->_routeKey.length == 0) {
      return;
    }

    UIViewController *controller = [strongSelf findOwningViewController];
    if (controller == nil) {
      return;
    }

    ReactNavigationConfigureNativeStackZoomTransitionForViewController(
        controller,
        strongSelf->_routeKey);
  });
}

- (nullable UIViewController *)findOwningViewController
{
  if (_routeKey.length == 0) {
    return nil;
  }

  UIResponder *responder = self;
  while (responder != nil) {
    if ([responder isKindOfClass:[UIViewController class]]) {
      UIViewController *controller = (UIViewController *)responder;
      NSString *screenId = ReactNavigationGetScreenIdForViewController(controller);
      if ([screenId isEqualToString:_routeKey]) {
        return controller;
      }
    }

    responder = responder.nextResponder;
  }

#if DEBUG
  RCTLogWarn(
      @"[native-stack] Could not find owning view controller for route key '%@'. "
       "Zoom transition will not be applied.",
      _routeKey);
#endif

  return nil;
}

@end
