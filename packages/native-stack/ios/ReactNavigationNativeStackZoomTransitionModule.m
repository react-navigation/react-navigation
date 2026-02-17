#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

#import "ReactNavigationNativeStackZoomTransitionAnimator.h"
#import "ReactNavigationNativeStackZoomTransitionStore.h"

@interface ReactNavigationNativeStackZoomTransitionModule : NSObject <RCTBridgeModule>
@end

static void ReactNavigationNativeStackZoomTransitionRunOnMainQueueSync(dispatch_block_t block)
{
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_sync(dispatch_get_main_queue(), block);
  }
}

@implementation ReactNavigationNativeStackZoomTransitionModule

RCT_EXPORT_MODULE(ReactNavigationNativeStackZoomTransitionModule)

+ (BOOL)requiresMainQueueSetup
{
  ReactNavigationInstallNativeStackZoomTransitionHook();
  return YES;
}

RCT_EXPORT_METHOD(setRouteConfig
                  : (NSString *)routeKey sourceId
                  : (nullable NSString *)sourceId targetId
                  : (nullable NSString *)targetId dimmingColor
                  : (nullable id)dimmingColor dimmingBlurEffect
                  : (nullable NSString *)dimmingBlurEffect interactiveDismiss
                  : (nullable NSString *)interactiveDismiss)
{
  ReactNavigationNativeStackZoomTransitionRunOnMainQueueSync(^{
    ReactNavigationInstallNativeStackZoomTransitionHook();

    UIColor *resolvedDimmingColor = nil;
    if (dimmingColor != nil) {
      resolvedDimmingColor = [RCTConvert UIColor:dimmingColor];
    }

    [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
        setRouteConfigForRouteKey:routeKey
                         sourceId:sourceId
                         targetId:targetId
                     dimmingColor:resolvedDimmingColor
               dimmingBlurEffect:dimmingBlurEffect
               interactiveDismiss:interactiveDismiss];
  });
}

RCT_EXPORT_METHOD(clearRouteConfig : (NSString *)routeKey)
{
  ReactNavigationNativeStackZoomTransitionRunOnMainQueueSync(^{
    ReactNavigationInstallNativeStackZoomTransitionHook();
    [[ReactNavigationNativeStackZoomTransitionStore sharedStore] clearRouteConfigForRouteKey:routeKey];
  });
}

RCT_EXPORT_METHOD(setPendingSource
                  : (NSString *)sourceId)
{
  ReactNavigationNativeStackZoomTransitionRunOnMainQueueSync(^{
    ReactNavigationInstallNativeStackZoomTransitionHook();

    [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
        setPendingSourceTriggerId:sourceId];
  });
}

@end
