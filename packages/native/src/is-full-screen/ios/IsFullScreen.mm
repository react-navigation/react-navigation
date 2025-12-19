#import "IsFullScreen.h"

#import <UIKit/UIKit.h>

@implementation IsFullScreen
- (NSNumber *)isFullScreen
{
      NSSet<UIScene *> *connectedScenes = [UIApplication sharedApplication].connectedScenes;

      for (UIScene *scene in connectedScenes) {
          if (![scene isKindOfClass:[UIWindowScene class]]) {
              continue;
          }

          UIWindowScene *windowScene = (UIWindowScene *)scene;
        
          return @([windowScene isFullScreen]);
      }

    return @(YES);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeIsFullScreenSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"IsFullScreen";
}

@end
