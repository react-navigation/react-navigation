#import "ReactNavigationNativeStackZoomTransitionStore.h"

#import <React/RCTLog.h>

#import <cmath>

static BOOL ReactNavigationIsValidAlignmentRect(CGRect rect)
{
  if (CGRectIsNull(rect) || CGRectIsInfinite(rect)) {
    return NO;
  }

  return std::isfinite(rect.origin.x) && std::isfinite(rect.origin.y) &&
      std::isfinite(rect.size.width) && std::isfinite(rect.size.height) &&
      rect.size.width > 0 && rect.size.height > 0;
}

@implementation ReactNavigationNativeStackZoomRouteConfig
@end

@interface ReactNavigationNativeStackZoomTransitionStore ()

@property (nonatomic) NSMutableDictionary<
    NSString *,
    ReactNavigationNativeStackZoomRouteConfig *> *routeConfigs;
@property (nonatomic) NSMutableDictionary<NSString *, NSMapTable<NSString *, UIView *> *> *triggerViewsByRoute;
@property (nonatomic) NSMutableDictionary<NSString *, NSMutableDictionary<NSString *, NSValue *> *> *alignmentRectsByRoute;
@property (nonatomic, copy, nullable) NSString *pendingSourceTriggerId;
@property (nonatomic) NSMutableSet<NSString *> *warnedDuplicateTriggerKeys;

@end

@implementation ReactNavigationNativeStackZoomTransitionStore

+ (instancetype)sharedStore
{
  static ReactNavigationNativeStackZoomTransitionStore *store = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    store = [[ReactNavigationNativeStackZoomTransitionStore alloc] init];
  });

  return store;
}

- (instancetype)init
{
  if (self = [super init]) {
    _routeConfigs = [NSMutableDictionary new];
    _triggerViewsByRoute = [NSMutableDictionary new];
    _alignmentRectsByRoute = [NSMutableDictionary new];
    _warnedDuplicateTriggerKeys = [NSMutableSet new];
  }

  return self;
}

- (void)setRouteConfigForRouteKey:(NSString *)routeKey
                         sourceId:(nullable NSString *)sourceId
                         targetId:(nullable NSString *)targetId
                     dimmingColor:(nullable UIColor *)dimmingColor
               dimmingBlurEffect:(nullable NSString *)dimmingBlurEffect
               interactiveDismiss:(nullable NSString *)interactiveDismiss
{
  if (routeKey.length == 0) {
    return;
  }

  ReactNavigationNativeStackZoomRouteConfig *config = [ReactNavigationNativeStackZoomRouteConfig new];
  config.sourceId = sourceId.length > 0 ? sourceId : nil;
  config.targetId = targetId.length > 0 ? targetId : nil;
  config.dimmingColor = dimmingColor;
  config.dimmingBlurEffect = dimmingBlurEffect.length > 0 ? dimmingBlurEffect : nil;
  config.interactiveDismiss = interactiveDismiss.length > 0 ? interactiveDismiss : nil;
  self.routeConfigs[routeKey] = config;
}

- (void)clearRouteConfigForRouteKey:(NSString *)routeKey
{
  if (routeKey.length == 0) {
    return;
  }

  [self.routeConfigs removeObjectForKey:routeKey];
}

- (nullable ReactNavigationNativeStackZoomRouteConfig *)routeConfigForRouteKey:(NSString *)routeKey
{
  if (routeKey.length == 0) {
    return nil;
  }

  return self.routeConfigs[routeKey];
}

- (void)registerTriggerView:(UIView *)view
                   routeKey:(NSString *)routeKey
                  triggerId:(NSString *)triggerId
              alignmentRect:(CGRect)alignmentRect
{
  if (routeKey.length == 0 || triggerId.length == 0 || view == nil) {
    return;
  }

  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    routeMap = [NSMapTable strongToWeakObjectsMapTable];
    self.triggerViewsByRoute[routeKey] = routeMap;
  }

  UIView *existingView = [routeMap objectForKey:triggerId];
  if (existingView != nil && existingView != view) {
    [self warnDuplicateTriggerIdIfNeededForRouteKey:routeKey triggerId:triggerId];
  }

  [routeMap setObject:view forKey:triggerId];
  [self setAlignmentRect:alignmentRect forRouteKey:routeKey triggerId:triggerId];
}

