#import "ReactNavigationNativeStackZoomTransitionStore.h"
#import "ReactNavigationNativeStackZoomTransitionUtils.h"

#import <React/RCTLog.h>

@implementation ReactNavigationNativeStackZoomRouteConfig

- (instancetype)initWithSourceId:(nullable NSString *)sourceId
                        targetId:(nullable NSString *)targetId
                    dimmingColor:(nullable UIColor *)dimmingColor
              dimmingBlurEffect:(nullable NSString *)dimmingBlurEffect
          interactiveDismissEnabled:(nullable NSNumber *)interactiveDismissEnabled
{
  if (self = [super init]) {
    _sourceId = [sourceId copy];
    _targetId = [targetId copy];
    _dimmingColor = dimmingColor;
    _dimmingBlurEffect = [dimmingBlurEffect copy];
    _interactiveDismissEnabled = [interactiveDismissEnabled copy];
  }

  return self;
}

@end

@interface ReactNavigationNativeStackZoomTransitionStore ()

@property (nonatomic) NSMutableDictionary<
    NSString *,
    ReactNavigationNativeStackZoomRouteConfig *> *routeConfigs;
@property (nonatomic) NSMutableDictionary<NSString *, NSMapTable<NSString *, UIView *> *> *triggerViewsByRoute;
@property (nonatomic) NSMutableDictionary<NSString *, NSMutableDictionary<NSString *, NSValue *> *> *alignmentRectsByRoute;
@property (nonatomic, copy, nullable) NSString *storedPendingSourceTriggerId;
@property (nonatomic) NSMutableSet<NSString *> *warnedDuplicateTriggerKeys;
@property (nonatomic) NSLock *lock;

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
    _lock = [NSLock new];
  }

  return self;
}

- (void)setRouteConfigForRouteKey:(NSString *)routeKey
                         sourceId:(nullable NSString *)sourceId
                         targetId:(nullable NSString *)targetId
                     dimmingColor:(nullable UIColor *)dimmingColor
               dimmingBlurEffect:(nullable NSString *)dimmingBlurEffect
           interactiveDismissEnabled:(nullable NSNumber *)interactiveDismissEnabled
{
  if (routeKey.length == 0) {
    return;
  }

  ReactNavigationNativeStackZoomRouteConfig *config =
      [[ReactNavigationNativeStackZoomRouteConfig alloc]
          initWithSourceId:sourceId.length > 0 ? sourceId : nil
                  targetId:targetId.length > 0 ? targetId : nil
              dimmingColor:dimmingColor
        dimmingBlurEffect:dimmingBlurEffect.length > 0 ? dimmingBlurEffect : nil
    interactiveDismissEnabled:interactiveDismissEnabled == nil
                                 ? nil
                                 : @(interactiveDismissEnabled.boolValue)];

  [self.lock lock];
  self.routeConfigs[routeKey] = config;
  [self.lock unlock];
}

- (void)clearRouteConfigForRouteKey:(NSString *)routeKey
{
  if (routeKey.length == 0) {
    return;
  }

  [self.lock lock];
  [self.routeConfigs removeObjectForKey:routeKey];
  [self.lock unlock];
}

- (nullable ReactNavigationNativeStackZoomRouteConfig *)routeConfigForRouteKey:(NSString *)routeKey
{
  if (routeKey.length == 0) {
    return nil;
  }

  [self.lock lock];
  ReactNavigationNativeStackZoomRouteConfig *config = self.routeConfigs[routeKey];
  [self.lock unlock];

  return config;
}

- (void)registerTriggerView:(UIView *)view
                   routeKey:(NSString *)routeKey
                  triggerId:(NSString *)triggerId
              alignmentRect:(CGRect)alignmentRect
{
  if (routeKey.length == 0 || triggerId.length == 0 || view == nil) {
    return;
  }

  [self.lock lock];
  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    routeMap = [NSMapTable strongToWeakObjectsMapTable];
    self.triggerViewsByRoute[routeKey] = routeMap;
  }

  UIView *existingView = [routeMap objectForKey:triggerId];
  if (existingView != nil && existingView != view) {
    [self _locked_warnDuplicateTriggerIdForRouteKey:routeKey triggerId:triggerId];
  }

  [routeMap setObject:view forKey:triggerId];
  [self _locked_setAlignmentRect:alignmentRect forRouteKey:routeKey triggerId:triggerId];
  [self.lock unlock];
}

- (void)unregisterTriggerView:(UIView *)view
                     routeKey:(NSString *)routeKey
                    triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return;
  }

  [self.lock lock];
  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    [self.lock unlock];
    return;
  }

  UIView *currentView = [routeMap objectForKey:triggerId];
  if (currentView == nil || currentView == view) {
    [routeMap removeObjectForKey:triggerId];
    [self _locked_clearAlignmentRectForRouteKey:routeKey triggerId:triggerId];
  }

  if (routeMap.count == 0) {
    [self.triggerViewsByRoute removeObjectForKey:routeKey];
  }
  [self.lock unlock];
}

- (nullable UIView *)triggerViewForRouteKey:(NSString *)routeKey
                                   triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return nil;
  }

  [self.lock lock];
  NSMapTable<NSString *, UIView *> *routeMap = self.triggerViewsByRoute[routeKey];
  if (routeMap == nil) {
    [self.lock unlock];
    return nil;
  }

  UIView *triggerView = [routeMap objectForKey:triggerId];
  [self.lock unlock];

  return triggerView;
}

- (CGRect)alignmentRectForRouteKey:(NSString *)routeKey
                           triggerId:(NSString *)triggerId
{
  if (routeKey.length == 0 || triggerId.length == 0) {
    return CGRectNull;
  }

  [self.lock lock];
  NSMutableDictionary<NSString *, NSValue *> *routeMap = self.alignmentRectsByRoute[routeKey];
  if (routeMap == nil) {
    [self.lock unlock];
    return CGRectNull;
  }

  NSValue *storedRect = routeMap[triggerId];
  if (storedRect == nil) {
    [self.lock unlock];
    return CGRectNull;
  }

  CGRect alignmentRect = storedRect.CGRectValue;
  [self.lock unlock];

  return alignmentRect;
}

- (void)setPendingSourceTriggerId:(NSString *)triggerId
{
  if (triggerId.length == 0) {
    return;
  }

  [self.lock lock];
  _storedPendingSourceTriggerId = [triggerId copy];
  [self.lock unlock];
}

- (nullable NSString *)pendingSourceTriggerId
{
  [self.lock lock];
  NSString *pendingTriggerId = [_storedPendingSourceTriggerId copy];
  [self.lock unlock];

  return pendingTriggerId;
}

- (nullable NSString *)consumePendingSourceTriggerId
{
  [self.lock lock];
  NSString *pendingTriggerId = [_storedPendingSourceTriggerId copy];
  if (pendingTriggerId.length == 0) {
    [self.lock unlock];
    return nil;
  }

  _storedPendingSourceTriggerId = nil;
  [self.lock unlock];

  return pendingTriggerId;
}

#pragma mark - Private (must be called while self.lock is held)

- (void)_locked_setAlignmentRect:(CGRect)alignmentRect
                     forRouteKey:(NSString *)routeKey
                       triggerId:(NSString *)triggerId
{
  NSMutableDictionary<NSString *, NSValue *> *routeMap = self.alignmentRectsByRoute[routeKey];

  if (!ReactNavigationIsValidRect(alignmentRect)) {
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

- (void)_locked_clearAlignmentRectForRouteKey:(NSString *)routeKey
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

- (void)_locked_warnDuplicateTriggerIdForRouteKey:(NSString *)routeKey
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
