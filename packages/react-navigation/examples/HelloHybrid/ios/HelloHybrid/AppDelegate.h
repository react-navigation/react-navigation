
#import <UIKit/UIKit.h>
#import <React/RCTRootView.h>
#import "AppNavigationDelegate.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, AppNavigationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) UIViewController *rootController;
@property (strong, nonatomic) UINavigationController *nav;
@property (strong, nonatomic) RCTBridge *bridge;

@end
