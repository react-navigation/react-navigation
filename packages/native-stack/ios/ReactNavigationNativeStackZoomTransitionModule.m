#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

#import "ReactNavigationNativeStackZoomTransitionAnimator.h"
#import "ReactNavigationNativeStackZoomTransitionStore.h"
#import "ReactNavigationNativeStackZoomTransitionUtils.h"

@interface ReactNavigationNativeStackZoomTransitionModule : NSObject <RCTBridgeModule>
@end

@implementation ReactNavigationNativeStackZoomTransitionModule

RCT_EXPORT_MODULE(ReactNavigationNativeStackZoomTransitionModule)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_METHOD(setRouteConfig
                  : (NSString *)routeKey sourceId
                  : (nullable NSString *)sourceId targetId
                  : (nullable NSString *)targetId dimmingColor
                  : (nullable id)dimmingColor dimmingBlurEffect
                  : (nullable NSString *)dimmingBlurEffect interactiveDismissEnabled
                  : (nullable NSNumber *)interactiveDismissEnabled)
{
  if (routeKey.length == 0) {
    return;
  }

  UIColor *resolvedDimmingColor = nil;
  if (dimmingColor != nil) {
    resolvedDimmingColor = [RCTConvert UIColor:dimmingColor];
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
        setRouteConfigForRouteKey:routeKey
                         sourceId:sourceId
                         targetId:targetId
                     dimmingColor:resolvedDimmingColor
               dimmingBlurEffect:dimmingBlurEffect
           interactiveDismissEnabled:interactiveDismissEnabled];

    [[NSNotificationCenter defaultCenter]
        postNotificationName:ReactNavigationRouteConfigDidChangeNotificationName
                      object:nil
                    userInfo:@{ReactNavigationRouteConfigDidChangeRouteKeyUserInfoKey : routeKey}];
  });
}

RCT_EXPORT_METHOD(clearRouteConfig : (NSString *)routeKey)
{
  if (routeKey.length == 0) {
    return;
  }

  dispatch_async(dispatch_get_main_queue(), ^{
    [[ReactNavigationNativeStackZoomTransitionStore sharedStore] clearRouteConfigForRouteKey:routeKey];

    [[NSNotificationCenter defaultCenter]
        postNotificationName:ReactNavigationRouteConfigDidChangeNotificationName
                      object:nil
                    userInfo:@{ReactNavigationRouteConfigDidChangeRouteKeyUserInfoKey : routeKey}];
  });
}

RCT_EXPORT_METHOD(setPendingSource
                  : (NSString *)sourceId)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[ReactNavigationNativeStackZoomTransitionStore sharedStore]
        setPendingSourceTriggerId:sourceId];

    [[NSNotificationCenter defaultCenter]
        postNotificationName:ReactNavigationPendingSourceDidChangeNotificationName
                      object:nil];
  });
}

@end
