
#import "ProfileViewController.h"

@interface ProfileViewController ()
@end
@implementation ProfileViewController

- (id)initWithDelegate:(id<AppNavigationDelegate>)delegate;
{
  self = [super init];
  if (self) {
    navigation = delegate;
  }
  return self;
}

- (void)loadView {
  self.view = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.view.backgroundColor = [UIColor whiteColor];
  self.navigationItem.title = @"Profile Screen";

  UILabel *labelView = [[UILabel alloc] initWithFrame:CGRectMake(5,80,self.view.frame.size.width,50)];
  labelView.text = @"This screen is native";
  labelView.textAlignment = NSTextAlignmentCenter;
  labelView.textColor = [UIColor blackColor];

  UIButton *button = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [button addTarget:self
             action:@selector(openStory:)
   forControlEvents:UIControlEventTouchUpInside];
  [button setTitle:@"Open Story" forState:UIControlStateNormal];
  button.frame = CGRectMake(10.0, 120.0, self.view.frame.size.width, 40.0);

  UIButton *button2 = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [button2 addTarget:self
             action:@selector(openSettings:)
   forControlEvents:UIControlEventTouchUpInside];
  [button2 setTitle:@"Open Settings" forState:UIControlStateNormal];
  button2.frame = CGRectMake(10.0, 160.0, self.view.frame.size.width, 40.0);

  UIButton *button3 = [UIButton buttonWithType:UIButtonTypeRoundedRect];
  [button3 addTarget:self
             action:@selector(openAdvancedSettings:)
   forControlEvents:UIControlEventTouchUpInside];
  [button3 setTitle:@"Open Advanced Settings" forState:UIControlStateNormal];
  button3.frame = CGRectMake(10.0, 200.0, self.view.frame.size.width, 40.0);

  [self.view addSubview:button];
  [self.view addSubview:button2];
  [self.view addSubview:button3];
  [self.view addSubview:labelView];
}

- (void)openStory:(UIButton*)sender
{
  [navigation openViewWithName:@"Story" andParams:@{ @"id": @"4242" }];
}

- (void)openSettings:(UIButton*)sender
{
  [navigation openViewWithName:@"Settings" andParams:@{}];
}

- (void)openAdvancedSettings:(UIButton*)sender
{
  [navigation openViewWithName:@"AdvancedSettings" andParams:@{}];
}


@end
