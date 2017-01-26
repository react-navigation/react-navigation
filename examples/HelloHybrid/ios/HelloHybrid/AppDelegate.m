
#import "AppDelegate.h"

#import "HomeViewController.h"
#import "ProfileViewController.h"
#import "ReactViewController.h"
#import "HybridNavigationManager.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions: launchOptions];
  _window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  _rootController = [[HomeViewController alloc] initWithDelegate:self];
  _nav = [[UINavigationController alloc] initWithRootViewController:self.rootController];
  [_window addSubview:_nav.view];
  [_window setRootViewController:_nav];
  [_window makeKeyAndVisible];
  return YES;
}

#pragma mark AppNavigationDelegate

- (void)openViewWithName:(NSString *)name andParams:(NSDictionary *)params
{
  if ([name isEqualToString:@"Profile"]) {
    ProfileViewController *profileView = [[ProfileViewController alloc] initWithDelegate: self];
    [_nav pushViewController:profileView animated:true];
    return;
  }

  ReactViewController *reactView = [[ReactViewController alloc] initWithDelegate:self bridge:_bridge viewName:name viewParams:params];
  [_nav pushViewController:reactView animated:true];
}

#pragma mark RCTBridgeDelegate

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"examples/HelloHybrid/index.ios" fallbackResource:nil];
}

- (NSArray<id<RCTBridgeModule>> *)extraModulesForBridge:(RCTBridge *)bridge;
{
  return @[
    [[HybridNavigationManager alloc] initWithBridge:_bridge navigationDelegate:self],
  ];
}

@end
