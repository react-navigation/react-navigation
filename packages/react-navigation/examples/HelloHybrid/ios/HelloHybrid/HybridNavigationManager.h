#import <React/RCTBridgeModule.h>
#import "AppNavigationDelegate.h"


@interface HybridNavigationManager : NSObject <RCTBridgeModule>

 - (id)initWithBridge:(RCTBridge *)bridge navigationDelegate:(id<AppNavigationDelegate>)delegate;

@end
