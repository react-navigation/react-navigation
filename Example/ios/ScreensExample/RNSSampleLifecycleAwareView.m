#import <React/RCTViewManager.h>

@interface RNSLifecycleAwareView : UIView
@end

@implementation RNSLifecycleAwareView

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  BOOL isVisible = self.superview && self.window;
  if (isVisible) {
    NSLog(@"ATTACHED");
  } else {
    NSLog(@"DETTACHED");
  }
}

@end

@interface RNSLifecycleAwareViewManager : RCTViewManager
@end

@implementation RNSLifecycleAwareViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSLifecycleAwareView new];
}

@end
