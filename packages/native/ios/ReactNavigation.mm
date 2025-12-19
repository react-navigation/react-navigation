#import "ReactNavigation.h"

#import <UIKit/UIKit.h>

static UIWindow *ReactNavigationGetPreferredWindow(void)
{
    UIWindow *fallbackWindow = nil;


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

static NSDictionary *ReactNavigationDictionaryFromInsets(UIEdgeInsets insets)
{
    return @{
        @"top": @(insets.top),
        @"right": @(insets.right),
        @"bottom": @(insets.bottom),
        @"left": @(insets.left),
    };
}

static NSDictionary *
ReactNavigationSafeAreaLayoutForAxis(UIViewLayoutRegionAdaptivityAxis axis)
{
    UIWindow *window = ReactNavigationGetPreferredWindow();

    if (window == nil) {
        return ReactNavigationDictionaryFromInsets(UIEdgeInsetsZero);
    }

    UIEdgeInsets insets = window.safeAreaInsets;

    if (@available(iOS 17.0, *)) {
        UIViewLayoutRegion *region =
            [UIViewLayoutRegion safeAreaLayoutRegionWithCornerAdaptation:axis];

        if (region != nil &&
            [window respondsToSelector:@selector(edgeInsetsForLayoutRegion:)]) {
            insets = [window edgeInsetsForLayoutRegion:region];
        }
    }

    return ReactNavigationDictionaryFromInsets(insets);
}

@implementation ReactNavigation
- (NSNumber *)isFullScreen
{
    UIWindow *window = ReactNavigationGetPreferredWindow();
    UIWindowScene *windowScene = window.windowScene;

    if (windowScene != nil) {
        return @([windowScene isFullScreen]);
    }

    return @(YES);
}

- (NSDictionary *)safeAreaLayoutForVerticalAdaptivity
{
    return ReactNavigationSafeAreaLayoutForAxis(
        UIViewLayoutRegionAdaptivityAxisVertical);
}

- (NSDictionary *)safeAreaLayoutForHorizontalAdaptivity
{
    return ReactNavigationSafeAreaLayoutForAxis(
        UIViewLayoutRegionAdaptivityAxisHorizontal);
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
