#import <UIKit/UIKit.h>

#import <cmath>
#import <objc/runtime.h>

#import <React/RCTLog.h>

#import "ReactNavigationNativeStackZoomTransitionAnimator.h"
#import "ReactNavigationNativeStackZoomTransitionStore.h"

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

static NSString *_Nullable ReactNavigationGetScreenId(UIViewController *viewController)
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

  id screenId = [screenView valueForKey:@"screenId"];
  if ([screenId isKindOfClass:[NSString class]]) {
    return (NSString *)screenId;
  }

  return nil;
}

static BOOL ReactNavigationIsValidFrame(CGRect frame)
{
  if (CGRectIsNull(frame) || CGRectIsEmpty(frame) || CGRectIsInfinite(frame)) {
    return NO;
  }

  return std::isfinite(frame.origin.x) && std::isfinite(frame.origin.y) &&
      std::isfinite(frame.size.width) && std::isfinite(frame.size.height);
}

static UIBlurEffect *_Nullable ReactNavigationGetBlurEffect(NSString *blurEffect)
{
  if ([blurEffect isEqualToString:@"regular"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleRegular];
  }

  if ([blurEffect isEqualToString:@"prominent"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleProminent];
  }

  if ([blurEffect isEqualToString:@"systemUltraThinMaterial"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemUltraThinMaterial];
  }

  if ([blurEffect isEqualToString:@"systemThinMaterial"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThinMaterial];
  }

  if ([blurEffect isEqualToString:@"systemMaterial"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemMaterial];
  }

  if ([blurEffect isEqualToString:@"systemThickMaterial"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThickMaterial];
  }

  if ([blurEffect isEqualToString:@"systemChromeMaterial"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemChromeMaterial];
  }

  if ([blurEffect isEqualToString:@"systemUltraThinMaterialLight"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemUltraThinMaterialLight];
  }

  if ([blurEffect isEqualToString:@"systemThinMaterialLight"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThinMaterialLight];
  }

  if ([blurEffect isEqualToString:@"systemMaterialLight"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemMaterialLight];
  }

  if ([blurEffect isEqualToString:@"systemThickMaterialLight"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThickMaterialLight];
  }

  if ([blurEffect isEqualToString:@"systemChromeMaterialLight"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemChromeMaterialLight];
  }

  if ([blurEffect isEqualToString:@"systemUltraThinMaterialDark"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemUltraThinMaterialDark];
  }

  if ([blurEffect isEqualToString:@"systemThinMaterialDark"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThinMaterialDark];
  }

  if ([blurEffect isEqualToString:@"systemMaterialDark"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemMaterialDark];
  }

  if ([blurEffect isEqualToString:@"systemThickMaterialDark"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemThickMaterialDark];
  }

  if ([blurEffect isEqualToString:@"systemChromeMaterialDark"]) {
    return [UIBlurEffect effectWithStyle:UIBlurEffectStyleSystemChromeMaterialDark];
  }

  return nil;
}

static UIViewController *_Nullable ReactNavigationGetZoomedViewController(
    UINavigationControllerOperation operation,
    UIViewController *fromViewController,
    UIViewController *toViewController)
{
  switch (operation) {
    case UINavigationControllerOperationPush:
      return toViewController;
    case UINavigationControllerOperationPop:
      return fromViewController;
    default:
      return nil;
  }
}

static UINavigationController *_Nullable ReactNavigationGetStackNavigationController(id stackView)
{
  if (stackView == nil) {
    return nil;
  }

  @try {
    id controller = [stackView valueForKey:@"_controller"];
    if ([controller isKindOfClass:[UINavigationController class]]) {
      return (UINavigationController *)controller;
    }
  } @catch (__unused NSException *exception) {
    return nil;
  }

  return nil;
}

