
#import "HomeViewController.h"

@interface HomeViewController ()
@end
@implementation HomeViewController

- (id)initWithDelegate:(id<AppNavigationDelegate>)delegate;
{
  self = [super init];
  if (self) {
    navigation = delegate;
  }
  return self;
}

- (void)loadView {
  CGRect rect = [UIScreen mainScreen].bounds;
  self.view = [[UIView alloc] initWithFrame:rect];
  self.view.backgroundColor = [UIColor whiteColor];
  self.navigationItem.title = @"Home Screen";

  UILabel *labelView = [[UILabel alloc] initWithFrame:CGRectMake(5,80,self.view.frame.size.width,50)];
  labelView.text = @"This screen is native";
  labelView.textAlignment = NSTextAlignmentCenter;
  labelView.textColor = [UIColor blackColor];

  UIButton *button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [button addTarget:self
             action:@selector(openProfile:)
   forControlEvents:UIControlEventTouchUpInside];
  [button setTitle:@"Open Profile" forState:UIControlStateNormal];
  button.frame = CGRectMake(10.0, 120.0, self.view.frame.size.width, 40.0);

  UIButton *button2 = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [button2 addTarget:self
             action:@selector(openSettings:)
   forControlEvents:UIControlEventTouchUpInside];
  [button2 setTitle:@"Open Settings" forState:UIControlStateNormal];
  button2.frame = CGRectMake(10.0, 160.0, self.view.frame.size.width, 40.0);

  [self.view addSubview:button];
  [self.view addSubview:button2];
  [self.view addSubview:labelView];
}

- (void) openProfile:(UIButton*)sender
{
  [navigation openViewWithName:@"Profile" andParams:@{}];
}

- (void) openSettings:(UIButton*)sender
{
  [navigation openViewWithName:@"Settings" andParams:@{}];
}

@end
