#import "ReactNavigationNativeStackZoomTransitionUtils.h"

#import <cmath>

NSString *const ReactNavigationRouteConfigDidChangeNotificationName =
    @"ReactNavigationNativeStackZoomTransitionRouteConfigDidChangeNotification";
NSString *const ReactNavigationRouteConfigDidChangeRouteKeyUserInfoKey = @"routeKey";
NSString *const ReactNavigationPendingSourceDidChangeNotificationName =
    @"ReactNavigationNativeStackZoomTransitionPendingSourceDidChangeNotification";

NSString *_Nullable ReactNavigationGetScreenIdForViewController(UIViewController *viewController)
{
  SEL screenViewSelector = NSSelectorFromString(@"screenView");
  if (![viewController respondsToSelector:screenViewSelector]) {
    return nil;
  }

  IMP implementation = [viewController methodForSelector:screenViewSelector];
  id (*invokeSelector)(id, SEL) = (id(*)(id, SEL))implementation;
  id screenView = invokeSelector(viewController, screenViewSelector);

  if (screenView == nil) {
    return nil;
  }

  SEL screenIdSelector = NSSelectorFromString(@"screenId");
  if (![screenView respondsToSelector:screenIdSelector]) {
    return nil;
  }

  IMP screenIdImplementation = [screenView methodForSelector:screenIdSelector];
  id (*invokeScreenIdSelector)(id, SEL) = (id(*)(id, SEL))screenIdImplementation;
  id screenId = invokeScreenIdSelector(screenView, screenIdSelector);

  if ([screenId isKindOfClass:[NSString class]]) {
    return (NSString *)screenId;
  }

  return nil;
}

BOOL ReactNavigationIsValidRect(CGRect rect)
{
  if (CGRectIsNull(rect) || CGRectIsEmpty(rect) || CGRectIsInfinite(rect)) {
    return NO;
  }

  return std::isfinite(rect.origin.x) && std::isfinite(rect.origin.y) &&
      std::isfinite(rect.size.width) && std::isfinite(rect.size.height);
}
