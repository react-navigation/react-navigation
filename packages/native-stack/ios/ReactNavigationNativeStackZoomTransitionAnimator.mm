#import <UIKit/UIKit.h>

#import <React/RCTLog.h>

#import "ReactNavigationNativeStackZoomTransitionAnimator.h"
#import "ReactNavigationNativeStackZoomTransitionStore.h"
#import "ReactNavigationNativeStackZoomTransitionUtils.h"

static void ReactNavigationWarnOnce(NSString *key, NSString *message)
{
#if DEBUG
  static NSMutableSet<NSString *> *warnings = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    warnings = [NSMutableSet new];
  });

  if (key.length == 0 || message.length == 0) {
    return;
  }

  @synchronized(warnings) {
    if ([warnings containsObject:key]) {
      return;
    }

    [warnings addObject:key];
  }

  RCTLogWarn(@"%@", message);
#else
  (void)key;
  (void)message;
#endif
}

static UIBlurEffect *_Nullable ReactNavigationGetBlurEffect(NSString *blurEffect)
{
  static NSDictionary<NSString *, NSNumber *> *blurEffectStyles = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    blurEffectStyles = @{
      @"regular" : @(UIBlurEffectStyleRegular),
      @"prominent" : @(UIBlurEffectStyleProminent),
      @"systemUltraThinMaterial" : @(UIBlurEffectStyleSystemUltraThinMaterial),
      @"systemThinMaterial" : @(UIBlurEffectStyleSystemThinMaterial),
      @"systemMaterial" : @(UIBlurEffectStyleSystemMaterial),
      @"systemThickMaterial" : @(UIBlurEffectStyleSystemThickMaterial),
      @"systemChromeMaterial" : @(UIBlurEffectStyleSystemChromeMaterial),
      @"systemUltraThinMaterialLight" : @(UIBlurEffectStyleSystemUltraThinMaterialLight),
      @"systemThinMaterialLight" : @(UIBlurEffectStyleSystemThinMaterialLight),
      @"systemMaterialLight" : @(UIBlurEffectStyleSystemMaterialLight),
      @"systemThickMaterialLight" : @(UIBlurEffectStyleSystemThickMaterialLight),
      @"systemChromeMaterialLight" : @(UIBlurEffectStyleSystemChromeMaterialLight),
      @"systemUltraThinMaterialDark" : @(UIBlurEffectStyleSystemUltraThinMaterialDark),
      @"systemThinMaterialDark" : @(UIBlurEffectStyleSystemThinMaterialDark),
      @"systemMaterialDark" : @(UIBlurEffectStyleSystemMaterialDark),
      @"systemThickMaterialDark" : @(UIBlurEffectStyleSystemThickMaterialDark),
      @"systemChromeMaterialDark" : @(UIBlurEffectStyleSystemChromeMaterialDark),
    };
  });

  NSNumber *style = blurEffectStyles[blurEffect];
  if (style == nil) {
    return nil;
  }

  return [UIBlurEffect effectWithStyle:(UIBlurEffectStyle)style.integerValue];
}

static BOOL ReactNavigationShouldConsumePendingSourceForViewController(UIViewController *viewController)
{
  return viewController.isMovingToParentViewController || viewController.isBeingPresented;
}