static void ReactNavigationApplyNativeZoomTransition(
    UINavigationControllerOperation operation,
    UIViewController *fromViewController,
    UIViewController *toViewController)
{
  if (@available(iOS 18.0, *)) {
    UIViewController *zoomedViewController =
        ReactNavigationGetZoomedViewController(operation, fromViewController, toViewController);
    if (zoomedViewController == nil) {
      return;
    }

    NSString *zoomedRouteKey = ReactNavigationGetScreenId(zoomedViewController);
    if (zoomedRouteKey.length == 0) {
      zoomedViewController.preferredTransition = nil;
      return;
    }

    ReactNavigationNativeStackZoomTransitionStore *store =
        [ReactNavigationNativeStackZoomTransitionStore sharedStore];
    ReactNavigationNativeStackZoomRouteConfig *config = [store routeConfigForRouteKey:zoomedRouteKey];
    NSString *configuredSourceId = config != nil && config.sourceId.length > 0 ? config.sourceId : nil;
    NSString *pendingSourceId = nil;

    if (operation == UINavigationControllerOperationPush) {
      pendingSourceId = [store consumePendingSourceTriggerId];
    }

    NSString *sourceId = nil;
    if (operation == UINavigationControllerOperationPush) {
      sourceId = pendingSourceId;
    } else {
      sourceId = configuredSourceId.length > 0 ? configuredSourceId : pendingSourceId;
    }
    NSString *targetId = nil;

    if (config != nil) {
      targetId = config.targetId.length > 0 ? config.targetId : sourceId;
    } else {
      targetId = sourceId;
    }

    if (sourceId.length == 0) {
      ReactNavigationWarnOnce(
          @"missing-zoom-source-id",
          @"[native-stack] Zoom transition source ID could not be resolved. Falling back to regular transition.");
      zoomedViewController.preferredTransition = nil;
      return;
    }

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
              @"invalid-zoom-dimming-blur-effect",
              [NSString
                  stringWithFormat:
                      @"[native-stack] Unsupported `zoomTransitionDimmingBlurEffect` value '%@'. Falling back to default.",
                      config.dimmingBlurEffect]);
        }
      }

      if ([config.interactiveDismiss isEqualToString:@"always"]) {
        options.interactiveDismissShouldBegin = ^BOOL(__unused UIZoomTransitionInteractionContext *context) {
          return YES;
        };
      } else if ([config.interactiveDismiss isEqualToString:@"never"]) {
        options.interactiveDismissShouldBegin = ^BOOL(__unused UIZoomTransitionInteractionContext *context) {
          return NO;
        };
      } else if (
          config.interactiveDismiss.length > 0 &&
          ![config.interactiveDismiss isEqualToString:@"default"]) {
        ReactNavigationWarnOnce(
            @"invalid-zoom-interactive-dismiss",
            [NSString
                stringWithFormat:
                    @"[native-stack] Unsupported `zoomTransitionInteractiveDismiss` value '%@'. Falling back to default behavior.",
                    config.interactiveDismiss]);
      }
    }

    options.alignmentRectProvider = ^CGRect(UIZoomTransitionAlignmentRectContext *context) {
      NSString *contextZoomedRouteKey = ReactNavigationGetScreenId(context.zoomedViewController);
      if (contextZoomedRouteKey.length == 0 || resolvedTargetId.length == 0) {
        return CGRectNull;
      }

      UIView *targetView = [store triggerViewForRouteKey:contextZoomedRouteKey triggerId:resolvedTargetId];
      UIView *zoomedRootView = context.zoomedViewController.view;
      if (targetView == nil || zoomedRootView == nil) {
        ReactNavigationWarnOnce(
            @"missing-zoom-target-view",
            @"[native-stack] Zoom transition target view is unavailable. Falling back to default alignment.");
        return CGRectNull;
      }

      CGRect targetAlignmentRect =
          [store alignmentRectForRouteKey:contextZoomedRouteKey triggerId:resolvedTargetId];
      if (CGRectIsNull(targetAlignmentRect)) {
        targetAlignmentRect = targetView.bounds;
      }

      CGRect alignmentRect = [targetView convertRect:targetAlignmentRect toView:zoomedRootView];
      if (!ReactNavigationIsValidFrame(alignmentRect)) {
        ReactNavigationWarnOnce(
            @"invalid-zoom-alignment-rect",
            @"[native-stack] Zoom transition alignment rect is invalid. Falling back to default alignment.");
        return CGRectNull;
      }

      return ReactNavigationIsValidFrame(alignmentRect) ? alignmentRect : CGRectNull;
    };

    zoomedViewController.preferredTransition =
        [UIViewControllerTransition zoomWithOptions:options
                                 sourceViewProvider:^UIView *_Nullable(UIZoomTransitionSourceViewProviderContext *context) {
                                   NSString *contextSourceRouteKey =
                                       ReactNavigationGetScreenId(context.sourceViewController);
                                   if (contextSourceRouteKey.length == 0 ||
                                       resolvedSourceId.length == 0) {
                                     return nil;
                                   }

                                   UIView *sourceView = [store
                                       triggerViewForRouteKey:contextSourceRouteKey
                                                    triggerId:resolvedSourceId];
                                   if (sourceView == nil) {
                                     ReactNavigationWarnOnce(
                                         @"missing-zoom-source-view",
                                         @"[native-stack] Zoom transition source view is unavailable. Falling back to regular transition.");
                                   }

                                   return sourceView;
                                 }];
  }
}