- (void)unregisterTriggerView:(UIView *)view
                     routeKey:(NSString *)routeKey
                    triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return;
  }

  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    return;
  }

  UIView *currentView = [routeMap objectForKey:triggerId];
  if (currentView == nil || currentView == view) {
    [routeMap removeObjectForKey:triggerId];
    [self clearAlignmentRectForRouteKey:routeKey triggerId:triggerId];
  }

  if (routeMap.count == 0) {
    [self.triggerViewsByRoute removeObjectForKey:routeKey];
  }
}

- (nullable UIView *)triggerViewForRouteKey:(NSString *)routeKey
                                   triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return nil;
  }

  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    return nil;
  }

  return [routeMap objectForKey:triggerId];
}

- (CGRect)alignmentRectForRouteKey:(NSString *)routeKey
                           triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return CGRectNull;
  }

  NSMutableDictionary<NSString *, NSValue *> *routeMap = self.alignmentRectsByRoute[routeKey];
  if (routeMap == nil) {
    return CGRectNull;
  }

  NSValue *storedRect = routeMap[triggerId];
  if (storedRect == nil) {
    return CGRectNull;
  }

  return storedRect.CGRectValue;
}

- (void)setPendingSourceTriggerId:(NSString *)triggerId
{
  if (triggerId.length == 0) {
    return;
  }

  _pendingSourceTriggerId = [triggerId copy];
}

- (nullable NSString *)consumePendingSourceTriggerId
{
  NSString *pendingTriggerId = _pendingSourceTriggerId;
  if (pendingTriggerId.length == 0) {
    return nil;
  }

  _pendingSourceTriggerId = nil;

  return pendingTriggerId;
}

- (void)setAlignmentRect:(CGRect)alignmentRect
             forRouteKey:(NSString *)routeKey
               triggerId:(NSString *)triggerId
{
  NSMutableDictionary<NSString *, NSValue *> *routeMap = self.alignmentRectsByRoute[routeKey];

  if (!ReactNavigationIsValidAlignmentRect(alignmentRect)) {
    [routeMap removeObjectForKey:triggerId];

    if (routeMap.count == 0) {
      [self.alignmentRectsByRoute removeObjectForKey:routeKey];
    }

    return;
  }

  if (routeMap == nil) {
    routeMap = [NSMutableDictionary new];
    self.alignmentRectsByRoute[routeKey] = routeMap;
  }

  routeMap[triggerId] = [NSValue valueWithCGRect:alignmentRect];
}

- (void)clearAlignmentRectForRouteKey:(NSString *)routeKey
                            triggerId:(NSString *)triggerId
{
  NSMutableDictionary<NSString *, NSValue *> *routeMap = self.alignmentRectsByRoute[routeKey];
  if (routeMap == nil) {
    return;
  }

  [routeMap removeObjectForKey:triggerId];

  if (routeMap.count == 0) {
    [self.alignmentRectsByRoute removeObjectForKey:routeKey];
  }
}

- (void)warnDuplicateTriggerIdIfNeededForRouteKey:(NSString *)routeKey
                                         triggerId:(NSString *)triggerId
{
#if DEBUG
  NSString *warningKey = [NSString stringWithFormat:@"%@::%@", routeKey, triggerId];
  if ([self.warnedDuplicateTriggerKeys containsObject:warningKey]) {
    return;
  }

  [self.warnedDuplicateTriggerKeys addObject:warningKey];
  RCTLogWarn(
      @"[native-stack] Duplicate `ZoomAnchor` id '%@' found on route '%@'. The last mounted anchor will be used for zoom transitions.",
      triggerId,
      routeKey);
#else
  (void)routeKey;
  (void)triggerId;
#endif
}

@end
