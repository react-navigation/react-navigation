
#import <UIKit/UIKit.h>
#import "AppNavigationDelegate.h"
#import <React/RCTRootView.h>

@interface ReactViewController : UIViewController {
  id<AppNavigationDelegate> navigation;
  NSString* name;
  NSDictionary* params;
  RCTBridge* bridge;
}

- (id)initWithDelegate:(id<AppNavigationDelegate>)delegate bridge:(RCTBridge *)bridge viewName:(NSString *)name viewParams:(NSDictionary *)params;

@end