@interface NSObject (ReactNavigationNativeStackZoomTransition)

- (id<UIViewControllerAnimatedTransitioning>)
    reactNavigation_zoom_navigationController:(UINavigationController *)navigationController
                animationControllerForOperation:(UINavigationControllerOperation)operation
                             fromViewController:(UIViewController *)fromViewController
                               toViewController:(UIViewController *)toViewController;
- (void)reactNavigation_zoom_setPushViewControllers:(NSArray<UIViewController *> *)controllers;

@end

@implementation NSObject (ReactNavigationNativeStackZoomTransition)

- (id<UIViewControllerAnimatedTransitioning>)
    reactNavigation_zoom_navigationController:(UINavigationController *)navigationController
                animationControllerForOperation:(UINavigationControllerOperation)operation
                             fromViewController:(UIViewController *)fromViewController
                               toViewController:(UIViewController *)toViewController
{
  if (operation == UINavigationControllerOperationPop) {
    ReactNavigationApplyNativeZoomTransition(operation, fromViewController, toViewController);
  }

  return [self reactNavigation_zoom_navigationController:navigationController
                          animationControllerForOperation:operation
                                       fromViewController:fromViewController
                                         toViewController:toViewController];
}

- (void)reactNavigation_zoom_setPushViewControllers:(NSArray<UIViewController *> *)controllers
{
  UINavigationController *navigationController =
      ReactNavigationGetStackNavigationController(self);

  if (navigationController != nil) {
    NSArray<UIViewController *> *currentControllers = navigationController.viewControllers;
    UIViewController *fromViewController = currentControllers.lastObject;
    UIViewController *toViewController = controllers.lastObject;

    BOOL isPushOperation = fromViewController != nil && toViewController != nil && fromViewController != toViewController &&
        [controllers containsObject:fromViewController] &&
        ![currentControllers containsObject:toViewController];
    BOOL hasTransitionCandidate =
        fromViewController != nil && toViewController != nil &&
        fromViewController != toViewController;

    if (isPushOperation) {
      ReactNavigationApplyNativeZoomTransition(
          UINavigationControllerOperationPush,
          fromViewController,
          toViewController);
    } else if (hasTransitionCandidate) {
      ReactNavigationWarnOnce(
          @"ambiguous-zoom-push-path",
          @"[native-stack] Push transition shape is ambiguous for zoom matching. Falling back to regular transition.");
    }
  }

  [self reactNavigation_zoom_setPushViewControllers:controllers];
}

@end

extern "C" void ReactNavigationInstallNativeStackZoomTransitionHook(void)
{
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    Class stackClass = NSClassFromString(@"RNSScreenStackView");
    if (stackClass == Nil) {
      return;
    }

    SEL originalSelector = NSSelectorFromString(
        @"navigationController:animationControllerForOperation:fromViewController:toViewController:");
    SEL replacementSelector =
        @selector(reactNavigation_zoom_navigationController:
                      animationControllerForOperation:
                      fromViewController:
                      toViewController:);
    SEL originalSetPushSelector = NSSelectorFromString(@"setPushViewControllers:");
    SEL replacementSetPushSelector =
        @selector(reactNavigation_zoom_setPushViewControllers:);

    Method originalMethod = class_getInstanceMethod(stackClass, originalSelector);
    Method replacementMethod = class_getInstanceMethod(stackClass, replacementSelector);
    Method originalSetPushMethod = class_getInstanceMethod(stackClass, originalSetPushSelector);
    Method replacementSetPushMethod = class_getInstanceMethod(stackClass, replacementSetPushSelector);

    if (originalMethod == nil || replacementMethod == nil) {
      return;
    }

    class_addMethod(
        stackClass,
        replacementSelector,
        method_getImplementation(replacementMethod),
        method_getTypeEncoding(replacementMethod));

    replacementMethod = class_getInstanceMethod(stackClass, replacementSelector);
    if (replacementMethod == nil) {
      return;
    }

    method_exchangeImplementations(originalMethod, replacementMethod);

    if (originalSetPushMethod != nil && replacementSetPushMethod != nil) {
      class_addMethod(
          stackClass,
          replacementSetPushSelector,
          method_getImplementation(replacementSetPushMethod),
          method_getTypeEncoding(replacementSetPushMethod));

      replacementSetPushMethod = class_getInstanceMethod(stackClass, replacementSetPushSelector);
      if (replacementSetPushMethod != nil) {
        method_exchangeImplementations(originalSetPushMethod, replacementSetPushMethod);
      }
    }
  });
}
