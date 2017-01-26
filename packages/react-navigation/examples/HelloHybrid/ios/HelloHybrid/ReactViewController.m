
#import "ReactViewController.h"
#import <React/RCTRootView.h>

@interface ReactViewController ()
@end
@implementation ReactViewController

- (id)initWithDelegate:(id<AppNavigationDelegate>)delegate bridge:(RCTBridge *)inBridge viewName:(NSString *)inName viewParams:(NSDictionary *)inParams
{
  self = [super init];
  if (self) {
    navigation = delegate;
    name = inName;
    params = inParams;
    bridge = inBridge;
  }
  return self;
}

- (void)loadView {
  self.navigationItem.title = @"";
  self.view = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"HelloHybrid" initialProperties: @{ @"name": name, @"params": params }];
  self.view.backgroundColor = [UIColor whiteColor];
}

- (void)requestClose:(UIButton*)sender
{
  [self dismissViewControllerAnimated:true completion:^{}];
}

@end