void ReactNavigationConfigureNativeStackZoomTransitionForViewController(
    UIViewController *viewController,
    NSString *routeKey)
{
  if (@available(iOS 18.0, *)) {
    if (viewController == nil) {
      return;
    }

    if (routeKey.length == 0) {
      viewController.preferredTransition = nil;
      return;
    }

    ReactNavigationNativeStackZoomTransitionStore *store =
        [ReactNavigationNativeStackZoomTransitionStore sharedStore];
    ReactNavigationNativeStackZoomRouteConfig *config = [store routeConfigForRouteKey:routeKey];

    BOOL shouldConsumePendingSource =
        ReactNavigationShouldConsumePendingSourceForViewController(viewController);
    NSString *configuredSourceId = config.sourceId.length > 0 ? config.sourceId : nil;
    NSString *pendingSourceId = shouldConsumePendingSource
        ? [store consumePendingSourceTriggerId]
        : [store pendingSourceTriggerId];
    BOOL hasZoomRequest = config != nil || pendingSourceId.length > 0;
    BOOL isPopTransition = !shouldConsumePendingSource;

    if (!hasZoomRequest) {
      viewController.preferredTransition = nil;
      return;
    }

    NSString *sourceId = configuredSourceId ?: pendingSourceId;
    NSString *targetId = config.targetId.length > 0 ? config.targetId : sourceId;

    if (sourceId.length == 0) {
      ReactNavigationWarnOnce(
          [@"missing-zoom-source-id::" stringByAppendingString:routeKey],
          @"[native-stack] Zoom transition source ID could not be resolved. Falling back to regular transition.");
      viewController.preferredTransition = nil;
      return;
    }

    NSString *resolvedRouteKey = [routeKey copy];
    NSString *resolvedSourceId = [sourceId copy];
    NSString *resolvedTargetId = [targetId copy];

    UIZoomTransitionOptions *options = [UIZoomTransitionOptions new];
    if (config != nil) {
      if (config.dimmingColor != nil) {
        options.dimmingColor = config.dimmingColor;
      }

      if (config.dimmingBlurEffect.length > 0) {
        UIBlurEffect *blurEffect = ReactNavigationGetBlurEffect(config.dimmingBlurEffect);
        if (blurEffect != nil) {
          options.dimmingVisualEffect = blurEffect;
        } else {
          ReactNavigationWarnOnce(
              [@"invalid-zoom-dimming-blur-effect::" stringByAppendingString:routeKey],
              [NSString
                  stringWithFormat:
                      @"[native-stack] Unsupported `zoomTransitionDimmingBlurEffect` value '%@'. Falling back to default.",
                      config.dimmingBlurEffect]);
        }
      }

      if (config.interactiveDismissEnabled != nil) {
        BOOL interactiveDismissEnabled = config.interactiveDismissEnabled.boolValue;
        options.interactiveDismissShouldBegin = ^BOOL(__unused UIZoomTransitionInteractionContext *context) {
          return interactiveDismissEnabled;
        };
      }
    }

    options.alignmentRectProvider = ^CGRect(UIZoomTransitionAlignmentRectContext *context) {
      UIView *targetView = [store triggerViewForRouteKey:resolvedRouteKey triggerId:resolvedTargetId];
      UIView *zoomedRootView = context.zoomedViewController.view;
      if (targetView == nil || zoomedRootView == nil) {
        if (!isPopTransition) {
          ReactNavigationWarnOnce(
              [@"missing-zoom-target-view::" stringByAppendingString:resolvedRouteKey],
              @"[native-stack] Zoom transition target view is unavailable. Falling back to default alignment.");
        }
        return CGRectNull;
      }

      CGRect targetAlignmentRect =
          [store alignmentRectForRouteKey:resolvedRouteKey triggerId:resolvedTargetId];
      if (CGRectIsNull(targetAlignmentRect)) {
        targetAlignmentRect = targetView.bounds;
      }

      CGRect alignmentRect = [targetView convertRect:targetAlignmentRect toView:zoomedRootView];
      if (!ReactNavigationIsValidRect(alignmentRect)) {
        ReactNavigationWarnOnce(
            [@"invalid-zoom-alignment-rect::" stringByAppendingString:resolvedRouteKey],
            @"[native-stack] Zoom transition alignment rect is invalid. Falling back to default alignment.");
        return CGRectNull;
      }

      return alignmentRect;
    };

    viewController.preferredTransition =
        [UIViewControllerTransition zoomWithOptions:options
                                 sourceViewProvider:^UIView *_Nullable(UIZoomTransitionSourceViewProviderContext *context) {
                                   NSString *sourceRouteKey =
                                       ReactNavigationGetScreenIdForViewController(context.sourceViewController);
                                   if (sourceRouteKey.length == 0 ||
                                       resolvedSourceId.length == 0) {
                                     return nil;
                                   }

                                   UIView *sourceView = [store
                                       triggerViewForRouteKey:sourceRouteKey
                                                    triggerId:resolvedSourceId];
                                   if (sourceView == nil) {
                                     ReactNavigationWarnOnce(
                                         [NSString stringWithFormat:
                                                       @"missing-zoom-source-view::%@::%@",
                                                       sourceRouteKey,
                                                       resolvedSourceId],
                                         @"[native-stack] Zoom transition source view is unavailable. Falling back to regular transition.");
                                   }

                                   return sourceView;
                                 }];
  }
}
